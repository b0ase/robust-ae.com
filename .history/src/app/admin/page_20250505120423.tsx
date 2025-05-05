"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import Link from 'next/link';

// Define a type for the content structure (optional but good practice)
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

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [content, setContent] = useState<ContentData | null>(null); // State for editable content
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Fetch content when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingContent(true);
      fetch('/api/content')
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch content: ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          setContent(data as ContentData);
          setSaveStatus(null); // Reset save status on successful load
        })
        .catch(err => {
          console.error("Error fetching content:", err);
          setError("Failed to load editable content."); // Show error to user
        })
        .finally(() => setIsLoadingContent(false));
    }
  }, [isAuthenticated]); // Re-run when isAuthenticated changes

  // Handle password submission
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
      // Fetch content immediately after auth
    } else {
      setError('Invalid password.');
      setPassword('');
    }
  };

  // Handle saving content changes
  const handleSaveContent = async () => {
    if (!content) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        throw new Error(`Failed to save content: ${response.statusText}`);
      }
      setSaveStatus('success');
      console.log('Content saved successfully');
      // Hide success message after a delay
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Error saving content:", err);
      setSaveStatus('error');
      // Hide error message after a delay
      setTimeout(() => setSaveStatus(null), 5000);
    }
    finally {
      setIsSaving(false);
    }
  };

  // Helper to handle changes in nested content state
  const handleContentChange = (
    section: keyof ContentData,
    field: string,
    value: string,
    index?: number,
    pointIndex?: number
  ) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      // Deep copy to avoid direct state mutation
      const newContent = JSON.parse(JSON.stringify(prevContent)) as ContentData;

      if (section === 'services' && field === 'card' && index !== undefined) {
        (newContent.services.cards[index] as any)[value] = (event?.target as HTMLInputElement | HTMLTextAreaElement).value; // Assuming value is 'title' or 'description' here based on input name
      } else if (section === 'mission' && field === 'point' && index !== undefined) {
        (newContent.mission.points[index] as any)[value] = (event?.target as HTMLInputElement | HTMLTextAreaElement).value; // Assuming value is 'title' or 'text'
      } else {
        // Handle top-level sections like hero, contact or simple fields within services/mission
         if (field in newContent[section]) {
             (newContent[section] as any)[field] = value;
         } else if (section === 'services' || section === 'mission') {
             // Handle introTitle, introText, mainTitle, subTitle, introParagraph
             (newContent[section] as any)[field] = value;
         }
      }
      return newContent;
    });
    setSaveStatus(null); // Clear save status on any change
  };


  // If authenticated, show admin content editor
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Edit Website Content</h1>
          <button
              onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                  setError(null);
                  setContent(null); // Clear content state on logout
              }}
              className="bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition duration-300"
          >
              Logout
          </button>
        </div>

        {isLoadingContent && <p>Loading content...</p>}
        {error && !isLoadingContent && !content && <p className="text-red-500">{error}</p>} 

        {content && !isLoadingContent && (
          <div className="space-y-10 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">

            {/* Save Button & Status */}
            <div className="sticky top-4 z-10 bg-gray-100 dark:bg-gray-700 p-4 rounded shadow flex justify-between items-center">
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveStatus === 'success' && <p className="text-green-600 font-medium">Content saved successfully!</p>}
              {saveStatus === 'error' && <p className="text-red-600 font-medium">Failed to save content. Please try again.</p>}
            </div>

            {/* Hero Section */}
            <section className="space-y-4 p-4 border dark:border-gray-600 rounded">
              <h2 className="text-2xl font-semibold border-b dark:border-gray-600 pb-2">Hero Section</h2>
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  id="heroTitle"
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <textarea
                  id="heroSubtitle"
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </section>

            {/* Services Section */}
            <section className="space-y-4 p-4 border dark:border-gray-600 rounded">
               <h2 className="text-2xl font-semibold border-b dark:border-gray-600 pb-2">Services Section</h2>
               <div>
                 <label htmlFor="servicesIntroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intro Title</label>
                 <input
                   id="servicesIntroTitle"
                   type="text"
                   value={content.services.introTitle}
                   onChange={(e) => handleContentChange('services', 'introTitle', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                 />
               </div>
               <div>
                 <label htmlFor="servicesIntroText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intro Text</label>
                 <textarea
                   id="servicesIntroText"
                   rows={3}
                   value={content.services.introText}
                   onChange={(e) => handleContentChange('services', 'introText', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                 />
               </div>
               <h3 className="text-xl font-medium pt-4">Service Cards</h3>
               {content.services.cards.map((card, index) => (
                 <div key={index} className="space-y-2 p-3 border dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-700">
                   <label htmlFor={`serviceCardTitle-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card {index + 1} Title</label>
                   <input
                     id={`serviceCardTitle-${index}`}
                     type="text"
                     value={card.title}
                     onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, undefined)} // Hacky way to pass index and identify field
                     name="title" // Identify field within card
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                   />
                   <label htmlFor={`serviceCardDesc-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card {index + 1} Description</label>
                   <textarea
                     id={`serviceCardDesc-${index}`}
                     rows={3}
                     value={card.description}
                     onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, undefined)} // Hacky way to pass index and identify field
                     name="description" // Identify field within card
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                   />
                 </div>
               ))}
            </section>

            {/* Mission Section */}
            <section className="space-y-4 p-4 border dark:border-gray-600 rounded">
                <h2 className="text-2xl font-semibold border-b dark:border-gray-600 pb-2">Mission Section (Our Approach)</h2>
                <div>
                    <label htmlFor="missionMainTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Title</label>
                    <input
                    id="missionMainTitle"
                    type="text"
                    value={content.mission.mainTitle}
                    onChange={(e) => handleContentChange('mission', 'mainTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                 <div>
                    <label htmlFor="missionSubTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                    <input
                    id="missionSubTitle"
                    type="text"
                    value={content.mission.subTitle}
                    onChange={(e) => handleContentChange('mission', 'subTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                 <div>
                    <label htmlFor="missionIntroParagraph" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intro Paragraph</label>
                    <textarea
                    id="missionIntroParagraph"
                    rows={4}
                    value={content.mission.introParagraph}
                    onChange={(e) => handleContentChange('mission', 'introParagraph', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <h3 className="text-xl font-medium pt-4">Points</h3>
                {content.mission.points.map((point, index) => (
                    <div key={index} className="space-y-2 p-3 border dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-700">
                        <label htmlFor={`missionPointTitle-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Point {index + 1} Title</label>
                        <input
                        id={`missionPointTitle-${index}`}
                        type="text"
                        value={point.title}
                        onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, undefined)} // Hacky update
                        name="title" // Identify field
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <label htmlFor={`missionPointText-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Point {index + 1} Text</label>
                        <textarea
                        id={`missionPointText-${index}`}
                        rows={3}
                        value={point.text}
                        onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, undefined)} // Hacky update
                        name="text" // Identify field
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                ))}
            </section>

            {/* Contact Section */}
             <section className="space-y-4 p-4 border dark:border-gray-600 rounded">
              <h2 className="text-2xl font-semibold border-b dark:border-gray-600 pb-2">Contact Section Intro</h2>
              <div>
                <label htmlFor="contactTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  id="contactTitle"
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => handleContentChange('contact', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="contactText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intro Text</label>
                <textarea
                  id="contactText"
                  rows={3}
                  value={content.contact.text}
                  onChange={(e) => handleContentChange('contact', 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </section>

             {/* Save Button & Status (Bottom) */}
            <div className="pt-6 border-t dark:border-gray-600 flex justify-between items-center">
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveStatus === 'success' && <p className="text-green-600 font-medium">Content saved successfully!</p>}
              {saveStatus === 'error' && <p className="text-red-600 font-medium">Failed to save content. Please try again.</p>}
            </div>

          </div>
        )}
      </div>
    );
  }

  // Login form (remains the same)
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