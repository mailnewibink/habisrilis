async function test() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(`${supabaseUrl}/rest/v1/artist_followers?select=id&limit=1`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
test();
