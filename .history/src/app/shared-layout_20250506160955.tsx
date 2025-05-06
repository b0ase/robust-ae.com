"use client"; // Mark as Client Component for theme state

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

// This component defines the shared structure (header, footer, theme)
export default function SharedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Initialize router
  // State for theme management - default to dark to match b0ase.com
  const [theme, setTheme] = useState('dark');
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu if open

    const targetPath = '/newsite';
    const currentPath = window.location.pathname;

    const performScroll = (id: string) => {
      const section = document.getElementById(id);
      if (section) {
        const offsetTop = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        console.warn(`scrollToSection: Element with id '${id}' not found.`);
      }
    };

    if (currentPath === targetPath) {
      // Already on the newsite page, scroll directly
      performScroll(sectionId);
    } else {
      // Not on the newsite page, navigate first, then scroll
      router.push(`${targetPath}#${sectionId}`);
      // Need a slight delay for the navigation to complete and the element to potentially be in the DOM
      // Note: This might not be perfectly reliable, especially on slow connections/renders.
      // A more robust solution might involve state management or checking after navigation.
      setTimeout(() => performScroll(sectionId), 300); 
    }
  };

  return (
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-black border-b border-b0ase-card-border">
        <nav className="container mx-auto px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
          <div>
            <Link href="/newsite" className="text-xl md:text-2xl font-bold font-[var(--font-roboto-mono)] text-white hover:text-b0ase-blue transition-colors">
              robust-ae.com
            </Link>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#services" onClick={(e) => scrollToSection('services', e)} className="text-gray-300 hover:text-white cursor-pointer">Services</a>
            <a href="#skills" onClick={(e) => scrollToSection('skills', e)} className="text-gray-300 hover:text-white cursor-pointer">Skills</a>
            <Link href="/projects" className="text-gray-300 hover:text-white cursor-pointer">Projects</Link>
            <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="text-gray-300 hover:text-white cursor-pointer">Contact</a>
            
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
            
            <Link href="/" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition">Home</Link>
            
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
          
          {/* Mobile Menu Button - visible only on mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/" className="border border-gray-700 text-white text-sm px-3 py-1 hover:bg-gray-800 transition">Home</Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu - slides from top when opened */}
        <div 
          className={`absolute left-0 right-0 bg-black border-b border-b0ase-card-border transition-all duration-300 overflow-hidden md:hidden ${
            mobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-3">
              <a 
                href="#services" 
                onClick={(e) => scrollToSection('services', e)}
                className="block py-2 text-white hover:text-b0ase-blue cursor-pointer"
              >
                Services
              </a>
              <a 
                href="#skills" 
                onClick={(e) => scrollToSection('skills', e)}
                className="block py-2 text-white hover:text-b0ase-blue cursor-pointer"
              >
                Skills
              </a>
              <Link 
                href="/projects" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-b0ase-blue cursor-pointer"
              >
                Projects
              </Link>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection('contact', e)}
                className="block py-2 text-white hover:text-b0ase-blue cursor-pointer"
              >
                Contact
              </a>
            </div>
            
            <div className="pt-2 border-t border-b0ase-card-border flex items-center justify-between">
              <div className="flex space-x-5">
                {/* CV download */}
                <a 
                  href="/images/logos/George_Haworth_CV_23042025.pdf" 
                  download
                  className="flex items-center text-white hover:text-b0ase-blue"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v8m0 0l-3-3m3 3l3-3M21 12v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8m16 0h-4l-1-1H9l-1 1H5" />
                  </svg>
                  <span className="text-sm">CV</span>
                </a>
                
                {/* Phone */}
                <a 
                  href="tel:07447544890" 
                  className="flex items-center text-white hover:text-b0ase-blue"
                  title="Call: 07447 544 890"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.89 1.316l.834 2.503a2 2 0 01-.45 2.005l-1.562 1.562a16.06 16.06 0 006.586 6.586l1.562-1.562a2 2 0 012.005-.45l2.503.834A2 2 0 0119 17.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.28z" />
                  </svg>
                  <span className="text-sm">Call</span>
                </a>
                
                {/* Email */}
                <a 
                  href="mailto:info@robust-ae.com" 
                  className="flex items-center text-white hover:text-b0ase-blue"
                  title="Email: info@robust-ae.com"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v8z" />
                  </svg>
                  <span className="text-sm">Email</span>
                </a>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Render the actual page content here */}
      <main>{children}</main>

      {/* Footer Section */}
      <footer className="bg-black text-gray-500 py-8 mt-16 border-t border-b0ase-card-border">
        <div className="container mx-auto text-center px-4">
          <p>© {new Date().getFullYear()} Robust AE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 