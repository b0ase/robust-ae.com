"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  
  // Redirect after a short delay to allow message to be read
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/newsite');
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Access Updated</h1>
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
          <p className="font-bold">The admin interface has been improved!</p>
          <p className="block sm:inline mt-2">
            You can now edit content directly on the website by clicking the padlock icon in the bottom right corner of the main site.
          </p>
        </div>
        
        <div className="mt-6 text-gray-700 dark:text-gray-300">
          <p className="mb-4">You'll be redirected to the main site in 5 seconds...</p>
          <div className="flex justify-center">
            <Link href="/newsite" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300">
              Go to Site Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 