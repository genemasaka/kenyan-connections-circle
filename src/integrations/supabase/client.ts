
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tznbosglxvmwvfgujciv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bmJvc2dseHZtd3ZmZ3VqY2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDk3MDMsImV4cCI6MjA2MDg4NTcwM30.QwLydw4REaCunmGFsM19s6fQQWSwwC9yGbqFYxJ5YDM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  }
});
