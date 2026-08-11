import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEYS;

console.log("URL exists:", !!supabaseUrl);
console.log("Service Key exists:", !!supabaseServiceKey);

if (supabaseServiceKey) {
  try {
    const parsed = JSON.parse(supabaseServiceKey);
    supabaseServiceKey = parsed.default || supabaseServiceKey;
  } catch (e) {}

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  async function run() {
    const { data, error } = await supabase
      .from('releases')
      .select('id, title, slug, artist:artists(displayName, username), status')
      .order('created_at', { ascending: false });
      
    console.log("Error:", error);
    console.log("Rows:", data ? data.length : 0);
    if (error) console.log(error);
  }
  run();
}
