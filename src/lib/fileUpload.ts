
import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadProfilePhoto = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteProfilePhoto = async (photoUrl: string) => {
  try {
    // Extract the path from the URL
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const storagePath = pathParts.slice(pathParts.indexOf('profile-photos') + 1).join('/');
    
    // Delete the file
    const { error } = await supabase.storage
      .from("profile-photos")
      .remove([storagePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
