import * as AuthConfig from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

// Log the imported module and handlers to see if they are defined
console.log("AUTH_ROUTE: Imported AuthConfig module:", AuthConfig);
console.log("AUTH_ROUTE: AuthConfig.handlers:", AuthConfig.handlers);

// Use dummy handlers to prevent destructuring error if handlers is undefined
export async function GET(req: NextRequest) {
  console.error("AUTH_ROUTE_ERROR: GET handler called, AuthConfig.handlers was:", AuthConfig.handlers);
  if (AuthConfig.handlers?.GET) {
      console.log("AUTH_ROUTE: Attempting to call actual GET handler");
      try {
          return await (AuthConfig.handlers.GET as any)(req); // Attempt to call original handler
      } catch (e) {
           console.error("AUTH_ROUTE_ERROR: Error calling AuthConfig.handlers.GET:", e);
           return NextResponse.json({ error: "Error in Auth GET handler" }, { status: 500 });
      }
  } else {
    return NextResponse.json({ error: "Auth GET handler undefined" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.error("AUTH_ROUTE_ERROR: POST handler called, AuthConfig.handlers was:", AuthConfig.handlers);
   if (AuthConfig.handlers?.POST) {
        console.log("AUTH_ROUTE: Attempting to call actual POST handler");
       try {
           return await (AuthConfig.handlers.POST as any)(req); // Attempt to call original handler
       } catch (e) {
           console.error("AUTH_ROUTE_ERROR: Error calling AuthConfig.handlers.POST:", e);
           return NextResponse.json({ error: "Error in Auth POST handler" }, { status: 500 });
       }
   } else {
        return NextResponse.json({ error: "Auth POST handler undefined" }, { status: 500 });
   }
}

// Removed the old NextAuth(authOptions) export 