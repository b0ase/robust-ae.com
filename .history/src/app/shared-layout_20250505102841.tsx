"use client"; // Mark as Client Component for theme state

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// This component defines the shared structure (header, footer, theme)
export default function SharedLayout({ children }: { children: React.ReactNode }) {
  // State for theme management
  const [theme, setTheme] = useState('dark');

  // Effect to apply theme class and set initial state
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Optional: Save theme preference to localStorage if needed
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 shadow-md">
        {/* Reduce vertical padding py-2 */}
        <nav className="container mx-auto px-6 py-2 flex justify-between items-center">
          <div>
            <Link href="/newsite" className="text-xl font-semibold font-[var(--font-roboto-mono)] dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {/* Remove Image, Add Text */}
              Robust AE
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            {/* Make nav links slightly smaller? text-sm */}
            <Link href="/newsite#services" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Services</Link>
            <Link href="/newsite#contact" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
            {/* Make Home button slightly smaller? text-sm px-3 py-1 */}
            <Link href="/" className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">Home</Link>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
             {/* Admin Link */}
             <Link href="/admin" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Admin Login">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
             </Link>
          </div>
        </nav>
      </header>

      {/* Render the actual page content here */}
      <main>{children}</main>

       {/* Footer Section - Insert Actual Code */}
       <footer className="bg-gray-800 dark:bg-black text-gray-400 dark:text-gray-500 py-8 mt-16">
         <div className="container mx-auto text-center">
           <p>© {new Date().getFullYear()} Robust AE. All rights reserved.</p>
           {/* Add footer links if needed */}
         </div>
       </footer>
    </div>
  );
} 