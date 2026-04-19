import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect all routes except the API routes that might need to be accessed via CLI
// You might adjust the publicRoutes based on your CLI auth logic
const isPublicRoute = createRouteMatcher(['/api/sync(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
