// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uinrusnxhixuyvzprpfj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbnJ1c254aGl4dXl2enBycGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjI3NjMsImV4cCI6MjA2MzAzODc2M30.T-JDLN11gCkpkuUs3LtHs0R_cnU-eR9QMtsh53cQUZk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);