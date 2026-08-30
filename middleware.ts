import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPatient, isDoctor, isAdmin, roleDashboard } from "./app/lib/roles";

const protectedPrefixes = ["/patient", "/doctor", "/admin"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  let role: string | null = null;
  if (user && !error) {
    const { data: profile } = await supabase
      .from("dv_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  const isProtected =
    pathname !== "/patient/case" &&
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    if (!user || error) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/patient") && !isPatient(role)) {
      const dest = role ? roleDashboard(role) : "/login";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    if (pathname.startsWith("/doctor") && !isDoctor(role)) {
      const dest = role ? roleDashboard(role) : "/login";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    if (pathname.startsWith("/admin") && !isAdmin(role)) {
      const dest = role ? roleDashboard(role) : "/login";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // If an authenticated user with a known role hits the login page, send them to their dashboard.
  if (user && !error && role && pathname === "/login") {
    return NextResponse.redirect(new URL(roleDashboard(role), request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/login",
  ],
};
