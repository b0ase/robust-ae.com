import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
       <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Area</h1>
       <p className="text-lg text-gray-700 mb-8">
         This area requires authentication.
       </p>
       {/* Add Login Form or Content for authenticated users here */}
       <Link href="/newsite" className="text-blue-600 hover:underline">&larr; Back to Site</Link>
    </div>
  );
} 