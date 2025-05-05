import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD; // Using plain text password

        // Basic validation and ENV var check
        if (!adminEmail || !adminPassword) {
          console.error("ADMIN_EMAIL or ADMIN_PASSWORD environment variables not set.");
          return null; // Indicate failure due to config error
        }

        if (!credentials?.email || !credentials.password) {
          console.log("Authorize: Missing email or password in credentials.");
          return null; // Indicate failure due to missing input
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // --- Debug Logs --- 
        console.log("--- Authorize Function (Direct Compare) --- ");
        console.log("Received Email:", email);
        console.log("Env Admin Email:", adminEmail);
        console.log("Env Admin Password:", adminPassword ? 'Set' : 'Not Set'); 
        // Avoid logging the actual password
        // --- End Debug Logs ---

        // Direct comparison of email and plain text password
        if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
          // Successful login
          user = { id: "1", name: "Admin", email: adminEmail, role: "admin" }; // Add role
          console.log("Authorize: Admin login successful for:", email);
        } else {
          // Failed login
          console.log("Authorize: Admin login failed (invalid credentials) for:", email);
          return null; // Indicate failure due to invalid credentials
        }

        return user; // Return user object on success, null on failure
      },
    }),
  ],
  // Callbacks to persist role in token/session
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (occurs on sign in), add their role to the token
      if (user && 'role' in user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the role from the token to the session user object
      if (session?.user && token?.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  // Optional: Define custom pages if needed
  // pages: {
  //   signIn: '/login', // Example: custom login page
  //   error: '/auth/error', // Example: custom error page
  // },
  // Optional: Add secret for production
  // secret: process.env.AUTH_SECRET,
  // Optional: Enable debug messages for NextAuth
  // debug: process.env.NODE_ENV === 'development',
}); 