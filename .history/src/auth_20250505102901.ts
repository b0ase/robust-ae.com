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
        // IMPORTANT: Add validation for credentials object here!
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        // Cast to string after validation
        const email = credentials.email as string;
        const password = credentials.password as string;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Basic security check: Ensure admin credentials are set in environment
        if (!adminEmail || !adminPasswordHash) {
          console.error('Admin credentials environment variables not set.');
          return null;
        }

        // Check if the email matches the admin email
        if (email.toLowerCase() === adminEmail.toLowerCase()) {
          // Check if the password matches the hashed password
          const passwordMatches = await bcrypt.compare(password, adminPasswordHash);

          if (passwordMatches) {
            // Any object returned will be saved in `user` property of the JWT
            // You can return custom properties like role here
            console.log('Admin login successful for:', email);
            return { id: "1", name: "Admin User", email: adminEmail, role: "admin" } as User;
          } else {
            console.log('Admin login failed: Incorrect password for', email);
            return null; // Password doesn't match
          }
        } else {
          console.log('Admin login failed: Email not found', email);
          return null; // Email doesn't match admin email
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
      // Add role to default session user type if it exists
      if (session?.user && token?.role) {
        (session.user as any).role = token.role; // Cast needed as default User type might not have role
      }
      return session;
    },
  },
}; 