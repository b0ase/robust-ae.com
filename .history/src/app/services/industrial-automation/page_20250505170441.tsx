import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function IndustrialAutomationPage() {
  return (
    <div className="bg-b0ase-dark text-gray-300 min-h-screen">
      <main className="container mx-auto px-4 py-16 md:py-20">
        <Link href="/newsite#services" className="border border-gray-700 text-white text-sm px-4 py-2 hover:bg-gray-800 transition inline-flex items-center mb-8">
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
              <h1 className="text-3xl md:text-4xl font-bold text-white">Industrial Automation</h1>
            </div>
            
            <p className="text-lg text-gray-300 mb-8">
              Enhance your operational efficiency with custom automation solutions, including PLC programming, control system design, and system integration for industrial environments.
            </p>
            
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Industrial Automation Solutions</h2>
                <p className="mb-4">
                  We provide comprehensive industrial automation services designed to improve productivity, quality, and safety in manufacturing and industrial processes. Our solutions are scalable and can be tailored to businesses of all sizes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Control Systems</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>PLC programming and configuration</li>
                      <li>HMI design and implementation</li>
                      <li>SCADA system development</li>
                      <li>Motion control systems</li>
                      <li>Custom control panels</li>
                    </ul>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Process Automation</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Automated production lines</li>
                      <li>Process monitoring and control</li>
                      <li>Data acquisition systems</li>
                      <li>Quality control automation</li>
                      <li>Energy management systems</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Our Approach to Industrial Automation</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Process Analysis</h3>
                      <p className="text-gray-300">
                        We begin by understanding your current processes, identifying bottlenecks, and determining opportunities for automation and optimization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Solution Design</h3>
                      <p className="text-gray-300">
                        We design customized automation solutions that integrate seamlessly with your existing equipment and meet your specific requirements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Implementation</h3>
                      <p className="text-gray-300">
                        Our team handles hardware installation, software programming, and system integration with minimal disruption to your operations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Testing & Validation</h3>
                      <p className="text-gray-300">
                        Thorough testing ensures all components work together correctly and meet safety and performance standards.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Training & Support</h3>
                      <p className="text-gray-300">
                        We provide comprehensive training for your staff and ongoing technical support to ensure smooth operation.
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
                      <h3 className="text-lg font-semibold text-white">Increased Productivity</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Automated systems can operate continuously with consistent performance, reducing cycle times and increasing throughput.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Cost Efficiency</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Reduce labor costs, minimize waste, optimize energy use, and extend equipment lifespan through precise control.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Improved Safety</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Reduce workplace accidents by automating dangerous tasks and implementing safety monitoring systems.
                    </p>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-b0ase-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">Data-Driven Insights</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Gather real-time data from your production processes to enable informed decision-making and continuous improvement.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Industry Applications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Manufacturing</h3>
                    <p className="text-sm text-gray-400">Assembly lines, CNC integration, robotic cells</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Food & Beverage</h3>
                    <p className="text-sm text-gray-400">Processing, packaging, recipe management</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Pharmaceutical</h3>
                    <p className="text-sm text-gray-400">Batch control, compliance, traceability</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Energy & Utilities</h3>
                    <p className="text-sm text-gray-400">Monitoring, distribution, renewable systems</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Water Treatment</h3>
                    <p className="text-sm text-gray-400">Process control, remote monitoring</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Material Handling</h3>
                    <p className="text-sm text-gray-400">Conveyor systems, sorting, warehousing</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Technologies</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-white mb-1">PLC Platforms</h3>
                  <p className="text-sm text-gray-400">Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">HMI/SCADA</h3>
                  <p className="text-sm text-gray-400">Ignition, WinCC, FactoryTalk, Citect, Wonderware</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Industrial Networks</h3>
                  <p className="text-sm text-gray-400">Profinet, EtherNet/IP, Modbus, Profibus, OPC UA</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">IIoT</h3>
                  <p className="text-sm text-gray-400">MQTT, cloud integration, edge computing</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Safety Systems</h3>
                  <p className="text-sm text-gray-400">Safety PLCs, fail-safe design, risk assessment</p>
                </div>
              </div>
            </div>
            
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Upgrade Path</h2>
              <p className="text-sm text-gray-300 mb-4">
                Whether you're looking to modernize legacy systems or implement new automation, we offer a flexible approach:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Phased implementations to minimize downtime</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Migration strategies for legacy systems</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Scalable solutions that grow with your business</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Get Started</h2>
              <p className="text-sm text-gray-300 mb-4">
                Ready to improve your operations with industrial automation? Contact us for a consultation and discover how we can help optimize your processes.
              </p>
              
              <div className="mt-6 pt-2">
                <Link 
                  href="/newsite#contact"
                  className="border border-gray-700 text-white font-medium px-4 py-2 hover:bg-gray-800 transition w-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Request a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 