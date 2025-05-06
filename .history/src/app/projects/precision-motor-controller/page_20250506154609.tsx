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

export default function PrecisionMotorControllerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await fetch('/api/content?section=projectPrecisionMotor');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // If no content is stored, use default
        setContent({
          title: "Precision Motor Controller",
          summary: "A high-performance motor control system with closed-loop feedback. Features customizable PID parameters, torque and position control, and comprehensive safety features for industrial applications.",
          challenge: "A medical device manufacturer needed a precision motor control system for their next-generation surgical robot. The application required extremely precise positioning (sub-micron), real-time response to feedback, and absolute reliability. Additionally, the controller needed to fit within strict size constraints while meeting medical safety standards.",
          solution: "We designed a precision motor control system based on the STM32 microcontroller platform implementing Field-Oriented Control (FOC) algorithms for optimal motor performance. The system features a custom PCB with integrated power electronics, closed-loop control with multiple feedback sources (position encoders, current sensors, temperature monitoring), and a comprehensive safety monitoring system. A CAN interface allows seamless integration with the client's existing equipment.",
          results: "The controller exceeded performance requirements, achieving positioning accuracy of 0.5 microns with smooth motion profiles. Power efficiency improved by 35% compared to the previous generation, reducing heat generation and extending operational time. The robust design passed all medical safety certification tests on the first submission. The client has incorporated our controller into their flagship surgical robot, with plans to extend its use across their product line.",
          technologies: ["STM32", "FOC Algorithm", "Real-time Control", "CAN Interface", "Custom Power Electronics", "Motor Drive Circuitry", "Embedded Safety Systems"],
          imageSrc: "/images/projects/precision-motor-controller-main.jpg",
          additionalImages: [
            {
              src: "/images/projects/motor-controller-1.jpg",
              alt: "Controller PCB with power electronics"
            },
            {
              src: "/images/projects/motor-controller-2.jpg",
              alt: "Motor control system integration"
            },
            {
              src: "/images/projects/motor-controller-3.jpg",
              alt: "Precision positioning test setup"
            }
          ],
          testimonial: {
            quote: "The precision motor controller developed by Robust AE has been a game-changer for our surgical robotics platform. The positioning accuracy and real-time response they achieved allow our robots to perform delicate procedures with unprecedented precision. Their engineering team's attention to detail and commitment to quality has made them a trusted partner in our development process.",
            name: "Dr. James Rodriguez",
            position: "Head of R&D",
            company: "MediRobotics"
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
  ) => {
    setContent(prev => {
      if (!prev) return null;
      
      // Create a copy of the previous state
      const newContent = { ...prev };
      
      // Update the field with the new value
      newContent[field] = value;
      
      return newContent;
    });
  };

  const handleNestedContentChange = (
    field: keyof ProjectContent,
    nestedField: string,
    value: any
  ) => {
    setContent(prev => {
      if (!prev) return null;
      
      // Create a copy of the previous state
      const newContent = { ...prev };
      
      // Handle testimonial updates
      if (field === 'testimonial' && prev.testimonial) {
        newContent.testimonial = {
          ...prev.testimonial,
          [nestedField]: value
        };
      }
      // Handle other object fields
      else if (typeof prev[field] === 'object' && prev[field] !== null) {
        // @ts-ignore - we know this is an object that can be indexed
        newContent[field] = {
          // @ts-ignore - same as above
          ...prev[field],
          [nestedField]: value
        };
      }
      
      return newContent;
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
          section: 'projectPrecisionMotor',
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
      // Use the correct hardcoded password
      if (password === 'George123') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setError('');
        setIsAuthModalOpen(false);
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
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex justify-between items-center mb-8">
          <Link href="/newsite#projects" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>
          
          {isAuthenticated && (
            <div className="flex space-x-4">
              <button
                onClick={saveContent}
                className="bg-b0ase-blue text-white px-4 py-2 text-sm hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={handleLogout}
                className="border border-gray-700 text-white px-4 py-2 text-sm hover:bg-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
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
                      value={content.technologies ? content.technologies.join(', ') : ''}
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
                        onChange={(e) => handleNestedContentChange('testimonial', 'quote', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded resize-none mb-2"
                      />
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={content.testimonial.name}
                          onChange={(e) => handleNestedContentChange('testimonial', 'name', e.target.value)}
                          placeholder="Name"
                          className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                        />
                        <input
                          type="text"
                          value={content.testimonial.position}
                          onChange={(e) => handleNestedContentChange('testimonial', 'position', e.target.value)}
                          placeholder="Position"
                          className="w-full px-3 py-2 border text-gray-300 border-gray-700 focus:border-b0ase-blue bg-transparent focus:outline-none transition rounded"
                        />
                        <input
                          type="text"
                          value={content.testimonial.company}
                          onChange={(e) => handleNestedContentChange('testimonial', 'company', e.target.value)}
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
                Need a high-performance motor control solution for your robotics or automation project? Contact us to discuss how we can create a custom solution for your specific requirements.
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
            <Link href="/projects/industrial-control-system" className="group">
              <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-b0ase-blue transition-colors">Industrial Control System</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">A comprehensive control system for manufacturing equipment with real-time monitoring and predictive maintenance.</p>
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
            
            <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-white">Start Your Own Project</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">Have a complex motor control or robotics challenge? Let's discuss how our expertise in precision control systems can help.</p>
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
      </main>
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-60 py-3 px-4 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            {/* Existing content */}
          </div>
        </div>
      )}
    </div>
  );
} 