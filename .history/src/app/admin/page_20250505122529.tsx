"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  // Redirect after a short delay to allow message to be read
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/newsite');
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);

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
    fieldOrItemKey: string,
    value: string,
    index?: number,
    subField?: string
  ) => {
    setContent(prevContent => {
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
                     onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, 'title')}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                   />
                   <label htmlFor={`serviceCardDesc-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card {index + 1} Description</label>
                   <textarea
                     id={`serviceCardDesc-${index}`}
                     rows={3}
                     value={card.description}
                     onChange={(e) => handleContentChange('services', 'cards', e.target.value, index, 'description')}
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
                        onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, 'title')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <label htmlFor={`missionPointText-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Point {index + 1} Text</label>
                        <textarea
                        id={`missionPointText-${index}`}
                        rows={3}
                        value={point.text}
                        onChange={(e) => handleContentChange('mission', 'points', e.target.value, index, 'text')}
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
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Access Updated</h1>
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
          <p className="font-bold">The admin interface has been improved!</p>
          <p className="block sm:inline mt-2">
            You can now edit content directly on the website by clicking the padlock icon in the bottom right corner of the main site.
          </p>
        </div>
        
        <div className="mt-6 text-gray-700 dark:text-gray-300">
          <p className="mb-4">You'll be redirected to the main site in 5 seconds...</p>
          <div className="flex justify-center">
            <Link href="/newsite" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300">
              Go to Site Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 