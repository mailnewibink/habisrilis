import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const usernames = ['sanurima', 'pp', 'kopidankretek', 'pramuparty'];
  for (const u of usernames) {
    const { data, error } = await supabase.from('artists').select('*').eq('username', u).single();
    if (error) console.log(u, error);
    else console.log(u, 'OK');
  }
}
run();
