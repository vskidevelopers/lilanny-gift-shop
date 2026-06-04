import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // ✅ Only attempt to set cookies if we're in a Server Action/Route Handler
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore error if we're in a Server Component (read-only context)
            // The `server` cookie can only be updated in Server Actions
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignore error if we're in a Server Component
          }
        },
      },
    },
  );
};
