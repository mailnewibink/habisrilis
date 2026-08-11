import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const cleanUsername = 'pramuparty';
  const user = null;
  
  console.log('1. getArtistByUsername');
  let artistData;
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('username', cleanUsername)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') artistData = null;
      else throw error;
    } else {
      artistData = data;
    }
    console.log('getArtistByUsername: success');
  } catch (err) {
    console.error('getArtistByUsername: error', err);
    return;
  }
  
  if (!artistData) {
    console.log('Artist not found');
    return;
  }
  
  if (user) {
    console.log('2. checkIsFollowing');
  }
  
  console.log('3. getReleasesByArtistId');
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('artist_id', artistData.id)
      .eq('status', 'live')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    console.log('getReleasesByArtistId: success');
  } catch (err) {
    console.error('getReleasesByArtistId: error', err);
    console.log(err);
  }
}
run();
