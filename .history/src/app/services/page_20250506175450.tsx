import React from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      <main className="container mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Our Services</h1>
        
        <p className="text-lg text-gray-400 mb-6">
          Welcome to the Robust AE services page. Here you can find an overview of the solutions we offer.
        </p>

        {/* Placeholder for content - to be discussed with the user */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example of how to link to individual service pages */}
          <Link href="/services/embedded-systems" className="block bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border hover:border-b0ase-blue transition-all">
            <h2 className="text-xl font-semibold text-b0ase-blue mb-3">Embedded Systems</h2>
            <p className="text-gray-400 text-sm">From initial concept and microcontroller selection to firmware development and testing, we deliver robust and efficient embedded solutions tailored to your specific needs.</p>
          </Link>
          
          <Link href="/services/industrial-automation" className="block bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border hover:border-b0ase-blue transition-all">
            <h2 className="text-xl font-semibold text-b0ase-blue mb-3">Industrial Automation</h2>
            <p className="text-gray-400 text-sm">Enhance your operational efficiency with custom automation solutions, including PLC programming, control system design, and system integration for industrial environments.</p>
          </Link>

          <Link href="/services/prototyping-production" className="block bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border hover:border-b0ase-blue transition-all">
            <h2 className="text-xl font-semibold text-b0ase-blue mb-3">Prototyping & Production</h2>
            <p className="text-gray-400 text-sm">We bridge the gap from prototype to production, offering support with PCB design, small-batch manufacturing coordination, and design-for-manufacturability (DFM) guidance.</p>
          </Link>
        </div>

        <div className="mt-12">
          <Link href="/" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
} 