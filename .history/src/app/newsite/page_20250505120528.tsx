import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

// Define the type for the content structure (matching the one in admin page)
interface ContentData {
  hero: { title: string; subtitle: string };
  services: {
    introTitle: string;
    introText: string;
    cards: { title: string; description: string }[];
  };
  mission: {
    mainTitle: string;
    subTitle: string;
    introParagraph: string;
    points: { title: string; text: string }[];
  };
  contact: { title: string; text: string };
}

// Function to fetch content data
async function getContent(): Promise<ContentData | null> {
    const contentFilePath = path.join(process.cwd(), 'data', 'content.json');
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        const data = JSON.parse(fileContent) as ContentData;
        return data;
    } catch (error) {
        console.error("Failed to load content for /newsite:", error);
        // Return null or default content in case of error
        return null; 
    }
}

// Make page component async to fetch data
export default async function NewSitePage() {
    const content = await getContent();

    // Handle case where content fails to load
    if (!content) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-600">Error Loading Content</h1>
                <p>The website content could not be loaded. Please try again later.</p>
            </div>
        );
    }

  return (
    <>
      {/* Hero Section - Use fetched content */}
      <section className="bg-gray-100 dark:bg-gray-900 text-center py-20 px-6">
        <div className="container mx-auto">
          <Image
            src="/images/logos/AE vector-2.png"
            alt="Robust AE Logo - Hero"
            width={300}
            height={100}
            className="mx-auto mb-8 dark:invert"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {content.hero.subtitle}
          </p>
          <Link href="#services">
            <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-700 transition duration-300">
              Discover More
            </button>
          </Link>
        </div>
      </section>

      {/* Services Section - Use fetched content */}
      <section id="services" className="py-16 px-6 bg-white dark:bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {content.services.introTitle}
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {content.services.introText}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.cards.map((card, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">{card.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {card.description}
                </p>
                <Link 
                  href={index === 0 ? "/services/embedded-systems" : index === 1 ? "/services/industrial-automation" : "/services/prototyping-production"}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                    Learn More &rarr;
                </Link>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach/Mission Section - Use fetched content */}
      <section id="mission" className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {content.mission.mainTitle}
          </h2>
          <h3 className="text-xl text-center text-blue-600 dark:text-blue-400 font-semibold mb-10">
            {content.mission.subTitle}
          </h3>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <p className="whitespace-pre-line">
              {content.mission.introParagraph}
            </p>
            {content.mission.points.map((point, index) => (
                 <div key={index}>
                    <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{point.title}</h4>
                    <p className="whitespace-pre-line">
                    {point.text}
                    </p>
                 </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder - remains static) */}
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

      {/* Contact Section - Use fetched content for intro */}
      <section id="contact" className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {content.contact.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
              {content.contact.text}
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
               <p>
                 <a
                   href="/images/logos/George_Haworth_CV_23042025.pdf"
                   download
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                 >
                   Download CV &rarr;
                 </a>
               </p>
            </div>
          </div>

          {/* Contact Form (Frontend Structure Only - remains static) */}
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

      {/* Company Info/Logos Section (remains static) */}
      <section id="company-info" className="py-16 px-6 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl text-center border-t dark:border-gray-700 pt-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Company &amp; Accreditations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Company Number: 11269142
          </p>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {/* NAPIT Logo & Info */}
            <div className="text-center">
              <Image
                src="/images/logos/napit-logo.png"
                alt="NAPIT Logo"
                width={120} // Adjust size as needed
                height={60}
                className="mx-auto object-contain mb-2"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Membership: 60482</p>
            </div>
            {/* IET Logo & Info */}
            <div className="text-center">
               <Image
                 src="/images/logos/iet-logo.jpg"
                 alt="IET Logo"
                 width={120} // Adjust size as needed
                 height={60}
                 className="mx-auto object-contain mb-2"
               />
               <p className="text-xs text-gray-500 dark:text-gray-400">Membership: 1100789092</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
} 