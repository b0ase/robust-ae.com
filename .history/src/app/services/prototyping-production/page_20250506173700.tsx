import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrototypingPage() {
  return (
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      <main className="container mx-auto px-4 py-16 md:py-20">
        <Link href="/services" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Services
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 mr-4 relative">
                <div className="absolute inset-0 bg-b0ase-blue opacity-20 rounded"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-b0ase-blue rounded-l"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Prototyping & Production Support</h1>
            </div>
            
            <p className="text-lg text-gray-300 mb-8">
              We bridge the gap from prototype to production, offering support with PCB design, small-batch manufacturing coordination, and design-for-manufacturability (DFM) guidance.
            </p>
            
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Our Prototyping & Production Services</h2>
                <p className="mb-4">
                  Turning your hardware concept into a manufacturing-ready design requires expertise in both engineering and production processes. We provide end-to-end support from initial prototype to final production, ensuring your product is both functional and manufacturable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Prototyping</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Rapid prototyping services</li>
                      <li>Proof-of-concept development</li>
                      <li>Functional prototype creation</li>
                      <li>3D printing and modeling</li>
                      <li>Prototype testing and validation</li>
                    </ul>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Production Support</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Design for Manufacturability (DFM)</li>
                      <li>PCB design optimization</li>
                      <li>Manufacturing documentation</li>
                      <li>Component sourcing assistance</li>
                      <li>Small-batch production coordination</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">From Concept to Production</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Concept Validation</h3>
                      <p className="text-gray-300">
                        We help refine your initial idea and verify its technical feasibility through analysis and early prototyping.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Functional Prototype</h3>
                      <p className="text-gray-300">
                        We develop working prototypes that demonstrate core functionality and allow for user testing and feedback.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Engineering Prototype</h3>
                      <p className="text-gray-300">
                        We refine the design to address technical challenges and ensure performance, reliability, and quality.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Production-Ready Design</h3>
                      <p className="text-gray-300">
                        We optimize the design for manufacturing, ensuring it can be produced efficiently and economically.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Manufacturing Support</h3>
                      <p className="text-gray-300">
                        We provide guidance during the production process, addressing issues and ensuring quality control.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Key Benefits</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Reduced Time-to-Market</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Accelerate product development with efficient prototyping and seamless transition to production.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Minimized Production Costs</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Optimize designs for manufacturing efficiency and identify cost-saving opportunities early in the process.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Enhanced Quality</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Rigorous testing and design reviews identify and resolve issues before they reach production.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Flexible Scaling</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Designs that can scale from small production runs to higher volumes as your product demand grows.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Technical Capabilities</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-white mb-1">PCB Design</h3>
                  <p className="text-sm text-gray-400">Multi-layer designs, RF, high-speed digital, mixed-signal</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Mechanical Design</h3>
                  <p className="text-sm text-gray-400">3D modeling, enclosures, structural analysis</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Prototyping Methods</h3>
                  <p className="text-sm text-gray-400">3D printing, CNC machining, laser cutting</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Production Support</h3>
                  <p className="text-sm text-gray-400">DFM, DFA, BOM management, vendor liaison</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Testing</h3>
                  <p className="text-sm text-gray-400">Functional testing, environmental testing, compliance</p>
                </div>
              </div>
            </div>
            
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Who We Work With</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Startups moving from concept to production</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Established companies launching new products</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Inventors and entrepreneurs with hardware ideas</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Companies requiring design revisions for cost reduction</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Start Your Project</h2>
              <p className="text-sm text-gray-300 mb-4">
                Ready to move your hardware concept forward? Contact us to discuss your project needs and how we can help bridge the gap from prototype to production.
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
      </main>
    </div>
  );
} 