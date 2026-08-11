import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: artist, error: artistError } = await supabase.from('artists').select('*').eq('username', 'pramuparty').single();
  console.log('Artist User ID:', artist?.user_id);
}
run();
