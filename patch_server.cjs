const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf-8');

const newRoutes = `
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

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, actualServiceKey);
    
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
`;

if (!serverContent.includes('SUPER ADMIN ROUTES')) {
  serverContent = serverContent.replace('app.get("/api/health", (req, res) => {', newRoutes + '\n  app.get("/api/health", (req, res) => {');
  fs.writeFileSync('server.ts', serverContent);
  console.log('Patched server.ts');
} else {
  console.log('Already patched server.ts');
}
