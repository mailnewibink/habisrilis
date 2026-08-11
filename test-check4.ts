import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: membersData, error: membersError } = await supabase
    .from('artist_members')
    .select('artists(*)');
    
  console.log('Members Data:', JSON.stringify(membersData, null, 2));
  console.log('Members Error:', membersError);
}
run();
