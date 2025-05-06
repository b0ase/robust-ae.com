"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

// Re-use the DatabaseProjectItem type (or a simplified version if needed)
interface DatabaseProjectItem {
  title: string;
  description: string;
  technologies: string[];
  imageSrc: string;
  // Add other fields if needed for display, but keep it simple for now
}

interface FullContentData {
  projects: {
    items: DatabaseProjectItem[];
  };
  // Other potential top-level fields from your Supabase data structure
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DatabaseProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // --- Authentication State Copied from newsite ---
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null); // Renamed from 'error'
  const [showPassword, setShowPassword] = useState(false);
  // --- End Authentication State ---

  // Restore the useEffect hook
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
    // console.log('ProjectsPage: useEffect - sessionStorage isAdminAuthenticated:', storedAuth); // Keep debug log commented out for now
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      // Explicitly set to false if not 'true' (handles null or other values)
      setIsAuthenticated(false); 
    }
    // We still need to fetch projects even if useEffect is commented out
    fetchProjects(); 
  }, []); // Fetch projects and check auth on initial load
  
  /* // Remove this separate fetchProjects useEffect
  useEffect(() => {
    fetchProjects();
  }, []); // Fetch projects on initial load
  */

  const fetchProjects = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const { data: fullDataWrapper, error: supabaseError } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();

      if (supabaseError) throw supabaseError;
      if (!fullDataWrapper || !fullDataWrapper.data) throw new Error("No content data found in database");

      const fullContent = fullDataWrapper.data as FullContentData;
      
      if (fullContent.projects && fullContent.projects.items) {
        setProjects(fullContent.projects.items);
      } else {
        // Set empty array or handle case where projects data is missing
        setProjects([]); 
        console.warn("No projects found in the fetched data structure.");
      }

    } catch (err) {
      console.error("Error fetching projects:", err);
      setFetchError("Failed to load project data. Please try again later.");
      setProjects([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate slugs
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'); // Basic slug generation
  };

  // --- Authentication Handler Copied from newsite ---
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error("NEXT_PUBLIC_ADMIN_PASSWORD is not set!");
      setAuthError("Config error.");
      return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthModalOpen(false);
      // Optional: Redirect or update UI elements if needed upon login on this page
    } else {
      setAuthError('Invalid password.');
      setPassword('');
    }
  };
  // --- End Authentication Handler ---

  // --- Logout Handler Copied from newsite ---
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword(''); 
    setAuthError(null);
    // Remove authentication from sessionStorage
    sessionStorage.removeItem('isAdminAuthenticated');
    // No editable content to reset on this page
  };
  // --- End Logout Handler ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-b0ase-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b0ase-blue"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-b0ase-dark flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h1>
          <p className="text-gray-400">{fetchError}</p>
          <button 
            onClick={fetchProjects} 
            className="mt-6 border border-gray-600 text-white px-4 py-2 hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('ProjectsPage: Rendering - isAuthenticated state:', isAuthenticated); // DEBUG LOG

  return (
    <>
      {/* Authentication Modal - Moved outside the main content div */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90 px-4">
          <div className="bg-b0ase-card p-6 md:p-8 rounded-lg border border-b0ase-card-border max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Admin Login</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              {authError && (
                <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{authError}</span>
                </div>
              )}
              <div>
                <label htmlFor="password-projects" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-projects"
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
                    {showPassword ? ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> )}
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
      {/* Padlock Icon - Moved outside the main content div */}
      {!isAuthenticated && (
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-70"
          aria-label="Admin Login"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </button>
      )}

      {/* --- Admin Toolbar Added --- */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-70 py-3 px-4 shadow-md"> {/* Keep toolbar at 70 */}
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <span className="font-medium">Admin Mode</span>
              <span className="hidden sm:block text-sm text-gray-300">Viewing Projects Page</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* No save button needed on this read-only page */}
               <Link href="/admin" className="border border-yellow-500 text-yellow-400 px-3 py-1 text-xs hover:bg-yellow-500 hover:text-gray-900 transition rounded-md">Admin Dashboard</Link>
              <button onClick={handleLogout} className="border border-red-500 text-red-400 px-3 py-1 text-xs hover:bg-red-500 hover:text-white transition rounded-md">Exit</button>
            </div>
          </div>
        </div>
      )}
      {/* --- End Admin Toolbar --- */}

      {/* Main Content Wrapper - Adjusted padding */}
      <div className={`bg-b0ase-dark text-gray-300 min-h-screen ${isAuthenticated ? 'pt-16 sm:pt-12' : ''}`}> 
        <main className="container mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center mb-12">
            <div className="w-6 h-6 mr-4 relative">
              <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
              <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Our Projects</h1>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No projects found.</p>
              <p className="text-sm mt-2">If you are the administrator, please ensure projects are added via the /newsite page admin interface.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {projects.map((project, index) => (
                <div key={index} className="bg-b0ase-card p-5 md:p-6 rounded-lg border border-b0ase-card-border shadow-lg transform transition duration-300 hover:scale-[1.02] hover:shadow-blue-900/30">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="lg:w-1/3">
                      <div className="relative h-48 w-full rounded overflow-hidden bg-gray-800">
                        {project.imageSrc ? (
                          <Image
                            src={project.imageSrc}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1023px) 100vw, 33vw"
                          />
                        ) : (
                           <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                        )}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="lg:w-2/3 flex flex-col">
                      <h2 className="text-xl md:text-2xl font-semibold mb-3 text-white">{project.title}</h2>
                      <p className="text-gray-300 mb-4 text-sm md:text-base flex-grow">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).map((tech, techIndex) => (
                          <span key={techIndex} className="bg-b0ase-blue bg-opacity-20 text-b0ase-blue text-xs px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto self-end">
                        <Link 
                          href={`/projects/${generateSlug(project.title)}`} 
                          className="text-b0ase-blue hover:text-white transition-colors font-medium inline-flex items-center text-sm md:text-base group"
                        >
                          View Project Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
} 