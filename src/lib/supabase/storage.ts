import { supabase } from '../supabase';

export const uploadDirectImage = async (
  bucket: string,
  path: string,
  blob: Blob
): Promise<{ url: string; format: string } | null> => {
  try {
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${path}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(filename, blob, {
      contentType: blob.type,
      upsert: true,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return { url: data.publicUrl, format: ext };
  } catch (err: any) {
    console.error(`Error uploading image to Supabase bucket ${bucket}:`, err);
    throw new Error('Failed to upload image to storage: ' + (err?.message || 'Unknown error'));
  }
};

export const deleteDirectImage = async (bucket: string, url: string) => {
  try {
    // Extract path from URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length === 2) {
      const path = urlParts[1];
      await supabase.storage.from(bucket).remove([path]);
    }
  } catch (err) {
    console.error(`Error deleting image from Supabase bucket ${bucket}:`, err);
  }
};

// Kept for backward compatibility during migration if needed, but not primarily used anymore
export const deleteArtworkFromSupabase = async (userId: string, releaseId: string) => {
  try {
    const webpPath = `${userId}/${releaseId}/artwork.webp`;
    const jpgPath = `${userId}/${releaseId}/artwork.jpg`;

    await supabase.storage.from('artwork').remove([webpPath, jpgPath]);
  } catch (err) {
    console.error('Error deleting artwork from Supabase:', err);
  }
};
