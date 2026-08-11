import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- SQL QUERY ---');
  const { data, error } = await supabase.rpc('execute_sql', { 
    sql: "SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'artists';" 
  });
  if (error) console.log('Error:', error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
