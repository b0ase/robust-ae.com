import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NewSitePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header Section (Placeholder) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div>
            <Link href="/">
              {/* Use your main AE logo here */}
              <Image src="/images/logos/AE vector-2.png" alt="Robust AE Logo" width={150} height={50} />
            </Link>
          </div>
          <div className="space-x-4">
            {/* Placeholder Nav Links */}
            <Link href="#services" className="hover:text-blue-600">Services</Link>
            <Link href="#contact" className="hover:text-blue-600">Contact</Link>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Home</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 text-center py-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Robust AE: Engineering Your Vision
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            End-to-end embedded systems development and industrial automation solutions.
            We bring your ideas to life with expert engineering, from concept to production.
          </p>
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-700 transition duration-300">
            Discover More
          </button>
        </div>
      </section>

      {/* Placeholder for other sections */}
      <div className="container mx-auto px-4 py-8">
         <p>Other sections (Services, Contact, etc.) will be added here.</p>
      </div>

       {/* Footer Section (Placeholder) */}
       <footer className="bg-gray-800 text-white py-8 mt-16">
         <div className="container mx-auto text-center">
           <p>© {new Date().getFullYear()} Robust AE. All rights reserved.</p>
           {/* Add footer links if needed */}
         </div>
       </footer>
    </div>
  );
} 