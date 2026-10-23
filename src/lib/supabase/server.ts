import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServerClient = cache(async function createSupabaseServerClient() {
const cookieStore = await cookies();

return createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return cookieStore.getAll();
},
setAll(cookiesToSet) {
try {
cookiesToSet.forEach(
({ name, value, options }) => {
cookieStore.set(name, value, options);
}
);
} catch {
// Server Components cannot always write cookies.
}
},
},
}
);
});

export const getAuthenticatedUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});
