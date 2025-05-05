import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EmbeddedSystemsPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-white">Embedded Systems Development</h1>
            </div>
            
            <p className="text-lg text-gray-300 mb-8">
              From initial concept and microcontroller selection to firmware development and testing, we deliver robust and efficient embedded solutions tailored to your specific needs.
            </p>
            
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Our Embedded Systems Expertise</h2>
                <p className="mb-4">
                  Our embedded systems development services provide comprehensive solutions for products requiring dedicated computing hardware. We specialize in creating reliable, optimized systems that balance performance, power consumption, and cost-effectiveness.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Hardware Design</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Microcontroller/microprocessor selection</li>
                      <li>Circuit design and schematic capture</li>
                      <li>PCB layout and design for manufacture</li>
                      <li>Power management solutions</li>
                      <li>Sensor integration and conditioning</li>
                    </ul>
                  </div>
                  
                  <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
                    <h3 className="text-xl font-semibold mb-3 text-b0ase-blue">Firmware Development</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Bare-metal programming</li>
                      <li>RTOS implementation</li>
                      <li>Driver development</li>
                      <li>Communication protocols (I2C, SPI, UART, CAN)</li>
                      <li>Low-power design techniques</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Embedded Systems Development Process</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Requirements Analysis</h3>
                      <p className="text-gray-300">
                        We work closely with you to understand your product's requirements, constraints, and performance targets.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Architecture & Design</h3>
                      <p className="text-gray-300">
                        Our team creates the system architecture, selects appropriate components, and designs hardware and software interfaces.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Prototype Development</h3>
                      <p className="text-gray-300">
                        We develop initial hardware and firmware prototypes to validate concepts and test functionality.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Testing & Refinement</h3>
                      <p className="text-gray-300">
                        Rigorous testing ensures your system meets all requirements and functions reliably under various conditions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-b0ase-blue bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-b0ase-blue font-semibold">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">Production Support</h3>
                      <p className="text-gray-300">
                        We provide documentation, manufacturing guidance, and ongoing support as your product transitions to production.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-b0ase-card-border pb-2">Application Areas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">IoT Devices</h3>
                    <p className="text-sm text-gray-400">Connected sensors and smart devices</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Industrial Controls</h3>
                    <p className="text-sm text-gray-400">Automation and monitoring systems</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Consumer Products</h3>
                    <p className="text-sm text-gray-400">Smart home and personal devices</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Medical Devices</h3>
                    <p className="text-sm text-gray-400">Health monitoring and diagnostic equipment</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Automotive Systems</h3>
                    <p className="text-sm text-gray-400">Vehicle control and infotainment</p>
                  </div>
                  
                  <div className="bg-b0ase-card p-4 rounded-lg border border-b0ase-card-border text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">Energy Management</h3>
                    <p className="text-sm text-gray-400">Smart metering and monitoring</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          {/* Sidebar with case studies, technologies, etc. */}
          <div className="md:col-span-1">
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Technologies</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-white mb-1">Microcontrollers</h3>
                  <p className="text-sm text-gray-400">ARM Cortex-M, ESP32, STM32, PIC, AVR</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Communication</h3>
                  <p className="text-sm text-gray-400">Wi-Fi, Bluetooth, LoRa, Zigbee, Cellular</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Programming</h3>
                  <p className="text-sm text-gray-400">C, C++, Python, Embedded Rust</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">RTOS</h3>
                  <p className="text-sm text-gray-400">FreeRTOS, Zephyr, MicroPython, TinyGo</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Tools</h3>
                  <p className="text-sm text-gray-400">KiCad, Altium, EAGLE, IAR, Keil, PlatformIO</p>
                </div>
              </div>
            </div>
            
            <div className="bg-b0ase-card p-5 rounded-lg border border-b0ase-card-border">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Why Choose Us</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Experienced team with diverse project portfolio</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Focus on sustainable, repairable designs</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Optimized for performance, power, and cost</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Clear communication throughout the process</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-b0ase-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Comprehensive documentation and support</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link 
                  href="/newsite#contact"
                  className="border border-gray-700 text-white font-medium px-4 py-2 hover:bg-gray-800 transition w-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 