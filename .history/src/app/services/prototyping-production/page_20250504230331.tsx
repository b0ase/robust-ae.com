import React from 'react';
import Link from 'next/link';

export default function PrototypingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/newsite#services" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Services</Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Prototyping &amp; Production Support</h1>
      <p className="text-lg text-gray-700">
        We bridge the gap from prototype to production, offering support with PCB design, small-batch manufacturing coordination, and design-for-manufacturability (DFM) guidance.
      </p>
      {/* Add more details about this service here */}
    </div>
  );
} 