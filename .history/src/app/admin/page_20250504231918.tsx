"use client"; // Mark as client component for form interaction (even if basic)

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react'; // Import next-auth hooks

export default function AdminPage() {
  const { data: session, status } = useSession(); // Get session status
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Use environment variable for admin email
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com'; // Fallback if not set publicly

    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent redirect on error, handle manually
        email: adminEmail, // Use the admin email
        password: password,
      });

      if (result?.error) {
        console.error("Login Error:", result.error);
        // Provide user-friendly error messages based on common NextAuth errors
        if (result.error === 'CredentialsSignin') {
          setError('Invalid password. Please try again.');
        } else {
           setError('An unexpected error occurred during login.');
        }
        setPassword(''); // Clear password field on error
      } else if (result?.ok) {
        // Login successful - session will update automatically via useSession
        console.log('Login successful');
        // No need to redirect here, content will conditionally render
      } else {
        // Handle other potential non-error outcomes if needed
         setError('Login failed. Please try again.');
         setPassword(''); 
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      setError('An error occurred. Please try again later.');
       setPassword(''); 
    }
  };

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
            <p>Loading session...</p>
        </div>
    );
  }

  // If user is authenticated (session exists)
  if (session && session.user?.role === 'admin') {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.email}!</p>
        <p className="mb-8">This is the protected admin content area. Add site editing tools here.</p>
        <button 
            onClick={() => signOut({ callbackUrl: '/newsite' })} // Sign out and redirect
            className="bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition duration-300"
        >
            Sign Out
        </button>
      </div>
    );
  }

  // If user is not authenticated, show login form
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
       <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Login</h1>
       <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display login errors */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {/* No need for email input if we hardcode the admin email */}
          {/* <div> ... Email input ... </div> */}
          <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                value={password} // Control the input value
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                Login
              </button>
            </div>
        </form>
       </div>
       <Link href="/newsite" className="text-blue-600 dark:text-blue-400 hover:underline mt-8">&larr; Back to Site</Link>
    </div>
  );
} 