import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: profile } = await supabase.from('profiles').select('id, email').eq('email', 'mailnewibink@gmail.com').single();
  console.log('Profile for mailnewibink@gmail.com:', profile);
}
run();
