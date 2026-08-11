import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, count, error } = await supabase
    .from('artists')
    .select('id', { count: 'exact', head: true })
    .limit(1);
  console.log("Head true Data:", data, "Count:", count, "Error:", error);
}
run();
