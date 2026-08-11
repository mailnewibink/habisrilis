import dotenv from 'dotenv';
dotenv.config();

import { getArtistByUsername } from './src/lib/supabase/artists.ts';
import { getReleasesByArtistId } from './src/lib/supabase/releases.ts';
import { checkIsFollowing } from './src/lib/supabase/followers.ts';

async function run() {
  const cleanUsername = 'pramuparty';
  
  console.log('1. getArtistByUsername');
  let artistData;
  try {
    artistData = await getArtistByUsername(cleanUsername);
    console.log('getArtistByUsername: success');
  } catch (err) {
    console.error('getArtistByUsername: error', err);
    return;
  }
  
  if (!artistData) {
    console.log('Artist not found');
    return;
  }
  
  console.log('2. getReleasesByArtistId');
  try {
    const releasesData = await getReleasesByArtistId(artistData.id, true);
    console.log('getReleasesByArtistId: success');
  } catch (err) {
    console.error('getReleasesByArtistId: error');
    console.error(err);
  }
}
run();
