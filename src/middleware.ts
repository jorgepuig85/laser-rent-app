import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the current URL pathname
  const path = request.nextUrl.pathname;
  
  // Clone request headers and set the x-url header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", path);

  // Return response with the new headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Ensure it runs for all routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
