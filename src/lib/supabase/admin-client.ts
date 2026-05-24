import { createClient } from "@supabase/supabase-js";

// Bypasses RLS. Only used in protected admin server actions.
export const adminDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
