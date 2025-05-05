import type { NextAuthOptions, User, Session } from 'next-auth';
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Authorize: Missing credentials');
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // --- Debug Logs --- 
        console.log("--- Authorize Function --- ");
        console.log("Received Email:", email);
        console.log("Env Admin Email:", adminEmail);
        console.log("Env Password:", adminPassword); 
        console.log("Received Password (for debug):", password); // REMOVE THIS AFTER DEBUGGING
        // --- End Debug Logs ---

        if (!adminEmail || !adminPassword) {
          console.error('Authorize: Admin credentials ENV VARS not set.');
          return null;
        }

        if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
          console.log("Authorize: Login successful for:", email);
          return { id: "1", name: "Admin User", email: adminEmail, role: "admin" };
        } else {
          console.log('Authorize: Login failed: Incorrect email or password for', email);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt", // Using JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing JWTs/cookies
  pages: {
    signIn: '/admin', // Redirect users to /admin for login
    error: '/admin', // Redirect errors (like wrong password) back to /admin
  },
  // Add callbacks if you need to modify JWT/session data
  callbacks: {
    // Use specific types for jwt callback
    async jwt({ token, user }: { token: JWT, user: User }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    // Use specific types for session callback
    async session({ session, token }: { session: Session, token: JWT }) {
      if (session?.user && token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD; // Changed from ADMIN_PASSWORD_HASH

        if (!adminEmail || !adminPassword) {
          console.error("Admin email or password not set in environment variables.");
          return null; // Or throw an error
        }

        // Basic validation
        if (!credentials?.email || !credentials.password) {
          // Instead of throwing an error, return null for failed auth
          // This allows displaying a generic error message on the client
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Compare email and plain text password
        if (email === adminEmail && password === adminPassword) { // Direct string comparison
          // Successful login - return user object
          user = { id: "1", name: "Admin", email: adminEmail, role: "admin" }; // Added role
          console.log("Admin login successful for:", email);
        } else {
          // Failed login
          console.log("Admin login failed for:", email);
          // Optionally log *why* it failed (wrong email/password) but be careful with logging passwords
          return null; // Return null for failed authentication
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  // Add session callback to include role
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role; // Add role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string; // Add role to session
      }
      return session;
    },
  },
  // Define custom pages if needed, e.g., for sign-in
  // pages: {
  //   signIn: '/auth/signin',
  // }
}); 