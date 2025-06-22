
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  shipping_address?: Json;
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

export const updateUserProfile = async (userId: string, profile: Partial<Omit<UserProfile, 'id' | 'created_at'>>): Promise<boolean> => {
  try {
    const updateData: any = {
      id: userId,
      ...profile,
      updated_at: new Date().toISOString()
    };

    // Handle shipping_address conversion if needed
    if (profile.shipping_address && typeof profile.shipping_address === 'object') {
      updateData.shipping_address = profile.shipping_address as Json;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(updateData);

    return !error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

export const createUserProfile = async (userId: string, profile: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const insertData: any = {
      id: userId,
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Handle shipping_address conversion if needed
    if (profile.shipping_address && typeof profile.shipping_address === 'object') {
      insertData.shipping_address = profile.shipping_address as Json;
    }

    const { error } = await supabase
      .from('profiles')
      .insert(insertData);

    return !error;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};
