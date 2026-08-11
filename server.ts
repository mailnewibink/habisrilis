import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST

  app.use(express.json());

  app.get("/api/featured", (req, res) => {
    try {
      if (fs.existsSync('featured.json')) {
        const data = JSON.parse(fs.readFileSync('featured.json', 'utf-8'));
        res.json(data);
      } else {
        res.json({ featuredReleaseId: null });
      }
    } catch (e) {
      res.json({ featuredReleaseId: null });
    }
  });

  app.post("/api/admin/featured", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });
      const token = authHeader.replace("Bearer ", "");
      if (!token) return res.status(401).json({ error: "Missing token" });
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ error: authError?.message || "Invalid authentication" });
      if (user.email !== "mailnewibink@gmail.com") return res.status(403).json({ error: "Admin access required" });
      
      const { featuredReleaseId } = req.body;
      fs.writeFileSync('featured.json', JSON.stringify({ featuredReleaseId }));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  
  // --- SUPER ADMIN ROUTES ---

  const checkAdmin = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return { error: "Missing authorization header", status: 401 };
    const token = authHeader.replace("Bearer ", "");
    if (!token) return { error: "Missing token", status: 401 };
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEYS;
    
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return { error: "Server missing Supabase configuration", status: 500 };
    }
    
    let actualServiceKey = supabaseServiceKey;
    try {
      const parsed = JSON.parse(supabaseServiceKey);
      actualServiceKey = parsed.default || supabaseServiceKey;
    } catch (e) {}

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    const supabaseAdmin = createClient(supabaseUrl!, actualServiceKey!);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return { error: authError?.message || "Invalid authentication", status: 401 };
    if (user.email !== "mailnewibink@gmail.com") return { error: "Admin access required", status: 403 };

    return { supabaseAdmin, user };
  };

  app.get("/api/admin/users", async (req, res) => {
    try {
      const auth = await checkAdmin(req, res);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });
      const { supabaseAdmin } = auth;
      
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) return res.status(400).json({ error: error.message });
      res.json({ users: data.users });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/releases", async (req, res) => {
    try {
      const auth = await checkAdmin(req, res);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });
      const { supabaseAdmin } = auth;
      
      const { data, error } = await supabaseAdmin
        .from('releases')
        .select('id, title, slug, artist:artists(displayName:display_name, username), status')
        .order('created_at', { ascending: false });
        
      if (error) return res.status(400).json({ error: error.message });
      res.json({ releases: data });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const auth = await checkAdmin(req, res);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });
      const { supabaseAdmin } = auth;
      
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
      if (error) return res.status(400).json({ error: error.message });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/releases/:id", async (req, res) => {
    try {
      const auth = await checkAdmin(req, res);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });
      const { supabaseAdmin } = auth;
      
      const { data, error } = await supabaseAdmin.from('releases').delete().eq('id', req.params.id);
      if (error) return res.status(400).json({ error: error.message });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  // --- END SUPER ADMIN ROUTES ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/admin/claims", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Missing authorization header" });
      }

      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Missing token" });
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEYS;
      
      if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        return res.status(500).json({ error: "Server missing Supabase configuration" });
      }
      
      // Parse service key if it's the edge function JSON format
      let actualServiceKey = supabaseServiceKey;
      try {
        const parsed = JSON.parse(supabaseServiceKey);
        actualServiceKey = parsed.default || supabaseServiceKey;
      } catch (e) {
        // Not JSON, use as-is
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: authError?.message || "Invalid authentication" });
      }

      if (user.email !== "mailnewibink@gmail.com") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const supabaseAdmin = createClient(supabaseUrl, actualServiceKey);
      const { data, error } = await supabaseAdmin
        .from("artist_claims")
        .select(`
          *,
          artists (
            display_name,
            username,
            avatar_url,
            verification_status
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
