import type { DefaultUser, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      role?: string | null; // Add role property
    } & DefaultSession['user']; // Extend default user type
  }

  interface User extends DefaultUser {
    role?: string | null; // Add role property to User type
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: string | null; // Add role property to JWT type
  }
} 