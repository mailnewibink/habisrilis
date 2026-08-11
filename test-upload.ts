import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: { user }, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'mailnewibink@gmail.com',
    password: 'password123'
  });
  if (authErr) {
    console.error(authErr);
    return;
  }
  
  const blob = new Blob(["test image content"], { type: 'text/plain' });
  const path = `${user.id}/test-upload`;
  const filename = `${path}.txt`;
  
  const { data, error } = await supabase.storage.from('artwork').upload(filename, blob, {
    contentType: 'text/plain',
    upsert: true,
  });
  console.log('Artwork Upload:', data, error);
}
run();
