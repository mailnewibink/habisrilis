import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase
    .from('artist_followers')
    .select('id')
    .eq('artist_id', '5e18684d-e9c1-4b13-9818-a6d10f27918a')
    .eq('user_id', '5e18684d-e9c1-4b13-9818-a6d10f27918b')
    .single();
  console.log("Data:", data, "Error:", error);
}
run();
