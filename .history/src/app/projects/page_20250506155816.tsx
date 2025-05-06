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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: fullDataWrapper, error: fetchError } = await supabase
        .from('robust_ae_content')
        .select('data')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
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
      setError("Failed to load project data. Please try again later.");
      setProjects([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate slugs
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'); // Basic slug generation
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-b0ase-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b0ase-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-b0ase-dark flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h1>
          <p className="text-gray-400">{error}</p>
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

  return (
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
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
  );
} 