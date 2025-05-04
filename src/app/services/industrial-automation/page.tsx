import React from 'react';
import Link from 'next/link';

export default function IndustrialAutomationPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/newsite#services" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Services</Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Industrial Automation</h1>
      <p className="text-lg text-gray-700">
        Enhance your operational efficiency with custom automation solutions, including PLC programming, control system design, and system integration for industrial environments.
      </p>
      {/* Add more details about this service here */}
    </div>
  );
} 