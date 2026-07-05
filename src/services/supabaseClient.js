import { createClient } from '@supabase/supabase-js';
console.log("--- DEBUG VITE ---");
console.log("Fichier chargé ? URL attendue :", import.meta.env.VITE_SUPABASE_URL);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;



export const supabase = createClient(supabaseUrl, supabasePublishableKey);