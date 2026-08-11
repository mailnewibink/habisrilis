import { getArtistByUsername } from './src/lib/supabase/artists';
import { getReleasesByArtistId } from './src/lib/supabase/releases';

async function run() {
  const cleanUsername = 'pramuparty';
  
  console.log('1. getArtistByUsername()');
  let artistData;
  try {
    artistData = await getArtistByUsername(cleanUsername);
    console.log('success');
  } catch (err) {
    console.log('error');
    console.error(err);
    return;
  }
  
  if (!artistData) {
    console.log('Artist not found');
    return;
  }
  
  console.log('2. getReleasesByArtistId()');
  try {
    const releasesData = await getReleasesByArtistId(artistData.id, true);
    console.log('success');
  } catch (err) {
    console.log('error');
    console.error(err);
  }
}
run();
