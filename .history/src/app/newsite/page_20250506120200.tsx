"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Define the type for the content structure (matching the one in admin page)
interface ContentData {
  hero: { title: string; subtitle: string };
  services: {
    introTitle: string;
    introText: string;
    cards: { title: string; description: string }[];
  };
  mission: {
    mainTitle: string;
    subTitle: string;
    introParagraph: string;
    points: { title: string; text: string }[];
  };
  skills: {
    hardware: { name: string }[];
    software: { name: string }[];
    tools: { name: string }[];
    certifications: { title: string; organization: string; id: string }[];
  };
  projects: {
    items: {
      title: string;
      description: string;
      technologies: string[];
      imageSrc: string;
    }[];
  };
  testimonials: {
    items: {
      quote: string;
      name: string;
      position: string;
      company: string;
      initials: string;
    }[];
    clients: string[];
  };
  contact: { title: string; text: string };
}

export default function NewSitePage() {
  // Authentication states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Content states
  const [content, setContent] = useState<ContentData | null>(null);
  const [editableContent, setEditableContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  
  // Hero carousel state
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = Array.from({length: 10}, (_, i) => `/hero/${(i + 1).toString().padStart(2, '0')}.jpg`);
  
  // Smooth scroll function
  const scrollToSection = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  // Effect to rotate through hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Load content on initial page load
  useEffect(() => {
    // Check for authentication in sessionStorage
    const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    fetchContent();
  }, []);
  
  // Fetch content from API
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Read from Supabase
      const { data, error } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();
      if (error) throw error;
      setContent(data.data);
      setEditableContent(data.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save content changes
  const handleSaveContent = async () => {
    if (!editableContent) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // Write back to Supabase
      const { error } = await supabase
        .from('robust_ae_content')
        .upsert({ id: 1, data: editableContent, updated_at: new Date() });
      if (error) throw error;
      setContent(editableContent);
      setSaveStatus('success');
      
      // Record the last edit time in localStorage
      localStorage.setItem('lastContentEdit', new Date().toISOString());
      
      // Hide success message after a delay
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Error saving content:", err);
      setSaveStatus('error');
      // Hide error message after a delay
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Authentication handler
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side password check
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error("NEXT_PUBLIC_ADMIN_PASSWORD is not set in environment variables!");
      setError("Configuration error. Please contact support.");
      return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
      // Persist authentication so /admin page recognizes it
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthModalOpen(false);
    } else {
      setError('Invalid password.');
      setPassword('');
    }
  };
  
  // Helper to handle changes in nested content state
  const handleContentChange = (
    section: keyof ContentData,
    fieldOrItemKey: string,
    value: string,
    index?: number,
    subField?: string
  ) => {
    setEditableContent(prevContent => {
      if (!prevContent) return null;
      const newContent = JSON.parse(JSON.stringify(prevContent)) as ContentData;

      try {
        if (section === 'services' && fieldOrItemKey === 'cards' && index !== undefined && subField && subField in newContent.services.cards[index]) {
          type CardKey = keyof typeof newContent.services.cards[number];
          newContent.services.cards[index][subField as CardKey] = value;
        } else if (section === 'mission' && fieldOrItemKey === 'points' && index !== undefined && subField && subField in newContent.mission.points[index]) {
          type PointKey = keyof typeof newContent.mission.points[number];
          newContent.mission.points[index][subField as PointKey] = value;
        } else if (section in newContent && fieldOrItemKey in newContent[section]){
            type SectionType = typeof newContent[typeof section];
            type SectionKey = keyof SectionType;
            const key = fieldOrItemKey as SectionKey;

             // Check if the key exists and is a direct property (not an object or array)
             if (typeof newContent[section][key] === 'string') {
                 // Directly assign if the target is a string and value is a string
                 (newContent[section] as Record<string, unknown>)[key as string] = value;
             } else {
                 console.warn(`Type mismatch or non-primitive type prevented update: section=${section}, field=${key}`);
             }
        } else {
            console.warn("handleContentChange: Unhandled or invalid update case", { section, fieldOrItemKey, index, subField });
        }
      } catch (error) {
          console.error("Error updating content state:", error, { section, fieldOrItemKey, value, index, subField });
      }

      return newContent;
    });
    setSaveStatus(null);
  };
  
  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError(null);
    // Remove authentication from sessionStorage
    sessionStorage.removeItem('isAdminAuthenticated');
    // Reset editable content to the current displayed content
    setEditableContent(content);
  };
  
  // If still loading content, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If content failed to load, show an error
  if (!content || !editableContent) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Content</h1>
        <p>The website content could not be loaded. Please try again later.</p>
      </div>
    );
  }

  // The actual content is either the display content or editable content based on auth state
  const displayContent = isAuthenticated ? editableContent : content;
  
  return (
    <>
      {/* Admin Toolbar - Only visible when authenticated */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 py-3 px-4 shadow-md">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <span className="font-medium">Admin Mode</span>
                <div className="hidden sm:block text-sm text-gray-300">Make changes directly on the page</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {saveStatus === 'success' && (
                  <span className="text-green-400 text-xs sm:text-sm">Content saved successfully!</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-400 text-xs sm:text-sm">Failed to save. Try again.</span>
                )}
                <Link
                  href="/admin"
                  className="border border-yellow-600 text-yellow-400 px-3 py-1 text-xs sm:text-sm hover:bg-yellow-900 hover:bg-opacity-30 transition"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleSaveContent}
                  disabled={isSaving}
                  className="border border-green-600 text-green-400 px-3 py-1 text-xs sm:text-sm hover:bg-green-900 hover:bg-opacity-30 transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleLogout}
                  className="border border-red-600 text-red-400 px-3 py-1 text-xs sm:text-sm hover:bg-red-900 hover:bg-opacity-30 transition"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-b0ase-card p-6 md:p-8 rounded-lg border border-b0ase-card-border max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Admin Login</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              {error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black border border-b0ase-card-border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:border-b0ase-blue pr-10"
                    required
                    placeholder="Enter admin password"
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
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-gray-500 text-white font-medium px-4 py-2 hover:bg-gray-800 transition mb-3 sm:mb-0"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main content with conditional editing */}
      <div className={isAuthenticated ? "pt-14" : ""}>
        {/* Padlock Icon - Only visible when not authenticated */}
        {!isAuthenticated && (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-50"
            aria-label="Admin Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </button>
        )}

        {/* Hero Section - Editable when authenticated */}
        <section className="bg-b0ase-dark text-center py-12 px-4 md:py-20 md:px-6 border-b border-b0ase-card-border">
          <div className="container mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-64 md:h-96 mx-auto mb-8 overflow-hidden rounded">
              {heroImages.map((image, idx) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentHeroImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Robust AE Hero Image ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
              
              {/* Logo overlay on carousel */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Image
                  src="/images/logos/AE vector-2.png"
                  alt="Robust AE Logo"
                  width={240}
                  height={80}
                  className="z-10"
                  priority
                />
              </div>
              
              {/* Navigation dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroImage(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentHeroImage ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={displayContent.hero.title}
                    onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Title
                  </span>
                </div>
                <div className="relative group">
                  <textarea
                    value={displayContent.hero.subtitle}
                    onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                    rows={3}
                    className="text-base md:text-lg lg:text-xl w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-400 focus:outline-none transition resize-none"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Subtitle
                  </span>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                  {displayContent.hero.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-gray-400 whitespace-pre-line">
                  {displayContent.hero.subtitle}
                </p>
              </>
            )}
            <a href="#services" onClick={(e) => scrollToSection('services', e)}>
              <button className="border border-gray-700 text-white font-medium px-6 py-2 md:px-8 md:py-3 hover:bg-gray-800 transition duration-300">
                Discover More
              </button>
            </a>
          </div>
        </section>

        {/* Services Section - Editable when authenticated */}
        <section id="services" className="py-12 px-4 md:py-16 md:px-6 bg-black">
          <div className="container mx-auto">
            <div className="flex items-center mb-8 md:mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Services</h2>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-4 max-w-2xl mx-auto mb-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={displayContent.services.introTitle}
                    onChange={(e) => handleContentChange('services', 'introTitle', e.target.value)}
                    className="text-3xl md:text-4xl font-bold w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Title
                  </span>
                </div>
                <div className="relative group">
                  <textarea
                    value={displayContent.services.introText}
                    onChange={(e) => handleContentChange('services', 'introText', e.target.value)}
                    rows={2}
                    className="text-lg w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-400 focus:outline-none transition resize-none"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Intro Text
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-center text-base md:text-lg text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto">
                  {displayContent.services.introText}
                </p>
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayContent.services.cards.map((card, index) => (
                <div key={index} className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border hover:border-b0ase-gray-600 transition-all duration-300 service-card">
                  {isAuthenticated ? (
                    <>
                      <div className="relative group mb-3">
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, 'title')}
                          className="text-xl font-semibold w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-b0ase-blue focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Title
                        </span>
                      </div>
                      <div className="relative group mb-4">
                        <textarea
                          value={card.description}
                          onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, 'description')}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition resize-none"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Description
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg md:text-xl font-semibold mb-3 text-b0ase-blue">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm md:text-base">
                        {card.description}
                      </p>
                    </>
                  )}
                  <Link 
                    href={index === 0 ? "/services/embedded-systems" : index === 1 ? "/services/industrial-automation" : "/services/prototyping-production"}
                    className="text-b0ase-blue hover:text-white transition-colors font-medium inline-flex items-center text-sm md:text-base"
                  >
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach/Mission Section - Editable when authenticated */}
        <section id="mission" className="py-16 px-6 bg-b0ase-dark border-t border-b border-b0ase-card-border">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Our Approach</h2>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-4 text-center mb-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={displayContent.mission.mainTitle}
                    onChange={(e) => handleContentChange('mission', 'mainTitle', e.target.value)}
                    className="text-3xl md:text-4xl font-bold w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Main Title
                  </span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={displayContent.mission.subTitle}
                    onChange={(e) => handleContentChange('mission', 'subTitle', e.target.value)}
                    className="text-xl w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-b0ase-blue font-semibold focus:outline-none transition"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Subtitle
                  </span>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">{displayContent.mission.mainTitle}</h3>
                <h3 className="text-xl text-center text-b0ase-blue font-semibold mb-10">
                  {displayContent.mission.subTitle}
                </h3>
              </>
            )}

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              {isAuthenticated ? (
                <div className="relative group">
                  <textarea
                    value={displayContent.mission.introParagraph}
                    onChange={(e) => handleContentChange('mission', 'introParagraph', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none transition resize-none"
                  />
                  <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Intro Paragraph
                  </span>
                </div>
              ) : (
                <p className="whitespace-pre-line">
                  {displayContent.mission.introParagraph}
                </p>
              )}
              
              {displayContent.mission.points.map((point, index) => (
                <div key={index}>
                  {isAuthenticated ? (
                    <>
                      <div className="relative group mb-2">
                        <input
                          type="text"
                          value={point.title}
                          onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, 'title')}
                          className="text-2xl font-semibold w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-800 dark:text-white focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Point Title
                        </span>
                      </div>
                      <div className="relative group">
                        <textarea
                          value={point.text}
                          onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, 'text')}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none transition resize-none"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Point Text
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{point.title}</h4>
                      <p className="whitespace-pre-line">
                        {point.text}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 px-6 bg-black">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Skills & Technologies</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Hardware Skills */}
              <div className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border">
                <h3 className="text-xl font-semibold mb-4 text-b0ase-blue">Hardware</h3>
                {isAuthenticated ? (
                  <div className="space-y-3 mb-4">
                    {displayContent.skills?.hardware?.map((item, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleContentChange('skills', 'hardware', e.target.value, index, 'name')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Skill
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setEditableContent(prev => {
                          if (!prev) return null;
                          const newContent = JSON.parse(JSON.stringify(prev));
                          newContent.skills.hardware.push({ name: 'New Hardware Skill' });
                          return newContent;
                        });
                      }}
                      className="text-sm text-b0ase-blue hover:text-white mt-2"
                    >
                      + Add Skill
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2 text-gray-300">
                    {displayContent.skills?.hardware?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Software Skills */}
              <div className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border">
                <h3 className="text-xl font-semibold mb-4 text-b0ase-blue">Software</h3>
                {isAuthenticated ? (
                  <div className="space-y-3 mb-4">
                    {displayContent.skills?.software?.map((item, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleContentChange('skills', 'software', e.target.value, index, 'name')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Skill
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setEditableContent(prev => {
                          if (!prev) return null;
                          const newContent = JSON.parse(JSON.stringify(prev));
                          newContent.skills.software.push({ name: 'New Software Skill' });
                          return newContent;
                        });
                      }}
                      className="text-sm text-b0ase-blue hover:text-white mt-2"
                    >
                      + Add Skill
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2 text-gray-300">
                    {displayContent.skills?.software?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Tools Skills */}
              <div className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border">
                <h3 className="text-xl font-semibold mb-4 text-b0ase-blue">Tools & Protocols</h3>
                {isAuthenticated ? (
                  <div className="space-y-3 mb-4">
                    {displayContent.skills?.tools?.map((item, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleContentChange('skills', 'tools', e.target.value, index, 'name')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Skill
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setEditableContent(prev => {
                          if (!prev) return null;
                          const newContent = JSON.parse(JSON.stringify(prev));
                          newContent.skills.tools.push({ name: 'New Tool/Protocol' });
                          return newContent;
                        });
                      }}
                      className="text-sm text-b0ase-blue hover:text-white mt-2"
                    >
                      + Add Tool/Protocol
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2 text-gray-300">
                    {displayContent.skills?.tools?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Certifications */}
            <div className="mt-12 bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border">
              <h3 className="text-xl font-semibold mb-4 text-b0ase-blue">Certifications & Education</h3>
              {isAuthenticated ? (
                <div className="space-y-6 mb-4">
                  {displayContent.skills?.certifications?.map((cert, index) => (
                    <div key={index} className="space-y-2 border-b border-gray-800 pb-4 last:border-0">
                      <div className="relative group">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => handleContentChange('skills', 'certifications', e.target.value, index, 'title')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white font-medium focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Title
                        </span>
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          value={cert.organization}
                          onChange={(e) => handleContentChange('skills', 'certifications', e.target.value, index, 'organization')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-400 text-sm focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Organization
                        </span>
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          value={cert.id}
                          onChange={(e) => handleContentChange('skills', 'certifications', e.target.value, index, 'id')}
                          className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-400 text-sm focus:outline-none transition"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit ID/Details
                        </span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEditableContent(prev => {
                        if (!prev) return null;
                        const newContent = JSON.parse(JSON.stringify(prev));
                        newContent.skills.certifications.push({ 
                          title: 'New Certification', 
                          organization: 'Organization Name',
                          id: 'ID/Year'
                        });
                        return newContent;
                      });
                    }}
                    className="text-sm text-b0ase-blue hover:text-white mt-2"
                  >
                    + Add Certification
                  </button>
                </div>
              ) : (
                <ul className="space-y-4 text-gray-300">
                  {displayContent.skills?.certifications?.map((cert, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                      <div>
                        <h4 className="font-medium">{cert.title}</h4>
                        <p className="text-sm text-gray-400">{cert.organization}, {cert.id}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 px-6 bg-b0ase-dark border-t border-b border-b0ase-card-border">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
            </div>
            
            <div className="space-y-12">
              {displayContent.projects?.items?.map((project, index) => (
                <div key={index} className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <div className="relative h-48 w-full rounded overflow-hidden bg-gray-800">
                        <Image
                          src={project.imageSrc || `/images/projects/placeholder.jpg`}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        {isAuthenticated && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="text-center">
                              <p className="text-white text-sm mb-2">Image: {project.imageSrc}</p>
                              <span className="text-xs text-gray-300">
                                Edit in source to change image path
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-2/3">
                      {isAuthenticated ? (
                        <>
                          <div className="relative group mb-3">
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => handleContentChange('projects', 'items', e.target.value, index, 'title')}
                              className="text-xl md:text-2xl font-semibold w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
                            />
                            <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Edit Title
                            </span>
                          </div>
                          <div className="relative group mb-4">
                            <textarea
                              value={project.description}
                              onChange={(e) => handleContentChange('projects', 'items', e.target.value, index, 'description')}
                              rows={3}
                              className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition resize-none"
                            />
                            <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Edit Description
                            </span>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-xs mb-2">Technologies (comma-separated)</label>
                            <div className="relative group">
                              <input
                                type="text"
                                value={project.technologies.join(', ')}
                                onChange={(e) => {
                                  const techArray = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
                                  setEditableContent(prev => {
                                    if (!prev) return null;
                                    const newContent = JSON.parse(JSON.stringify(prev));
                                    newContent.projects.items[index].technologies = techArray;
                                    return newContent;
                                  });
                                }}
                                className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">{project.title}</h3>
                          <p className="text-gray-300 mb-4">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                      <button className="text-b0ase-blue hover:text-white transition-colors font-medium inline-flex items-center text-sm md:text-base">
                        View Project Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {isAuthenticated && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setEditableContent(prev => {
                        if (!prev) return null;
                        const newContent = JSON.parse(JSON.stringify(prev));
                        newContent.projects.items.push({
                          title: 'New Project',
                          description: 'Description of the new project goes here.',
                          technologies: ['Tech1', 'Tech2', 'Tech3'],
                          imageSrc: '/images/projects/placeholder.jpg'
                        });
                        return newContent;
                      });
                    }}
                    className="bg-b0ase-card border border-b0ase-card-border px-4 py-2 text-b0ase-blue hover:text-white transition-colors"
                  >
                    + Add New Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 px-6 bg-white dark:bg-black">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Client Testimonials
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              What our clients say about our services and solutions
            </p>
            
            {/* Testimonials Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayContent.testimonials?.items?.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 dark:bg-b0ase-card p-6 rounded-lg border border-gray-200 dark:border-b0ase-card-border relative ${
                    index === displayContent.testimonials.items.length - 1 && index % 2 === 0 ? 'md:col-span-2 max-w-xl mx-auto' : ''
                  }`}
                >
                  <div className="absolute -top-4 left-6">
                    <div className="bg-b0ase-blue text-white p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                  
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) => handleContentChange('testimonials', 'items', e.target.value, index, 'quote')}
                          rows={4}
                          className="italic w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none transition resize-none"
                        />
                        <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit Quote
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                          <input
                            type="text"
                            value={testimonial.initials}
                            onChange={(e) => handleContentChange('testimonials', 'items', e.target.value, index, 'initials')}
                            className="w-full h-full rounded-full bg-transparent text-center focus:outline-none"
                            maxLength={2}
                          />
                        </div>
                        <div className="text-left space-y-2">
                          <div className="relative group">
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => handleContentChange('testimonials', 'items', e.target.value, index, 'name')}
                              className="font-medium text-gray-900 dark:text-white w-full px-2 py-1 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent focus:outline-none transition"
                            />
                            <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Edit Name
                            </span>
                          </div>
                          <div className="relative group">
                            <input
                              type="text"
                              value={`${testimonial.position}, ${testimonial.company}`}
                              onChange={(e) => {
                                const parts = e.target.value.split(',').map(part => part.trim());
                                const position = parts[0] || '';
                                const company = parts.slice(1).join(',').trim() || '';
                                
                                setEditableContent(prev => {
                                  if (!prev) return null;
                                  const newContent = JSON.parse(JSON.stringify(prev));
                                  newContent.testimonials.items[index].position = position;
                                  newContent.testimonials.items[index].company = company;
                                  return newContent;
                                });
                              }}
                              className="text-sm text-gray-500 dark:text-gray-400 w-full px-2 py-1 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent focus:outline-none transition"
                            />
                            <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Edit Position & Company
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="italic text-gray-700 dark:text-gray-300 mb-6">
                        "{testimonial.quote}"
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                          {testimonial.initials}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.position}, {testimonial.company}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {/* Client Logos Section */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trusted By</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-10">
                Companies we've collaborated with on successful projects
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
                {isAuthenticated ? (
                  <div className="md:col-span-4 w-full max-w-lg mx-auto">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                      Client Companies (comma-separated)
                    </label>
                    <textarea
                      value={displayContent.testimonials?.clients?.join(', ')}
                      onChange={(e) => {
                        const clientsArray = e.target.value.split(',').map(client => client.trim()).filter(Boolean);
                        setEditableContent(prev => {
                          if (!prev) return null;
                          const newContent = JSON.parse(JSON.stringify(prev));
                          newContent.testimonials.clients = clientsArray;
                          return newContent;
                        });
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 focus:border-b0ase-blue dark:focus:border-b0ase-blue bg-transparent focus:outline-none transition resize-none rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">These will be displayed as logo placeholders.</p>
                  </div>
                ) : (
                  <>
                    {displayContent.testimonials?.clients?.map((client, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg w-32 h-20 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <div className="text-gray-400 font-medium text-sm text-center">{client}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Editable when authenticated */}
        <section id="contact" className="py-12 px-4 md:py-16 md:px-6 bg-black">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-8 md:mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Contact</h2>
            </div>
            
            <div className="bg-b0ase-card p-5 md:p-8 rounded-lg border border-b0ase-card-border">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      value={displayContent.contact.title}
                      onChange={(e) => handleContentChange('contact', 'title', e.target.value)}
                      className="text-2xl font-bold w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
                    />
                    <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Edit Title
                    </span>
                  </div>
                  <div className="relative group">
                    <textarea
                      value={displayContent.contact.text}
                      onChange={(e) => handleContentChange('contact', 'text', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-300 focus:outline-none transition resize-none"
                    />
                    <span className="absolute -top-4 left-0 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Edit Contact Text
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{displayContent.contact.title}</h3>
                  <p className="text-gray-300 mb-6">
                    {displayContent.contact.text}
                  </p>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold mb-4 text-b0ase-blue">Contact Details</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.89 1.316l.834 2.503a2 2 0 01-.45 2.005l-1.562 1.562a16.06 16.06 0 006.586 6.586l1.562-1.562a2 2 0 012.005-.45l2.503.834A2 2 0 0119 17.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.28z" />
                      </svg>
                      <div>
                        <p className="text-gray-300">Phone</p>
                        <a href="tel:07447544890" className="text-white hover:text-b0ase-blue transition-colors">07447 544 890</a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-300">Email</p>
                        <a href="mailto:info@robust-ae.com" className="text-white hover:text-b0ase-blue transition-colors">info@robust-ae.com</a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <h4 className="text-lg md:text-xl font-semibold mb-4 text-b0ase-blue">Send a Message</h4>
                  <form className="space-y-4" id="feedback-form">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-2 bg-b0ase-dark border border-b0ase-card-border rounded focus:border-b0ase-blue focus:outline-none text-white"
                        name="name"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-2 bg-b0ase-dark border border-b0ase-card-border rounded focus:border-b0ase-blue focus:outline-none text-white"
                        name="email"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Your Message"
                        rows={4}
                        className="w-full px-4 py-2 bg-b0ase-dark border border-b0ase-card-border rounded focus:border-b0ase-blue focus:outline-none text-white resize-none"
                        name="message"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="border border-gray-700 text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Info/Logos Section (remains static) */}
        <section id="company-info" className="py-16 px-6 bg-white dark:bg-black">
          <div className="container mx-auto max-w-4xl text-center border-t dark:border-gray-700 pt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Company &amp; Accreditations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Company Number: 11269142
            </p>
            <div className="flex justify-center items-center gap-12 flex-wrap">
              {/* NAPIT Logo & Info */}
              <div className="text-center">
                <Image
                  src="/images/logos/napit-logo.png"
                  alt="NAPIT Logo"
                  width={120}
                  height={60}
                  className="mx-auto object-contain mb-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Membership: 60482</p>
              </div>
              {/* IET Logo & Info */}
              <div className="text-center">
                <Image
                  src="/images/logos/iet-logo.jpg"
                  alt="IET Logo"
                  width={120}
                  height={60}
                  className="mx-auto object-contain mb-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Membership: 1100789092</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 