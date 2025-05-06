"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

// Define types for the editable content
interface ProjectContent {
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  imageSrc: string;
  additionalImages: {
    src: string;
    alt: string;
  }[];
  testimonial?: {
    quote: string;
    name: string;
    position: string;
    company: string;
  };
}

// Define the type for the full content structure (matching newsite)
interface FullContentData {
  // ... include all other sections from newsite if needed for saving ...
  projects: {
    items: {
      title: string;
      description: string;
      technologies: string[];
      imageSrc: string;
      // Add fields if they exist in your Supabase structure
      challenge?: string; 
      solution?: string;
      results?: string;
      additionalImages?: { src: string; alt: string; }[];
      testimonial?: { quote: string; name: string; position: string; company: string; };
    }[];
  };
  // ... other sections ...
}

export default function IndustrialControlSystemPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const PROJECT_TITLE = "Industrial Control System"; // Identifier for this project

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    fetchProjectContent();
  }, []);

  const fetchProjectContent = async () => {
    setIsLoading(true);
    try {
      const { data: fullData, error: fetchError } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
      if (!fullData || !fullData.data) throw new Error("No content data found");

      const allProjects = (fullData.data as FullContentData).projects?.items;
      console.log("Fetched allProjects:", allProjects); // DEBUGGING LINE
      const projectData = allProjects?.find(p => p.title === PROJECT_TITLE);

      if (projectData) {
        // Map fetched project data to the ProjectContent structure
        setContent({
          title: projectData.title,
          summary: projectData.description,
          challenge: projectData.challenge || "Challenge details not available.", // Provide defaults
          solution: projectData.solution || "Solution details not available.",   // Provide defaults
          results: projectData.results || "Results details not available.",     // Provide defaults
          technologies: projectData.technologies || [],
          imageSrc: projectData.imageSrc || "/images/projects/placeholder.jpg",
          additionalImages: projectData.additionalImages || [
            { src: "/images/projects/placeholder.jpg", alt: "Placeholder 1"},
            { src: "/images/projects/placeholder.jpg", alt: "Placeholder 2"}
          ], // Provide defaults
          testimonial: projectData.testimonial || undefined // Provide defaults (optional)
        });
      } else {
         console.error(`Project data for "${PROJECT_TITLE}" not found.`);
         // Set some default error state or fallback content if needed
         setContent({ // Fallback default content
            title: PROJECT_TITLE,
            summary: "Details for this project could not be loaded.",
            challenge: "", solution: "", results: "", technologies: [],
            imageSrc: "/images/projects/placeholder.jpg", additionalImages: [],
         });
      }

    } catch (error) {
      console.error("Error fetching content:", error);
       setContent({ // Fallback default content on error
          title: PROJECT_TITLE,
          summary: "Error loading project details.",
          challenge: "", solution: "", results: "", technologies: [],
          imageSrc: "/images/projects/placeholder.jpg", additionalImages: [],
       });
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified handleContentChange - updates the local 'content' state for this specific project
 const handleContentChange = (
    field: keyof ProjectContent,
    value: any,
    // Remove nestedField logic if direct updates are sufficient or handled differently
  ) => {
    setContent(prev => {
      if (!prev) return null;

      // Special handling for technologies array if value is string
      if (field === 'technologies' && typeof value === 'string') {
         const techsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
         return { ...prev, [field]: techsArray };
      }
      
      // Handle array of objects like additionalImages
      if (field === 'additionalImages' && Array.isArray(value)) {
          // Assuming value is the complete new array passed from the component logic
          return { ...prev, [field]: value };
      }

      // Special handling for testimonial object
      if (field === 'testimonial' && typeof value === 'object' && value !== null && prev.testimonial) {
         return { ...prev, testimonial: { ...prev.testimonial, ...value } };
      }


      // Direct update for other fields
      return { ...prev, [field]: value };
    });
  };


  // Updated saveContent to fetch, modify, and save the full content blob
  const saveContent = async () => {
     if (!content) return; // Don't save if there's no content
     setIsSaving(true);
     setSaveStatus(null);
     try {
       // 1. Fetch the latest full content data
       const { data: fullDataResult, error: fetchError } = await supabase
         .from('robust_ae_content')
         .select('data')
         .eq('id', 1)
         .single();

       if (fetchError) throw fetchError;
       if (!fullDataResult || !fullDataResult.data) throw new Error("Could not fetch current content to save.");

       const fullContent = fullDataResult.data as FullContentData;

       // 2. Find the index of the project being edited
       const projectIndex = fullContent.projects?.items?.findIndex(p => p.title === PROJECT_TITLE);

       if (projectIndex === undefined || projectIndex === -1) {
         throw new Error(`Could not find project "${PROJECT_TITLE}" to update.`);
       }

       // 3. Update the specific project data within the full content object
       // Ensure all fields from ProjectContent are mapped back correctly
       const currentProjectState = content; // The state being edited on this page
       fullContent.projects.items[projectIndex] = {
           ...fullContent.projects.items[projectIndex], // Keep existing fields
           title: currentProjectState.title,
           description: currentProjectState.summary, // Map summary back to description
           technologies: currentProjectState.technologies,
           imageSrc: currentProjectState.imageSrc,
           challenge: currentProjectState.challenge, // Save potentially edited fields
           solution: currentProjectState.solution,
           results: currentProjectState.results,
           additionalImages: currentProjectState.additionalImages,
           testimonial: currentProjectState.testimonial,
       };


       // 4. Save the entire updated content object back to Supabase
       const { error: saveError } = await supabase
         .from('robust_ae_content')
         .upsert({ id: 1, data: fullContent, updated_at: new Date() }); // Use upsert

       if (saveError) throw saveError;

       setSaveStatus('success');
       setTimeout(() => setSaveStatus(null), 3000); // Hide after 3s

     } catch (err) {
       console.error("Error saving content:", err);
       setSaveStatus('error');
       setTimeout(() => setSaveStatus(null), 5000); // Hide after 5s
     } finally {
       setIsSaving(false);
     }
   };


  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Removed setIsSaving(true/false) as it's handled by the main site logic?
    // Let's keep it simple for now
    if (password === 'George123') { // Use the correct password
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // Use localStorage for persistence
      setError('');
      setIsAuthModalOpen(false); // Close modal on success
    } else {
      setError('Invalid password');
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    }
    setPassword(''); // Clear password field
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  if (!content) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white text-center">Error loading content for {PROJECT_TITLE}.<br/>Please check if the project exists in the database.</div></div>;
  }

  return (
     // Wrap content in a fragment or a div that doesn't conflict with root layout
    <>
      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-gray-700 max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Admin Login</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              {error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="password-project" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-project" // Unique ID for password input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black border border-gray-700 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:border-blue-500 pr-10"
                    required
                    placeholder="Enter admin password"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                    style={{ top: '-0.375rem' }} // Adjust positioning if needed
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
                   disabled={isSaving} // Disable button while authenticating (if isSaving state is used)
                  className="border border-blue-600 bg-blue-600 text-white font-medium px-4 py-2 hover:bg-blue-700 transition mb-3 sm:mb-0 disabled:opacity-50"
                >
                   {isSaving ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

       {/* Admin Toolbar - Copied from newsite page */}
       {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-40 py-3 px-4 shadow-md"> {/* z-40 below modal */}
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <span className="font-medium">Admin Mode</span>
                <div className="hidden sm:block text-sm text-gray-300">Editing: {content.title}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {saveStatus === 'success' && (
                  <span className="text-green-400 text-xs sm:text-sm">Content saved successfully!</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-400 text-xs sm:text-sm">Failed to save. Try again.</span>
                )}
                 {/* Removed Admin Dashboard Link - optional */}
                 <Link
                  href="/admin"
                  className="border border-yellow-600 text-yellow-400 px-3 py-1 text-xs sm:text-sm hover:bg-yellow-900 hover:bg-opacity-30 transition"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={saveContent} // Use the updated saveContent
                  disabled={isSaving}
                  className="border border-green-600 text-green-400 px-3 py-1 text-xs sm:text-sm hover:bg-green-900 hover:bg-opacity-30 transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleLogout} // Use the existing logout handler
                  className="border border-red-600 text-red-400 px-3 py-1 text-xs sm:text-sm hover:bg-red-900 hover:bg-opacity-30 transition"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Padlock Icon - Copied from newsite page */}
      {!isAuthenticated && (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-30" // z-30 below toolbar/modal
          aria-label="Admin Login"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </button>
      )}

      {/* Main Project Page Content Area */}
      {/* Apply pt-14 padding only when authenticated to account for the admin toolbar */}
      <div className={`bg-b0ase-dark text-gray-300 min-h-screen ${isAuthenticated ? 'pt-14' : ''}`}>
        <main className="container mx-auto px-4 py-16 md:py-20">
         {/* Back Button - Remains the same */}
         <div className="flex justify-between items-center mb-8">
            <Link href="/newsite#projects" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
            {/* Placeholder for potential future actions */}
          </div>

           {/* Project Title */}
          <div className="mb-12">
            {isAuthenticated ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="text-3xl md:text-4xl font-bold w-full px-3 py-2 border-2 border-dashed border-transparent hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition"
              />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-white">{content.title}</h1>
            )}
          </div>

          {/* Main Content Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
               {/* Image */}
               <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-800">
                 {content.imageSrc ? (
                   <Image
                     src={content.imageSrc}
                     alt={content.title}
                     fill
                     className="object-contain" // Use contain to see the whole image
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" // Adjusted sizes
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                 )}
                  {isAuthenticated && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                       <div className="text-center p-4">
                         <p className="text-white text-sm mb-2">Current image: {content.imageSrc}</p>
                         {/* Simple text input for image path editing */}
                         <input
                           type="text"
                           value={content.imageSrc}
                           onChange={(e) => handleContentChange('imageSrc', e.target.value)}
                           className="px-2 py-1 bg-transparent border border-white text-white text-sm w-full mb-2"
                           placeholder="Enter image path (e.g., /images/projects/...)"
                         />
                         <span className="text-xs text-gray-300">Update image path</span>
                         {/* Add ImageUploader here if needed */}
                       </div>
                    </div>
                  )}
               </div>

              {/* Project Summary */}
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Project Summary</h2>
                {isAuthenticated ? (
                  <textarea
                    value={content.summary}
                    onChange={(e) => handleContentChange('summary', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-line">{content.summary}</p>
                )}
              </div>

              {/* The Challenge */}
               <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                 <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">The Challenge</h2>
                 {isAuthenticated ? (
                   <textarea
                     value={content.challenge}
                     onChange={(e) => handleContentChange('challenge', e.target.value)}
                     rows={6} // Adjusted rows
                     className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                   />
                 ) : (
                   <p className="text-gray-300 whitespace-pre-line">{content.challenge}</p>
                 )}
               </div>

              {/* Our Solution */}
               <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                 <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Our Solution</h2>
                 {isAuthenticated ? (
                   <textarea
                     value={content.solution}
                     onChange={(e) => handleContentChange('solution', e.target.value)}
                     rows={10} // Adjusted rows
                     className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                   />
                 ) : (
                   <p className="text-gray-300 whitespace-pre-line">{content.solution}</p>
                 )}
               </div>

              {/* Results & Impact */}
               <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                 <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Results & Impact</h2>
                 {isAuthenticated ? (
                   <textarea
                     value={content.results}
                     onChange={(e) => handleContentChange('results', e.target.value)}
                     rows={6} // Adjusted rows
                     className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                   />
                 ) : (
                   <p className="text-gray-300 whitespace-pre-line">{content.results}</p>
                 )}
               </div>
            </div>

             {/* Right Sidebar */}
             <div className="lg:col-span-1 space-y-8">
                {/* Technologies Used */}
                <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                   <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Technologies Used</h2>
                   {isAuthenticated ? (
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={content.technologies ? content.technologies.join(', ') : ''} // Null check added
                          onChange={(e) => handleContentChange('technologies', e.target.value)} // Pass string value
                          className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                        />
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {content.technologies && content.technologies.map((tech, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{tech}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* Client Testimonial */}
                 {content.testimonial && (
                  <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                    <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Client Testimonial</h2>
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      {isAuthenticated ? (
                        <div className="space-y-3">
                           <textarea
                            value={content.testimonial.quote}
                            onChange={(e) => handleContentChange('testimonial', { quote: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                            placeholder="Quote"
                          />
                           <input
                            type="text"
                            value={content.testimonial.name}
                            onChange={(e) => handleContentChange('testimonial', { name: e.target.value })}
                            placeholder="Name"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                           <input
                            type="text"
                            value={content.testimonial.position}
                            onChange={(e) => handleContentChange('testimonial', { position: e.target.value })}
                            placeholder="Position"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                          <input
                            type="text"
                            value={content.testimonial.company}
                            onChange={(e) => handleContentChange('testimonial', { company: e.target.value })}
                            placeholder="Company"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-300 italic mb-2">"{content.testimonial.quote}"</p>
                          <div className="text-gray-400 text-sm text-right">
                            — <span className="font-medium text-white">{content.testimonial.name}</span>, {content.testimonial.position}, {content.testimonial.company}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                 )}

                {/* Start Your Project */}
                <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Start Your Project</h2>
                  <p className="text-sm text-gray-300 mb-4">
                    Need a similar solution for your manufacturing facility? Contact us to discuss your specific needs and how we can help.
                  </p>
                  <div className="mt-6 pt-2">
                    <Link
                      href="/newsite#contact"
                      className="border border-gray-700 text-white font-medium px-4 py-2 hover:bg-gray-800 transition w-full flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Discuss Your Project
                    </Link>
                  </div>
                </div>
             </div>
          </div>

            {/* Additional Images */}
             <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
               <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-2">Additional Project Images</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.additionalImages && content.additionalImages.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded overflow-hidden bg-gray-800">
                    {image.src ? (
                      <Image
                        src={image.src}
                        alt={image.alt || "Additional project image"}
                        fill
                        className="object-contain" // Use contain
                        sizes="(max-width: 768px) 50vw, 33vw" // Adjusted sizes
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                    )}
                      {isAuthenticated && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                           <div className="text-center p-4 w-full max-w-xs">
                             <p className="text-white text-xs truncate mb-2" title={image.src}>{image.src}</p>
                             <div className="space-y-1">
                               <input
                                type="text"
                                value={image.src}
                                onChange={(e) => {
                                  const newImages = [...(content.additionalImages || [])];
                                  newImages[index] = { ...newImages[index], src: e.target.value };
                                  handleContentChange('additionalImages', newImages);
                                }}
                                className="px-2 py-1 bg-transparent border border-white text-white text-xs w-full"
                                placeholder="Image path"
                              />
                              <input
                                type="text"
                                value={image.alt}
                                onChange={(e) => {
                                   const newImages = [...(content.additionalImages || [])];
                                   newImages[index] = { ...newImages[index], alt: e.target.value };
                                   handleContentChange('additionalImages', newImages);
                                }}
                                className="px-2 py-1 bg-transparent border border-white text-white text-xs w-full"
                                placeholder="Image description"
                              />
                              {/* Optional: Add button to remove image */}
                             </div>
                           </div>
                        </div>
                      )}
                  </div>
                ))}
                 {/* Button to add new image when authenticated */}
                 {isAuthenticated && (
                    <div className="flex items-center justify-center aspect-video rounded border-2 border-dashed border-gray-600 hover:border-b0ase-blue transition">
                       <button
                        onClick={() => {
                           setContent(prev => {
                            if (!prev) return null;
                            const newImages = [...(prev.additionalImages || [])];
                            newImages.push({ src: '/images/projects/placeholder.jpg', alt: 'New Image' });
                            return { ...prev, additionalImages: newImages };
                           });
                        }}
                         className="text-b0ase-blue text-sm font-medium p-4"
                       >
                         + Add Image
                       </button>
                    </div>
                 )}
              </div>
            </div>
          </main>
         {/* Footer can be added here if not part of a root layout */}
         {/* <footer className="bg-black border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
           © {new Date().getFullYear()} Robust AE Ltd. All rights reserved.
         </footer> */}
       </div>
    </>
  );
} 