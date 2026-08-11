import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const username = 'pramuparty';
  
  console.log('1. getArtistByUsername()');
  let artistData;
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('username', username)
      .single();
    if (error) throw error;
    artistData = data;
    console.log('success');
  } catch (err: any) {
    if (err.code === 'PGRST116') {
      console.log('success (null)');
    } else {
      console.log('error');
      console.log(err.message);
      console.log(err.stack);
      return;
    }
  }

  if (!artistData) {
    console.log('setNotFound(true) called because artistData is null');
    return;
  }
  
  // Is user logged in? no.
  // We skip checkIsFollowing.
  
  console.log('2. getReleasesByArtistId()');
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('artist_id', artistData.id)
      .eq('status', 'live')
      .order('created_at', { ascending: false });
    if (error) throw error;
    console.log('success');
  } catch (err: any) {
    console.log('error');
    console.log(err.message);
    console.log(err.stack);
  }
}
run();
