// middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (login page)
     * - /register (register page)
     * - /forgot-password (forgot password page)
     * - /
     */
    "/((?!_next/static|_next/image|favicon.ico|login|register|forgot-password|api|verify-email).*)",
  ],
};
