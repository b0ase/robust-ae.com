"use client"; // Mark as client component for form interaction (even if basic)

import React from 'react';
import Link from 'next/link';

export default function AdminPage() {

  // Basic handler to prevent default form submission for now
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic here
    alert('Login functionality not yet implemented.');
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
       <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Login</h1>
       <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                // disabled // Optionally disable until implemented
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