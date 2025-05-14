import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
