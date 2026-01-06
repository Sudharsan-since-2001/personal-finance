
import { createClient } from '@supabase/supabase-js';

// Using provided project credentials
const supabaseUrl = 'https://gnetfyvowudfjkwwodiw.supabase.co';
const supabaseAnonKey = 'sb_publishable_EAf4fTeqNTHbw8BWsgYYOw_ZuT563O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
