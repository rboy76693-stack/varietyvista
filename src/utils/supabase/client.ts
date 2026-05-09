import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Build may be in progress.');
    return {} as any;
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
