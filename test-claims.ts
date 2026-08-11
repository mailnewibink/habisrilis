import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, count, error } = await supabase
    .from('artist_claims')
    .select('*', { count: 'exact' })
    .limit(1);
  console.log("Claims Data:", data, "Error:", error);
}
run();
