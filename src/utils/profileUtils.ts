
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  shipping_address?: string | object;
  phone_verified?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

export const createUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};
