"use client";

import React, { useState } from 'react'; // Removed useEffect, useRouter, next-auth imports
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simple auth state
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Simple client-side password check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // IMPORTANT: This is insecure client-side checking!
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!correctPassword) {
        console.error("NEXT_PUBLIC_ADMIN_PASSWORD is not set in environment variables!");
        setError("Configuration error. Please contact support.");
        return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      setError('Invalid password.');
      setPassword(''); // Clear password field
    }
  };

  // If authenticated, show admin content
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-8">Welcome! This is the protected admin content area.</p>
        {/* Add a simple way to 'log out' (reset state) */}
        <button
            onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
                setError(null);
            }}
            className="bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition duration-300"
        >
            Logout
        </button>
      </div>
    );
  }

  // If not authenticated, show login form
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
       <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Login</h1>
       <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                style={{ top: '-0.375rem' }}
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