import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Update session and get user
  const { user, response } = await updateSession(request);

  // Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect to login if not logged in
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // In a real production app, we would check user.email or a custom is_admin flag
    const adminEmails = ['admin@varietyvista.in', 'contact@varietyvista.co.in'];
    if (!adminEmails.includes(user.email || '')) {
       return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files like images)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
