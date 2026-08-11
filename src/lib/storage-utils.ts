import { del } from 'idb-keyval';

export const clearTempArtwork = async () => {
  try {
    await del('temp-artwork');
  } catch (err) {
    console.error('Error clearing temp artwork:', err);
  }
};
