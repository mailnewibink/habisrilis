import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: legacyData, error: legacyError } = await supabase
    .from('artists')
    .select('user_id')
    .eq('username', 'kopidankretek');
    
  console.log('Legacy Data:', JSON.stringify(legacyData, null, 2));
}
run();
