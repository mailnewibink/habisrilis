import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  // We can query artist_members to see if mailnewibink@gmail.com has any records, but we just want the ID.
  // The 'users' table or 'profiles' table might have it. Let's list tables.
  const { data: profile } = await supabase.from('users').select('*').eq('email', 'mailnewibink@gmail.com');
  console.log('users:', profile);
  const { data: profile2 } = await supabase.from('profiles').select('*').eq('email', 'mailnewibink@gmail.com');
  console.log('profiles:', profile2);
}
run();
