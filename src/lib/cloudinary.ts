import { supabase } from './supabaseClient';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
}

/**
 * Uploads a single file to Cloudinary.
 * If Cloudinary env vars are missing, gracefully falls back to Supabase Storage.
 */
export async function uploadMediaFile(
  file: File,
  resourceType: 'image' | 'video' = 'image'
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Use Cloudinary if configured
  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'products');

    const targetResourceType = resourceType === 'video' ? 'video' : 'image';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${targetResourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  }

  // Fallback to Supabase Storage if Cloudinary is not configured yet
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadErr } = await supabase.storage
    .from('products-media')
    .upload(filePath, file);

  if (uploadErr) {
    throw new Error(
      `Media upload failed: ${uploadErr.message}. Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.`
    );
  }

  const { data } = supabase.storage.from('products-media').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Helper to batch upload multiple media files to Cloudinary concurrently
 */
export async function uploadMultipleMediaFiles(
  files: File[],
  resourceType: 'image' | 'video' = 'image'
): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map((file) => uploadMediaFile(file, resourceType));
  return Promise.all(uploadPromises);
}
