import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: legacyData, error: legacyError } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', '0a02524f-7e85-4310-8e03-51da1b4ba6e1');
    
  console.log('Legacy Data:', JSON.stringify(legacyData, null, 2));
  console.log('Legacy Error:', legacyError);
}
run();
