// import { createServerClient } from "@supabase/ssr"
// import { NextResponse } from "next/server"

// export async function middleware(request) {

//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             response.cookies.set(name, value, options)
//           })
//         },
//       },
//     }
//   )

//   await supabase.auth.getUser()

//   return response
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//   ],
// }


import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const url = new URL(request.url);
  const path = url.pathname;

  // Added/Corrected paths from your list
  const protectedPaths = [
    "/dashboard", "/users", "/properties", "/service-users", 
    "/hrList", "/repository", "/pre-migration", "/core-documents", "/portal"
  ];

  const isProtectedRoute = protectedPaths.some(p => path.startsWith(p));

  // If NOT logged in and trying to access protected route
  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path); // This sets the ?redirect=/path
    return NextResponse.redirect(loginUrl);
  }

  // If IS logged in and trying to access login, go to dashboard
  if (user && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)"],
};