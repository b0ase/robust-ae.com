"use client"; // Mark as client component for form interaction (even if basic)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react'; // Import next-auth hooks
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession(); // Get session status
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

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
              {/* Wrap input and button for relative positioning */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle input type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10" // Add padding-right for icon
                  required
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                  style={{ top: '-0.375rem' }} // Adjust vertical position slightly if needed due to mb-3 on input
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
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