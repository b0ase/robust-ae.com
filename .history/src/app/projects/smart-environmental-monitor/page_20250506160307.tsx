"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface ProjectSpecificContent {
  title: string;
  summary: string; 
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  imageSrc: string;
  additionalImages: { src: string; alt: string; }[];
  testimonial?: { quote: string; name: string; position: string; company: string; };
}

interface DatabaseProjectItem {
  title: string;
  description: string; // This will be mapped to summary
  technologies: string[];
  imageSrc: string;
  challenge?: string;
  solution?: string;
  results?: string;
  additionalImages?: { src: string; alt: string; }[];
  testimonial?: { quote: string; name: string; position: string; company: string; };
}

interface FullContentData {
  projects: {
    items: DatabaseProjectItem[];
  };
}

const DEFAULT_CHALLENGE = "Detailed challenge information will be available soon. Our team is currently documenting the specific hurdles overcome in this project.";
const DEFAULT_SOLUTION = "A comprehensive solution was implemented. Further details on the methodologies and technologies used are being compiled.";
const DEFAULT_RESULTS = "The project achieved significant results. Quantitative impacts and client benefits are being finalized for publication.";
const DEFAULT_ADDITIONAL_IMAGES = [
  { src: "/images/projects/placeholder.jpg", alt: "Project image placeholder 1" },
  { src: "/images/projects/placeholder.jpg", alt: "Project image placeholder 2" }
];
const DEFAULT_TESTIMONIAL = {
  quote: "We are very pleased with the outcome of this project and the professionalism of the Robust AE team.",
  name: "Valued Client",
  position: "Management",
  company: "Client Company"
};

export default function SmartEnvironmentalMonitorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<ProjectSpecificContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const PROJECT_PAGE_IDENTIFIER = "Smart Environmental Monitor"; // UPDATED

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    fetchProjectContent();
  }, []);

  const fetchProjectContent = async () => {
    setIsLoading(true);
    try {
      const { data: fullDataWrapper, error: fetchError } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
      if (!fullDataWrapper || !fullDataWrapper.data) throw new Error("No content data found in database wrapper");

      const fullContent = fullDataWrapper.data as FullContentData;
      const allProjectItems = fullContent.projects?.items;
      
      const projectDataFromDb = allProjectItems?.find(p => p.title === PROJECT_PAGE_IDENTIFIER);

      if (projectDataFromDb) {
        setContent({
          title: projectDataFromDb.title,
          summary: projectDataFromDb.description,
          challenge: projectDataFromDb.challenge || DEFAULT_CHALLENGE,
          solution: projectDataFromDb.solution || DEFAULT_SOLUTION,
          results: projectDataFromDb.results || DEFAULT_RESULTS,
          technologies: projectDataFromDb.technologies || [],
          imageSrc: projectDataFromDb.imageSrc || "/images/projects/placeholder.jpg",
          additionalImages: projectDataFromDb.additionalImages && projectDataFromDb.additionalImages.length > 0 ? projectDataFromDb.additionalImages : DEFAULT_ADDITIONAL_IMAGES,
          testimonial: projectDataFromDb.testimonial || DEFAULT_TESTIMONIAL 
        });
      } else {
        console.error(`Project data for "${PROJECT_PAGE_IDENTIFIER}" not found in fetched data.`);
        setContent({ 
            title: PROJECT_PAGE_IDENTIFIER,
            summary: "Details for this project could not be loaded. Please check database configuration.",
            challenge: DEFAULT_CHALLENGE, solution: DEFAULT_SOLUTION, results: DEFAULT_RESULTS, technologies: [],
            imageSrc: "/images/projects/placeholder.jpg", additionalImages: DEFAULT_ADDITIONAL_IMAGES,
            testimonial: DEFAULT_TESTIMONIAL
        });
      }
    } catch (err) {
      console.error("Error fetching project content:", err);
      setContent({ 
          title: PROJECT_PAGE_IDENTIFIER,
          summary: "An error occurred while loading project details.",
          challenge: DEFAULT_CHALLENGE, solution: DEFAULT_SOLUTION, results: DEFAULT_RESULTS, technologies: [],
          imageSrc: "/images/projects/placeholder.jpg", additionalImages: DEFAULT_ADDITIONAL_IMAGES,
          testimonial: DEFAULT_TESTIMONIAL
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (field: keyof ProjectSpecificContent, value: any) => {
    setContent(prev => {
      if (!prev) return null;
      if (field === 'technologies' && typeof value === 'string') {
        const techsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
        return { ...prev, [field]: techsArray };
      }
      if (field === 'testimonial' && typeof value === 'object' && value !== null && prev.testimonial) {
        return { ...prev, testimonial: { ...prev.testimonial, ...value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const saveContent = async () => {
    if (!content) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const { data: fullDataWrapper, error: fetchError } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
      if (!fullDataWrapper || !fullDataWrapper.data) throw new Error("Could not fetch current content to save.");

      const fullContent = fullDataWrapper.data as FullContentData;
      const projectIndex = fullContent.projects?.items?.findIndex(p => p.title === PROJECT_PAGE_IDENTIFIER);

      if (projectIndex === undefined || projectIndex === -1) {
        throw new Error(`Could not find project "${PROJECT_PAGE_IDENTIFIER}" in database to update.`);
      }
      
      fullContent.projects.items[projectIndex] = {
        ...fullContent.projects.items[projectIndex],
        title: content.title,
        description: content.summary, 
        technologies: content.technologies,
        imageSrc: content.imageSrc,
        challenge: content.challenge,
        solution: content.solution,
        results: content.results,
        additionalImages: content.additionalImages,
        testimonial: content.testimonial,
      };

      const { error: saveError } = await supabase
        .from('robust_ae_content')
        .update({ data: fullContent, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (saveError) throw saveError;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Error saving content:", err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'George123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      setError('');
      setIsAuthModalOpen(false);
    } else {
      setError('Invalid password');
      setIsAuthenticated(false);
      sessionStorage.removeItem('isAuthenticated');
    }
    setPassword('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white">Loading Project Data...</div></div>;
  }

  if (!content) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white text-center">Critical Error: Project content could not be initialized.</div></div>;
  }

  return (
    <>
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-gray-700 max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Admin Login</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              {error && <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded">{error}</div>}
              <div>
                <label htmlFor={`password-${PROJECT_PAGE_IDENTIFIER}`} className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input id={`password-${PROJECT_PAGE_IDENTIFIER}`} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black border border-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-500 pr-10" required placeholder="Enter admin password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm focus:outline-none" style={{ top: '0' }} aria-label={showPassword ? "Hide" : "Show"}>
                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> }
                  </button>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
                <button type="button" onClick={() => setIsAuthModalOpen(false)} className="border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800 transition rounded-md w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={isSaving} className="border border-blue-600 bg-blue-600 text-white font-medium px-4 py-2 hover:bg-blue-700 transition rounded-md w-full sm:w-auto disabled:opacity-50">{isSaving ? 'Logging in...' : 'Login'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-60 py-3 px-4 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <span className="font-medium">Admin Mode</span>
              <span className="hidden sm:block text-sm text-gray-300">Editing: {content.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {saveStatus === 'success' && <span className="text-green-400 text-xs">Saved!</span>}
              {saveStatus === 'error' && <span className="text-red-400 text-xs">Save failed!</span>}
              <Link href="/admin" className="border border-yellow-500 text-yellow-400 px-3 py-1 text-xs hover:bg-yellow-500 hover:text-gray-900 transition rounded-md">Admin Dashboard</Link>
              <button onClick={saveContent} disabled={isSaving} className="border border-green-500 text-green-400 px-3 py-1 text-xs hover:bg-green-500 hover:text-white transition rounded-md disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={handleLogout} className="border border-red-500 text-red-400 px-3 py-1 text-xs hover:bg-red-500 hover:text-white transition rounded-md">Exit</button>
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <button onClick={() => setIsAuthModalOpen(true)} className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-30" aria-label="Admin Login">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
        </button>
      )}

      <div className={`bg-b0ase-dark text-gray-300 min-h-screen ${isAuthenticated ? 'pt-16 sm:pt-12' : ''}`}>
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="mb-8">
            <Link href="/projects" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to All Projects
            </Link>
          </div>

          <div className="mb-10 md:mb-12">
            {isAuthenticated ? (
              <input type="text" value={content.title} onChange={(e) => handleContentChange('title', e.target.value)} className="text-3xl md:text-4xl lg:text-5xl font-bold w-full px-3 py-2 border-2 border-dashed border-transparent hover:border-b0ase-blue focus:border-b0ase-blue bg-transparent text-white focus:outline-none transition rounded-md" />
            ) : (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{content.title}</h1>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                {content.imageSrc ? (
                  <Image src={content.imageSrc} alt={content.title} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 66vw" priority />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                )}
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-center p-4">
                      <input type="text" value={content.imageSrc} onChange={(e) => handleContentChange('imageSrc', e.target.value)} className="px-2 py-1 bg-transparent border border-white text-white text-sm w-full max-w-xs mb-2 rounded-md" placeholder="/images/projects/your-image.jpg" />
                    </div>
                  </div>
                )}
              </div>

              {[ { title: "Project Summary", field: "summary", rows: 4 }, { title: "The Challenge", field: "challenge", rows: 6 }, { title: "Our Solution", field: "solution", rows: 8 }, { title: "Results & Impact", field: "results", rows: 6 } ].map(section => (
                <div key={section.field} className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">{section.title}</h2>
                  {isAuthenticated ? (
                    <textarea value={content[section.field as keyof ProjectSpecificContent] as string} onChange={(e) => handleContentChange(section.field as keyof ProjectSpecificContent, e.target.value)} rows={section.rows} className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded-md resize-y min-h-[100px]" />
                  ) : (
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">{content[section.field as keyof ProjectSpecificContent] as string}</p>
                  )}
                </div>
              ))}
            </div>

            <aside className="lg:col-span-1 space-y-8">
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Technologies Used</h2>
                {isAuthenticated ? (
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Edit (comma-separated)</label>
                    <input type="text" value={content.technologies.join(', ')} onChange={(e) => handleContentChange('technologies', e.target.value)} className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded-md" />
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {content.technologies.map((tech, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {content.testimonial && (
                <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Client Testimonial</h2>
                  <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <textarea value={content.testimonial.quote} onChange={(e) => handleContentChange('testimonial', { quote: e.target.value })} rows={3} className="w-full p-2 border text-gray-300 border-gray-600 focus:border-b0ase-blue bg-gray-700 focus:outline-none rounded-md resize-y" placeholder="Quote" />
                        <input type="text" value={content.testimonial.name} onChange={(e) => handleContentChange('testimonial', { name: e.target.value })} placeholder="Name" className="w-full p-2 border text-gray-300 border-gray-600 focus:border-b0ase-blue bg-gray-700 focus:outline-none rounded-md" />
                        <input type="text" value={content.testimonial.position} onChange={(e) => handleContentChange('testimonial', { position: e.target.value })} placeholder="Position" className="w-full p-2 border text-gray-300 border-gray-600 focus:border-b0ase-blue bg-gray-700 focus:outline-none rounded-md" />
                        <input type="text" value={content.testimonial.company} onChange={(e) => handleContentChange('testimonial', { company: e.target.value })} placeholder="Company" className="w-full p-2 border text-gray-300 border-gray-600 focus:border-b0ase-blue bg-gray-700 focus:outline-none rounded-md" />
                      </div>
                    ) : (
                      <blockquote className="text-gray-300">
                        <p className="italic mb-3 leading-relaxed">"{content.testimonial.quote}"</p>
                        <footer className="text-gray-400 text-sm text-right">
                          — <cite className="font-medium text-white not-italic">{content.testimonial.name}</cite>, {content.testimonial.position}, {content.testimonial.company}
                        </footer>
                      </blockquote>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Start Your Project</h2>
                <p className="text-sm text-gray-400 mb-5 leading-relaxed">Need a custom monitoring solution for your industrial environment? Contact us to discuss your needs and learn how our expertise can help you.</p>
                <Link href="/newsite#contact" className="block w-full bg-b0ase-blue text-white font-medium px-6 py-3 text-center hover:bg-blue-700 transition rounded-md">
                  Discuss Your Project
                </Link>
              </div>
            </aside>
          </div>

          <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md mt-8 xl:mt-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">Additional Project Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {content.additionalImages.map((image, index) => (
                <div key={index} className="relative aspect-[16/9] rounded-md overflow-hidden bg-gray-800 group">
                  {image.src ? (
                    <Image src={image.src} alt={image.alt || `Additional image ${index + 1}`} fill className="object-cover" sizes="(max-width: 639px) 100vw, 50vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No image</div>
                  )}
                  {isAuthenticated && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 space-y-1">
                      <input type="text" value={image.src} onChange={(e) => { const imgs = [...content.additionalImages]; imgs[index].src = e.target.value; handleContentChange('additionalImages', imgs); }} className="px-2 py-1 bg-gray-700 border border-gray-600 text-white text-xs w-full rounded-sm" placeholder="Image path" />
                      <input type="text" value={image.alt} onChange={(e) => { const imgs = [...content.additionalImages]; imgs[index].alt = e.target.value; handleContentChange('additionalImages', imgs); }} className="px-2 py-1 bg-gray-700 border border-gray-600 text-white text-xs w-full rounded-sm" placeholder="Alt text" />
                      <button onClick={() => { const imgs = content.additionalImages.filter((_, i) => i !== index); handleContentChange('additionalImages', imgs);}} className="text-red-400 hover:text-red-300 text-xs pt-1">Remove</button>
                    </div>
                  )}
                </div>
              ))}
              {isAuthenticated && (
                <button onClick={() => handleContentChange('additionalImages', [...content.additionalImages, { src: '/images/projects/new-placeholder.jpg', alt: 'New project image' }])} className="aspect-[16/9] flex items-center justify-center bg-gray-800 hover:bg-gray-700 border-2 border-dashed border-gray-600 hover:border-b0ase-blue transition-colors rounded-md text-gray-400 hover:text-b0ase-blue">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Image
                  </div>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 