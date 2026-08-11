import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: { user }, error } = await supabase.auth.signInWithOtp({
    email: 'mailnewibink@gmail.com',
  });
  console.log('OTP sent?', error ? error : 'yes');
}
run();
