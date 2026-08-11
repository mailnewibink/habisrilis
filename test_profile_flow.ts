import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const username = 'pramuparty';
  
  console.log('1. getArtistByUsername');
  try {
    const { data: artist, error: err1 } = await supabase
      .from('artists')
      .select('*')
      .eq('username', username)
      .single();
    
    if (err1) {
      console.log('Error in getArtistByUsername:', err1);
      return;
    }
    console.log('getArtistByUsername: success');
    
    console.log('2. getReleasesByArtistId');
    const { data: releases, error: err2 } = await supabase
      .from('releases')
      .select('*')
      .eq('artist_id', artist.id)
      .eq('status', 'live')
      .order('created_at', { ascending: false });
      
    if (err2) {
      console.log('Error in getReleasesByArtistId:', err2);
      console.log(err2.stack || err2);
      return;
    }
    console.log('getReleasesByArtistId: success');
    
  } catch (e) {
    console.error('Caught error:', e);
  }
}
run();
