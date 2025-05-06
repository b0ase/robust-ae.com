"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function IndustrialControlSystemPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error'>('success');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    
    // Fetch or set default content
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Attempt to fetch content from API
      const response = await fetch('/api/content?section=projectIndustrialControl');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // If no content is stored, use default
        setContent({
          title: "Industrial Control System",
          summary: "A comprehensive control system for manufacturing equipment, featuring real-time monitoring, predictive maintenance algorithms, and integration with existing factory systems.",
          challenge: "Our client, a large manufacturing company, needed to modernize their production line with a control system that could integrate with legacy equipment while providing advanced monitoring capabilities. Their existing systems were fragmented, leading to inefficient operations and frequent downtime.",
          solution: "We developed a comprehensive industrial control system built on modern PLC architecture with a custom SCADA interface. The solution includes real-time monitoring dashboards, predictive maintenance algorithms that analyze equipment performance data, and seamless integration with existing factory systems through industry-standard protocols like ModBus.",
          results: "The implemented system resulted in a 35% reduction in unplanned downtime, 20% improvement in production efficiency, and created a foundation for future IoT expansion. Maintenance costs were reduced by anticipating equipment failures before they occurred, and operators reported significantly improved visibility into manufacturing processes.",
          technologies: ["PLC", "SCADA", "HMI Design", "ModBus", "Real-time Monitoring", "Predictive Maintenance", "Factory Integration"],
          imageSrc: "/images/projects/industrial-control-system-main.jpg",
          additionalImages: [
            {
              src: "/images/projects/industrial-control-1.jpg",
              alt: "Control system dashboard interface"
            },
            {
              src: "/images/projects/industrial-control-2.jpg",
              alt: "Hardware installation on factory floor"
            },
            {
              src: "/images/projects/industrial-control-3.jpg",
              alt: "Predictive maintenance analytics screen"
            }
          ],
          testimonial: {
            quote: "The industrial control system developed by Robust AE transformed our manufacturing operations. The predictive maintenance capabilities alone have saved us countless hours of downtime and associated costs. Their team's expertise in both legacy systems and cutting-edge technology was exactly what we needed.",
            name: "Sarah Johnson",
            position: "CTO",
            company: "MaxTech Industries"
          }
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (
    field: keyof ProjectContent, 
    value: any,
    nestedField?: string,
    nestedValue?: any
  ) => {
    setContent(prev => {
      if (!prev) return null;
      
      // Special handling for testimonial updates
      if (field === 'testimonial' && typeof value === 'object' && prev.testimonial) {
        return {
          ...prev,
          testimonial: {
            ...prev.testimonial,
            ...value
          }
        };
      }
      
      // For other nested fields
      if (nestedField && nestedValue !== undefined) {
        const updatedField = { ...prev[field] };
        if (typeof updatedField === 'object' && updatedField !== null) {
          // @ts-ignore - we know this is safe because we're checking field exists
          updatedField[nestedField] = nestedValue;
        }
        
        return {
          ...prev,
          [field]: updatedField
        };
      }
      
      // For direct field updates
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const saveContent = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'projectIndustrialControl',
          data: content
        }),
      });
      
      if (response.ok) {
        alert('Content saved successfully!');
      } else {
        alert('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Implement authentication logic here
      if (password === 'correctPassword') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setError('');
        setSaveStatus('success');
      } else {
        setError('Invalid password');
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error authenticating:', error);
      setError('An error occurred. Please try again later.');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  if (!content) {
    return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white">Error loading content</div></div>;
  }

  return (
    <div className={isAuthenticated ? "pt-14" : ""}>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.36 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
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
                <button
                  onClick={saveContent}
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

      <div className="bg-gray-900 py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb navigation */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/newsite#projects" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
          </div>
          
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-800 mb-8">
                {content.imageSrc ? (
                  <Image
                    src={content.imageSrc}
                    alt={content.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                )}
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-center p-4">
                      <p className="text-white text-sm mb-2">Current image: {content.imageSrc}</p>
                      <input
                        type="text"
                        value={content.imageSrc}
                        onChange={(e) => handleContentChange('imageSrc', e.target.value)}
                        className="px-2 py-1 bg-transparent border border-white text-white text-sm w-full mb-2"
                        placeholder="Enter image path"
                      />
                      <span className="text-xs text-gray-300">
                        Enter the path to the image
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Project Summary</h2>
                {isAuthenticated ? (
                  <textarea
                    value={content.summary}
                    onChange={(e) => handleContentChange('summary', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                  />
                ) : (
                  <p className="text-gray-300">{content.summary}</p>
                )}
              </div>
              
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">The Challenge</h2>
                {isAuthenticated ? (
                  <textarea
                    value={content.challenge}
                    onChange={(e) => handleContentChange('challenge', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-line">{content.challenge}</p>
                )}
              </div>
              
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Our Solution</h2>
                {isAuthenticated ? (
                  <textarea
                    value={content.solution}
                    onChange={(e) => handleContentChange('solution', e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-line">{content.solution}</p>
                )}
              </div>
              
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Results & Impact</h2>
                {isAuthenticated ? (
                  <textarea
                    value={content.results}
                    onChange={(e) => handleContentChange('results', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-line">{content.results}</p>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Technologies Used</h2>
                <div className="space-y-4">
                  {isAuthenticated ? (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={content.technologies.join(', ')}
                        onChange={(e) => {
                          const techsString = e.target.value;
                          const techsArray = techsString.split(',').map(item => item.trim()).filter(item => item !== '');
                          handleContentChange('technologies', techsArray);
                        }}
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
              </div>
              
              {content.testimonial && (
                <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Client Testimonial</h2>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    {isAuthenticated ? (
                      <>
                        <textarea
                          value={content.testimonial.quote}
                          onChange={(e) => handleContentChange('testimonial', {...content.testimonial, quote: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none mb-2"
                        />
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={content.testimonial.name}
                            onChange={(e) => handleContentChange('testimonial', {...content.testimonial, name: e.target.value})}
                            placeholder="Name"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                          <input
                            type="text"
                            value={content.testimonial.position}
                            onChange={(e) => handleContentChange('testimonial', {...content.testimonial, position: e.target.value})}
                            placeholder="Position"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                          <input
                            type="text"
                            value={content.testimonial.company}
                            onChange={(e) => handleContentChange('testimonial', {...content.testimonial, company: e.target.value})}
                            placeholder="Company"
                            className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300 italic mb-2">"{content.testimonial.quote}"</p>
                        <div className="text-gray-400 text-sm">
                          <span className="font-medium text-white">{content.testimonial.name}</span> • {content.testimonial.position}, {content.testimonial.company}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Start Your Project</h2>
                <p className="text-sm text-gray-300 mb-4">
                  Looking for a similar solution for your manufacturing facility? Contact us to discuss your specific needs and how we can help.
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
        </div>
        
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
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                )}
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-center p-4">
                      <p className="text-white text-sm mb-2">{image.src}</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={image.src}
                          onChange={(e) => {
                            const newImages = [...content.additionalImages];
                            newImages[index].src = e.target.value;
                            handleContentChange('additionalImages', newImages);
                          }}
                          className="px-2 py-1 bg-transparent border border-white text-white text-sm w-full"
                          placeholder="Image path"
                        />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            const newImages = [...content.additionalImages];
                            newImages[index].alt = e.target.value;
                            handleContentChange('additionalImages', newImages);
                          }}
                          className="px-2 py-1 bg-transparent border border-white text-white text-sm w-full"
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isAuthenticated && (
              <div className="aspect-video flex items-center justify-center bg-gray-800 rounded border border-dashed border-gray-700 cursor-pointer hover:border-b0ase-blue transition-colors">
                <button
                  onClick={() => {
                    const newImages = [...content.additionalImages];
                    newImages.push({
                      src: "/images/projects/placeholder.jpg",
                      alt: "New Image"
                    });
                    handleContentChange('additionalImages', newImages);
                  }}
                  className="text-gray-400 hover:text-white flex flex-col items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/projects/smart-environmental-monitor" className="group">
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-b0ase-blue transition-colors">Smart Environmental Monitor</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">A low-power IoT device for environmental monitoring in industrial settings with wireless connectivity and cloud analytics.</p>
                <div className="flex justify-end">
                  <div className="text-b0ase-blue group-hover:translate-x-2 transition-transform flex items-center">
                    <span className="text-sm mr-1">View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/projects/precision-motor-controller" className="group">
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-b0ase-blue transition-colors">Precision Motor Controller</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">A high-performance motor control system featuring closed-loop feedback, customizable PID parameters, and comprehensive safety features.</p>
                <div className="flex justify-end">
                  <div className="text-b0ase-blue group-hover:translate-x-2 transition-transform flex items-center">
                    <span className="text-sm mr-1">View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            
            <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-white">Start Your Own Project</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">Have a similar project in mind? Reach out to discuss how we can help bring your vision to life with our expertise.</p>
              <div className="mt-auto">
                <Link 
                  href="/newsite#contact"
                  className="border border-gray-700 text-white font-medium px-4 py-2 hover:bg-gray-800 transition w-full flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 