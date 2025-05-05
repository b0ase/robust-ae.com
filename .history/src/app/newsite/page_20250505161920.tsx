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
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="font-medium">Admin Mode</span>
              <div className="text-sm text-gray-300">Make changes directly on the page</div>
            </div>
            <div className="flex items-center space-x-4">
              {saveStatus === 'success' && (
                <span className="text-green-400 text-sm">Content saved successfully!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-400 text-sm">Failed to save. Try again.</span>
              )}
              <Link
                href="/admin"
                className="bg-yellow-500 text-gray-900 px-4 py-1 rounded text-sm hover:bg-yellow-600 transition"
              >
                Admin Dashboard
              </Link>
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition"
              >
                Exit Admin Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Login</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
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
            className="fixed bottom-6 right-6 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition z-50"
            aria-label="Admin Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </button>
        )}

        {/* Hero Section - Editable when authenticated */}
        <section className="bg-b0ase-dark text-center py-20 px-6 border-b border-b0ase-card-border">
          <div className="container mx-auto">
            <Image
              src="/images/logos/AE vector-2.png"
              alt="Robust AE Logo - Hero"
              width={300}
              height={100}
              className="mx-auto mb-8"
              priority
            />
            {isAuthenticated ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={displayContent.hero.title}
                    onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                    className="text-4xl md:text-5xl font-bold w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
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
                    className="text-lg md:text-xl w-full text-center px-3 py-2 border-2 border-dashed border-transparent group-hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-gray-400 focus:outline-none transition resize-none"
                  />
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit Subtitle
                  </span>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  {displayContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-400 whitespace-pre-line">
                  {displayContent.hero.subtitle}
                </p>
              </>
            )}
            <Link href="#services">
              <button className="bg-b0ase-blue text-white font-semibold px-8 py-3 rounded hover:bg-opacity-80 transition duration-300">
                Discover More
              </button>
            </Link>
          </div>
        </section>

        {/* Services Section - Editable when authenticated */}
        <section id="services" className="py-16 px-6 bg-black">
          <div className="container mx-auto">
            <div className="flex items-center mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Services</h2>
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
                <p className="text-center text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                  {displayContent.services.introText}
                </p>
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayContent.services.cards.map((card, index) => (
                <div key={index} className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border hover:border-b0ase-gray-600 transition-all duration-300 service-card">
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
                      <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">{card.title}</h3>
                      <p className="text-gray-300 mb-4">
                        {card.description}
                      </p>
                    </>
                  )}
                  <Link 
                    href={index === 0 ? "/services/embedded-systems" : index === 1 ? "/services/industrial-automation" : "/services/prototyping-production"}
                    className="text-b0ase-blue hover:text-white transition-colors font-medium inline-flex items-center"
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

        {/* Testimonials Section (Placeholder - remains static) */}
        <section id="testimonials" className="py-16 px-6 bg-white dark:bg-black">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Client Testimonials
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              (Testimonials will be added here soon)
            </p>
            {/* Placeholder for testimonial content */}
            <div className="italic text-gray-700 dark:text-gray-300">
              &quot;Working with Robust AE was a seamless experience...&quot; - Placeholder Client
            </div>
          </div>
        </section>

        {/* Contact Section - Editable when authenticated */}
        <section id="contact" className="py-16 px-6 bg-black">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-12">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Contact</h2>
            </div>
            
            <div className="bg-b0ase-card p-8 rounded-lg border border-b0ase-card-border">
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
                  <h3 className="text-2xl font-bold mb-4 text-white">{displayContent.contact.title}</h3>
                  <p className="text-gray-300 mb-6">
                    {displayContent.contact.text}
                  </p>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-b0ase-blue">Contact Details</h4>
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
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-b0ase-blue">Send a Message</h4>
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
                      className="bg-b0ase-blue text-white px-6 py-2 rounded font-medium hover:bg-opacity-80 transition-colors"
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