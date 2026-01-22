"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteContent } from '@/data/siteContent';

export default function Home() {
  // Static content state
  const content = siteContent;

  // Hero carousel state
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = Array.from({ length: 10 }, (_, i) => `/hero/${(i + 1).toString().padStart(2, '0')}.jpg`);

  // Smooth scroll function
  const scrollToSection = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();

    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Effect to rotate through hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <div>
        {/* Helper for smooth scroll padding */}
        <style jsx global>{`
          html {
            scroll-behavior: smooth;
          }
        `}</style>

        {/* Navigation Bar (Simple Static) */}
        <nav className="fixed w-full z-50 bg-b0ase-dark bg-opacity-95 text-white shadow-lg backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/images/logos/AE vector-2.png"
                alt="Robust AE Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-b0ase-blue transition">Home</a>
              <a href="#services" onClick={(e) => scrollToSection('services', e)} className="hover:text-b0ase-blue transition">Services</a>
              <a href="#projects" onClick={(e) => scrollToSection('projects', e)} className="hover:text-b0ase-blue transition">Projects</a>
              <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="hover:text-b0ase-blue transition">Contact</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-b0ase-dark text-center py-24 px-4 md:py-32 md:px-6 border-b border-b0ase-card-border pt-32">
          <div className="container mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-64 md:h-96 mx-auto mb-8 overflow-hidden rounded shadow-2xl border border-gray-800">
              {heroImages.map((image, idx) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentHeroImage ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`Robust AE Hero Image ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}

              {/* Logo overlay on carousel */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <Image
                  src="/images/logos/AE vector-2.png"
                  alt="Robust AE Logo"
                  width={300}
                  height={100}
                  className="z-10 drop-shadow-xl"
                  priority
                />
              </div>

              {/* Navigation dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroImage(idx)}
                    className={`h-2 w-2 rounded-full transition-all shadow-sm ${idx === currentHeroImage ? 'bg-b0ase-blue w-6' : 'bg-gray-400 bg-opacity-70'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white font-mono tracking-tight mt-12">
              {content.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="#services"
                onClick={(e) => scrollToSection('services', e)}
                className="bg-b0ase-blue text-white font-semibold py-3 px-8 rounded hover:bg-opacity-90 transition duration-300 text-center shadow-lg hover:shadow-b0ase-blue/20"
              >
                Our Services
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection('contact', e)}
                className="bg-transparent border border-b0ase-blue text-b0ase-blue font-semibold py-3 px-8 rounded hover:bg-b0ase-blue hover:text-white transition duration-300 text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 bg-black">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{content.services.introTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                {content.services.introText}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.services.cards.map((service, index) => (
                <div key={index} className="bg-b0ase-card p-6 md:p-8 rounded-lg border border-b0ase-card-border hover:border-b0ase-blue transition duration-300 flex flex-col h-full group">
                  <div className="h-14 w-14 bg-b0ase-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-6 text-b0ase-blue group-hover:bg-b0ase-blue group-hover:text-white transition-colors duration-300">
                    {index === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow leading-relaxed">{service.description}</p>
                  {/* Placeholder for service links if they existed */}
                  <span className="text-b0ase-blue font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Learn more &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 bg-b0ase-dark border-y border-b0ase-card-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="text-b0ase-blue font-bold tracking-wider uppercase text-sm mb-2 opacity-80">{content.mission.mainTitle}</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                  {content.mission.subTitle}
                </h3>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed border-l-4 border-b0ase-blue pl-4 bg-gray-900/30 py-2 rounded-r">
                  {content.mission.introParagraph}
                </p>
                <div className="space-y-6">
                  {content.mission.points.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <div className="shrink-0 h-6 w-6 mt-1 mr-4 rounded-full bg-b0ase-blue flex items-center justify-center shadow-lg">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{point.title}</h4>
                        <p className="text-gray-400 mt-1 leading-relaxed">{point.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl skew-y-1 transform transition hover:skew-y-0 duration-500">
                  {/* Reuse hero image for mission visual if no specific one */}
                  <Image
                    src="/hero/02.jpg"
                    alt="Robust AE Technology"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-mono text-xs opacity-70">SYSTEM_STATUS: OPERATIONAL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Certifications Section */}
        <section id="skills" className="py-20 px-6 bg-black">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">Technical Architecture</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Hardware Skills */}
              <div className="bg-b0ase-card p-6 rounded-xl border border-b0ase-card-border hover:shadow-xl hover:shadow-b0ase-blue/5 transition duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-900/30 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Hardware</h3>
                </div>
                <ul className="space-y-3">
                  {content.skills.hardware.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Software Skills */}
              <div className="bg-b0ase-card p-6 rounded-xl border border-b0ase-card-border hover:shadow-xl hover:shadow-b0ase-blue/5 transition duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-900/30 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Software</h3>
                </div>
                <ul className="space-y-3">
                  {content.skills.software.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools Skills */}
              <div className="bg-b0ase-card p-6 rounded-xl border border-b0ase-card-border hover:shadow-xl hover:shadow-b0ase-blue/5 transition duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-900/30 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Tools</h3>
                </div>
                <ul className="space-y-3">
                  {content.skills.tools.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold mb-8 text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Certifications & Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.skills.certifications.map((cert, index) => (
                  <div key={index} className="flex flex-col bg-black/40 p-4 rounded-lg border border-gray-800">
                    <h4 className="font-bold text-white mb-1">{cert.organization}</h4>
                    <p className="text-gray-300 text-sm mb-2">{cert.title}</p>
                    <span className="text-xs font-mono text-gray-500 mt-auto">{cert.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6 bg-b0ase-dark border-t border-b border-b0ase-card-border">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center mb-16">
              <div className="w-2 h-10 bg-b0ase-blue mr-6 rounded-full"></div>
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Featured Projects</h2>
                <p className="text-gray-400 mt-2">Delivering excellence across industries</p>
              </div>
            </div>

            <div className="space-y-16">
              {content.projects.items.map((project, index) => (
                <div key={index} className="group bg-b0ase-card rounded-2xl border border-b0ase-card-border overflow-hidden hover:shadow-2xl hover:shadow-b0ase-blue/10 transition duration-500">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                      <Image
                        src={project.imageSrc || `/images/projects/placeholder.jpg`}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500"></div>
                    </div>
                    <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-b0ase-blue transition duration-300">{project.title}</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-white bg-b0ase-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors w-fit shadow-lg shadow-b0ase-blue/20">
                        View Case Study
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-6 bg-white dark:bg-black">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Client Testimonials
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              We take pride in building long-lasting relationships with our partners. Here&apos;s what they have to say.
            </p>

            {/* Testimonials Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {content.testimonials.items.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl flex flex-col text-left relative">
                  <svg className="absolute top-6 left-6 h-10 w-10 text-gray-200 dark:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01691 21L5.01691 18C5.01691 16.8954 5.91234 16 7.01691 16H10.0169C10.5692 16 11.0169 15.5523 11.0169 15V9C11.0169 8.44772 10.5692 8 10.0169 8H6.01691C5.46462 8 5.01691 8.44772 5.01691 9V11C5.01691 11.5523 4.56919 12 4.01691 12H3.01691V5H13.0169V15C13.0169 18.3137 10.3306 21 7.01691 21H5.01691Z" />
                  </svg>
                  <p className="text-gray-800 dark:text-gray-200 mb-8 mt-6 italic leading-relaxed relative z-10">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-auto flex items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                    {testimonial.imageSrc ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-gray-100 dark:ring-gray-800">
                        <Image
                          src={testimonial.imageSrc}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center bg-b0ase-blue bg-opacity-20 text-b0ase-blue font-bold">
                        {testimonial.initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.position}, <span className="text-b0ase-blue">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Logos Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-16">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Trusted by industry leaders</h3>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
                {content.testimonials.clients.map((client, index) => (
                  <div key={index} className="w-32 h-16 relative grayscale hover:grayscale-0 transition duration-500 flex items-center justify-center">
                    {client.logoSrc ? (
                      <Image
                        src={client.logoSrc}
                        alt={client.name}
                        width={120}
                        height={60}
                        className="object-contain max-h-12"
                      />
                    ) : (
                      <span className="text-sm font-bold">{client.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 md:px-6 bg-black relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-b0ase-blue rounded-full filter blur-[128px] opacity-10 pointer-events-none"></div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Start Your Project</h2>
              <p className="text-gray-400 text-lg">{content.contact.text}</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-gray-800 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-2xl font-bold mb-8 text-white">Contact Information</h4>
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="bg-b0ase-blue/10 p-3 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.89 1.316l.834 2.503a2 2 0 01-.45 2.005l-1.562 1.562a16.06 16.06 0 006.586 6.586l1.562-1.562a2 2 0 012.005-.45l2.503.834A2 2 0 0119 17.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.28z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</p>
                        <a href="tel:07447544890" className="text-white text-lg hover:text-b0ase-blue transition-colors">07447 544 890</a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-b0ase-blue/10 p-3 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Email</p>
                        <a href="mailto:info@robust-ae.com" className="text-white text-lg hover:text-b0ase-blue transition-colors">info@robust-ae.com</a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex space-x-4">
                    {/* Social icons placeholders */}
                  </div>

                  {content.contact.cvUrl && (
                    <div className="mt-8">
                      <a
                        href={content.contact.cvUrl}
                        download
                        className="inline-flex items-center text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded transition-colors text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l2.828 2.828a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                        </svg>
                        Download George's CV
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-6 text-white">Send Message</h4>
                  <form className="space-y-4" id="feedback-form">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-b0ase-blue focus:ring-1 focus:ring-b0ase-blue focus:outline-none text-white transition-colors"
                        name="name"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-b0ase-blue focus:ring-1 focus:ring-b0ase-blue focus:outline-none text-white transition-colors"
                        name="email"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="How can we help?"
                        rows={4}
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-b0ase-blue focus:ring-1 focus:ring-b0ase-blue focus:outline-none text-white resize-none transition-colors"
                        name="message"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-b0ase-blue text-white px-6 py-3 font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-b0ase-blue/20"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-12 px-6 border-t border-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-6 md:mb-0">
                <Image
                  src="/images/logos/AE vector-2.png"
                  alt="Robust AE Logo"
                  width={180}
                  height={60}
                  className="h-12 w-auto opacity-80 hover:opacity-100 transition"
                />
                <p className="text-gray-500 text-sm mt-3 max-w-xs">Engineered for durability. Designed for performance.</p>
              </div>

              <div className="flex gap-8">
                <div className="text-center md:text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Accreditations</p>
                  <div className="flex gap-4 items-center justify-center md:justify-end">
                    <span className="text-gray-600 text-sm font-bold">NAPIT #60482</span>
                    <span className="text-gray-600 text-sm font-bold">IET #1100789092</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Robust AE Ltd. Company No: 11269142. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-white text-sm transition">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-white text-sm transition">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
