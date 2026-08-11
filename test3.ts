import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: userObj } = await supabase.from('users').select('*').eq('email', 'mailnewibink@gmail.com').single();
  // Or maybe there is no 'users' table, we might need to query auth.users if we have access, but anon key can't.
  // Instead, let's look for the artist with username 'pramuparty' to find user_id.
  
  const { data: artist, error: artistError } = await supabase.from('artists').select('*').eq('username', 'pramuparty').single();
  console.log('Artist:', artist, artistError);
}
run();
