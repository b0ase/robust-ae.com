"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteContent } from '@/data/siteContent';

export default function SmartEnvironmentalMonitorPage() {
    const PROJECT_PAGE_IDENTIFIER = "Smart Environmental Monitor";
    const project = siteContent.projects.items.find(p => p.title === PROJECT_PAGE_IDENTIFIER);

    if (!project) {
        return <div className="min-h-screen bg-b0ase-dark flex items-center justify-center"><div className="text-white">Project Not Found</div></div>;
    }

    return (
        <div className="bg-b0ase-dark text-gray-300 min-h-screen">
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-8">
                    <Link href="/#projects" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to All Projects
                    </Link>
                </div>

                <div className="mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{project.title}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                            {project.imageSrc ? (
                                <Image src={project.imageSrc} alt={project.title} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 66vw" priority />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                            )}
                        </div>

                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Project Summary</h2>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{project.description}</p>
                        </div>

                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">The Challenge</h2>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{project.challenge}</p>
                        </div>

                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Our Solution</h2>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{project.solution}</p>
                        </div>

                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Results & Impact</h2>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{project.results}</p>
                        </div>
                    </div>

                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Technologies Used</h2>
                            <ul className="space-y-2">
                                {project.technologies.map((tech, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span>{tech}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {project.testimonial && (
                            <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Client Testimonial</h2>
                                <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                                    <blockquote className="text-gray-300">
                                        <p className="italic mb-3 leading-relaxed">&quot;{project.testimonial.quote}&quot;</p>
                                        <footer className="text-gray-400 text-sm text-right">
                                            — <cite className="font-medium text-white not-italic">{project.testimonial.name}</cite>, {project.testimonial.position}, {project.testimonial.company}
                                        </footer>
                                    </blockquote>
                                </div>
                            </div>
                        )}

                        <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-3">Start Your Project</h2>
                            <p className="text-sm text-gray-400 mb-5 leading-relaxed">Need a custom monitoring solution for your industrial environment? Contact us to discuss your needs and learn how our expertise can help you.</p>
                            <Link href="/#contact" className="block w-full bg-b0ase-blue text-white font-medium px-6 py-3 text-center hover:bg-blue-700 transition rounded-md">
                                Discuss Your Project
                            </Link>
                        </div>
                    </aside>
                </div>

                <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border shadow-md mt-8 xl:mt-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">Additional Project Images</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {project.additionalImages?.map((image, index) => (
                            <div key={index} className="relative aspect-[16/9] rounded-md overflow-hidden bg-gray-800 group">
                                {image.src ? (
                                    <Image src={image.src} alt={image.alt || `Additional image ${index + 1}`} fill className="object-cover" sizes="(max-width: 639px) 100vw, 50vw" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No image</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
