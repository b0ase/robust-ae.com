import type { NextAuthOptions, User, Session } from 'next-auth';
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

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
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // --- Debug Logs --- 
        console.log("--- Authorize Function --- ");
        console.log("Received Email:", email);
        console.log("Env Admin Email:", adminEmail);
        console.log("Env Password Hash:", adminPasswordHash); 
        console.log("Received Password (for debug):", password); // REMOVE THIS AFTER DEBUGGING
        // --- End Debug Logs ---

        if (!adminEmail || !adminPasswordHash) {
          console.error('Authorize: Admin credentials ENV VARS not set.');
          return null;
        }

        if (email.toLowerCase() === adminEmail.toLowerCase()) {
          console.log("Authorize: Email matches. Comparing passwords...");
          const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
          console.log("Authorize: bcrypt.compare result:", passwordMatches); // Log compare result

          if (passwordMatches) {
            console.log('Authorize: Login successful for:', email);
            return { id: "1", name: "Admin User", email: adminEmail, role: "admin" };
          } else {
            console.log('Authorize: Login failed: Incorrect password for', email);
            return null;
          }
        } else {
          console.log('Authorize: Login failed: Email not found', email);
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