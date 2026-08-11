import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email: 'mailnewibink@gmail.com',
    password: 'password123' // Or whatever it is, I can't do this easily.
  });
}
