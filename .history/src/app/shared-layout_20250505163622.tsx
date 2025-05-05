"use client"; // Mark as Client Component for theme state

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// This component defines the shared structure (header, footer, theme)
export default function SharedLayout({ children }: { children: React.ReactNode }) {
  // State for theme management - default to dark to match b0ase.com
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
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-b0ase-dark border-b border-b0ase-card-border">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <Link href="/newsite" className="text-2xl font-bold font-[var(--font-roboto-mono)] text-white hover:text-b0ase-blue transition-colors">
              robust-ae.com
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="#services" className="text-gray-300 hover:text-white">Services</Link>
            <Link href="#skills" className="text-gray-300 hover:text-white">Skills</Link>
            <Link href="#projects" className="text-gray-300 hover:text-white">Projects</Link>
            <Link href="#contact" className="text-gray-300 hover:text-white">Contact</Link>
            
            {/* Icon links */}
            <div className="flex items-center space-x-4">
              {/* Download CV icon */}
              <a href="/images/logos/George_Haworth_CV_23042025.pdf" download className="p-2 rounded hover:text-white" title="Download CV">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v8m0 0l-3-3m3 3l3-3M21 12v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8m16 0h-4l-1-1H9l-1 1H5" />
                </svg>
              </a>
              {/* Phone icon */}
              <a href="tel:07447544890" className="p-2 rounded hover:text-white" title="Call: 07447 544 890">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.89 1.316l.834 2.503a2 2 0 01-.45 2.005l-1.562 1.562a16.06 16.06 0 006.586 6.586l1.562-1.562a2 2 0 012.005-.45l2.503.834A2 2 0 0119 17.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.28z" />
                </svg>
              </a>
              {/* Email icon */}
              <a href="mailto:info@robust-ae.com" className="p-2 rounded hover:text-white" title="Email: info@robust-ae.com">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v8z" />
                </svg>
              </a>
            </div>
            
            <Link href="/" className="bg-b0ase-blue text-white text-sm px-4 py-2 rounded hover:bg-opacity-80 transition">Home</Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Render the actual page content here */}
      <main>{children}</main>

      {/* Footer Section */}
      <footer className="bg-black text-gray-500 py-8 mt-16 border-t border-b0ase-card-border">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Robust AE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 