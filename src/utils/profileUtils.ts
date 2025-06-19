
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Since we don't have a profiles table, we'll use user metadata instead
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      first_name: metadata.first_name || '',
      last_name: metadata.last_name || '',
      phone: metadata.phone || '',
      avatar_url: metadata.avatar_url || '',
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
      }
    });

    return !error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
