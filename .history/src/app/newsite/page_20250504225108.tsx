"use client"; // Mark as Client Component

import React, { useState, useEffect } from 'react'; // Import hooks
import Image from 'next/image';
import Link from 'next/link';

export default function NewSitePage() {
  // State for theme management
  const [theme, setTheme] = useState('dark');

  // Effect to apply theme class and set initial state
  useEffect(() => {
    // Set initial theme based on state (defaults to dark)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]); // Rerun only when theme changes

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div>
            <Link href="/">
              <Image 
                src="/images/logos/AE vector-2.png" 
                alt="Robust AE Logo" 
                width={150} 
                height={50} 
                className="dark:invert" // Invert logo in dark mode if needed
               />
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            {/* Placeholder Nav Links */}
            <Link href="#services" className="hover:text-blue-600 dark:hover:text-blue-400">Services</Link>
            <Link href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Home</Link>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> // Moon icon
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> // Sun icon
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 text-center py-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Robust AE: Engineering Your Vision
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            End-to-end embedded systems development and industrial automation solutions.
            We bring your ideas to life with expert engineering, from concept to production.
          </p>
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-700 transition duration-300">
            Discover More
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-white dark:bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Our Services
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Explore our core capabilities in embedded systems and industrial automation, designed to bring your projects from concept to reality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Embedded Systems Development</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                From initial concept and microcontroller selection to firmware development and testing, we deliver robust and efficient embedded solutions tailored to your specific needs.
              </p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</a>
            </div>
            {/* Service Card 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Industrial Automation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Enhance your operational efficiency with custom automation solutions, including PLC programming, control system design, and system integration for industrial environments.
              </p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</a>
            </div>
            {/* Service Card 3 (Extrapolated) */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Prototyping & Production Support</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We bridge the gap from prototype to production, offering support with PCB design, small-batch manufacturing coordination, and design-for-manufacturability (DFM) guidance.
              </p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for other sections */}
      <div className="container mx-auto px-4 py-8">
         <p className="dark:text-gray-400">Other sections (Services, Contact, etc.) will be added here.</p>
      </div>

       {/* Footer Section */}
       <footer className="bg-gray-800 dark:bg-black text-gray-400 dark:text-gray-500 py-8 mt-16">
         <div className="container mx-auto text-center">
           <p>© {new Date().getFullYear()} Robust AE. All rights reserved.</p>
           {/* Add footer links if needed */}
         </div>
       </footer>
    </div>
  );
} 