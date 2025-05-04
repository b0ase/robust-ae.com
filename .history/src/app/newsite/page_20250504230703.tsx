import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NewSitePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 text-center py-20 px-6">
        <div className="container mx-auto">
          {/* Add large centered logo */}
          <Image
            src="/images/logos/AE vector-2.png"
            alt="Robust AE Logo - Hero"
            width={300}  // Larger width
            height={100} // Larger height (adjust as needed)
            className="mx-auto mb-8 dark:invert" // Center horizontally, add margin bottom
            priority // Load this logo early
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Robust AE: Engineering Your Vision
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            End-to-end embedded systems development and industrial automation solutions.
            We bring your ideas to life with expert engineering, from concept to production.
          </p>
          {/* Wrap button in Link to scroll to services */}
          <Link href="#services">
            <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-700 transition duration-300">
              Discover More
            </button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-white dark:bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Our Services
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Explore our core capabilities in embedded systems and industrial automation, designed to bring your projects from concept to reality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Embedded Systems Development</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                From initial concept and microcontroller selection to firmware development and testing, we deliver robust and efficient embedded solutions tailored to your specific needs.
              </p>
              <Link href="/services/embedded-systems" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</Link>
            </div>
            {/* Service Card 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Industrial Automation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Enhance your operational efficiency with custom automation solutions, including PLC programming, control system design, and system integration for industrial environments.
              </p>
              <Link href="/services/industrial-automation" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</Link>
            </div>
            {/* Service Card 3 (Extrapolated) */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Prototyping &amp; Production Support</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We bridge the gap from prototype to production, offering support with PCB design, small-batch manufacturing coordination, and design-for-manufacturability (DFM) guidance.
              </p>
              <Link href="/services/prototyping-production" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Learn More &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach/Mission Section */}
      <section id="mission" className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Our Approach
          </h2>
          <h3 className="text-xl text-center text-blue-600 dark:text-blue-400 font-semibold mb-10">
            Engineering Excellence, Practical Solutions
          </h3>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <p>
              Robust AE provides expert engineering services for businesses needing specialized support in embedded systems development and industrial automation. We focus on delivering professional, practical solutions from concept through to production.
            </p>

            <div>
              <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Robust Design</h4>
              <p>
                We engineer solutions built for reliability and performance. By focusing on robust design principles, thorough testing, and efficient implementation, we create systems that meet demanding requirements and provide long-term value.
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Client-Focused Outputs</h4>
              <p>
                We understand the constraints and goals of technical projects. Our process is structured to provide clear, useful deliverables at every stage, whether it&apos;s a functional prototype to secure investment, optimized firmware, or comprehensive system documentation. We tailor our work to achieve your specific objectives efficiently.
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Deep Expertise</h4>
              <p>
                Leveraging extensive hands-on experience across diverse platforms, communication protocols (like Modbus, Profinet), and control systems (including PLCs), we navigate complex technical challenges effectively. Our deep knowledge ensures we select the right technologies and avoid common pitfalls, accelerating your project&apos;s development.
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Dedication & Partnership</h4>
              <p>
                We are passionate about engineering and committed to the success of your project. We operate with transparency and integrate closely with your team, acting as a dedicated partner to overcome challenges and achieve your technical goals. Your success drives our enthusiasm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section id="testimonials" className="py-16 px-6 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Client Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            (Testimonials will be added here soon)
          </p>
          {/* Placeholder for testimonial content */}
          <div className="italic text-gray-700 dark:text-gray-300">
            &quot;Working with Robust AE was a seamless experience...&quot; - Placeholder Client
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Reach out to discuss your project requirements or book a free consultation. Let&apos;s explore how Robust AE can help bring your ideas to life.
            </p>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>George Haworth</strong>
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@robust-ae.com" className="text-blue-600 dark:text-blue-400 hover:underline">info@robust-ae.com</a>
              </p>
              <p>
                <strong>Tel:</strong> <a href="tel:07447544890" className="hover:underline">07447 544 890</a>
              </p>
              {/* Add Address if available/needed */}
              {/* <p>
                <strong>Address:</strong> [Your Address Here]
              </p> */}
               <p className="text-sm mt-4">
                Company number: 11269142
               </p>
            </div>
          </div>

          {/* Contact Form (Frontend Structure Only) */}
          <form className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-4">
             <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Send a Message</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
              <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email Address</label>
              <input type="email" id="email" name="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave us a message...</label>
              <textarea id="message" name="message" rows={4} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300">
                Send Message
              </button>
            </div>
             <p className="text-xs text-center text-gray-500 dark:text-gray-400">Note: Form submission is currently inactive.</p>
          </form>
        </div>
      </section>
    </>
  );
} 