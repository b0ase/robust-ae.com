"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

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

interface DayFeedback {
  day: number;
  comment: string;
  approved: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Analytics data (placeholder)
  const [pageViews, setPageViews] = useState({
    home: 238,
    services: 142,
    contact: 87,
  });
  
  const [lastEdited, setLastEdited] = useState<string | null>(null);
  
  const [dayFeedback, setDayFeedback] = useState<DayFeedback[]>([
    { day: 1, comment: '', approved: false },
    { day: 2, comment: '', approved: false },
    { day: 3, comment: '', approved: false },
    { day: 4, comment: '', approved: false },
    { day: 5, comment: '', approved: false },
  ]);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'success' | 'error' | null>(null);
  
  // Load authentication status from session storage
  useEffect(() => {
    // Check for authentication in sessionStorage
    const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      fetchContent();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch content data
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      setContent(data);
      
      // Get last edited time from localStorage
      const editTime = localStorage.getItem('lastContentEdit');
      setLastEdited(editTime);
      
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content data.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle authentication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side password check
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error("NEXT_PUBLIC_ADMIN_PASSWORD is not set in environment variables!");
      setError("Configuration error. Please contact support.");
      return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
      // Store auth in session
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      fetchContent();
    } else {
      setError('Invalid password.');
      setPassword('');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    setContent(null);
    setPassword('');
  };
  
  const goToEditSite = () => {
    // Set session storage flag indicating the site should be in edit mode
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    // Redirect to the site
    router.push('/newsite');
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      loadFeedback();
    }
  }, [isAuthenticated]);
  
  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('robust_ae_feedback')
        .select('*')
        .order('day');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDayFeedback(data.map(item => ({
          day: item.day,
          comment: item.comment || '',
          approved: item.approved || false
        })));
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };
  
  const handleFeedbackChange = (day: number, field: 'comment' | 'approved', value: string | boolean) => {
    setDayFeedback(prev => 
      prev.map(item => 
        item.day === day ? { ...item, [field]: value } : item
      )
    );
  };
  
  const saveFeedback = async (day: number) => {
    setIsSavingFeedback(true);
    setFeedbackStatus(null);
    
    try {
      const feedbackItem = dayFeedback.find(item => item.day === day);
      if (!feedbackItem) return;
      
      const { error } = await supabase
        .from('robust_ae_feedback')
        .upsert({ 
          day,
          comment: feedbackItem.comment,
          approved: feedbackItem.approved,
          updated_at: new Date()
        });
      
      if (error) throw error;
      
      setFeedbackStatus('success');
      setTimeout(() => setFeedbackStatus(null), 3000);
    } catch (error) {
      console.error('Error saving feedback:', error);
      setFeedbackStatus('error');
    } finally {
      setIsSavingFeedback(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b0ase-blue"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Admin Dashboard</h1>
        <div className="w-full max-w-sm bg-b0ase-card p-8 rounded-lg border border-b0ase-card-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border border-b0ase-card-border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:border-b0ase-blue pr-10"
                  required
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                  style={{ top: '-0.375rem' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                   {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-b0ase-blue text-white font-semibold px-6 py-3 rounded hover:bg-opacity-80 transition duration-300 disabled:opacity-50"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <Link href="/newsite" className="text-b0ase-blue hover:text-white transition-colors mt-8">&larr; Back to Site</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="bg-b0ase-dark text-white p-4 border-b border-b0ase-card-border">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/newsite" className="text-2xl font-bold">Robust AE</Link>
            <span className="bg-b0ase-blue bg-opacity-20 text-white px-2 py-1 rounded text-sm font-medium">Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-opacity-80 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Page Views Card */}
          <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-b0ase-blue">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Page Views (30 days)
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Homepage</span>
                  <span className="font-semibold text-white">{pageViews.home}</span>
                </div>
                <div className="w-full bg-black rounded-full h-2">
                  <div className="bg-b0ase-blue h-2 rounded-full" style={{ width: `${(pageViews.home / (pageViews.home + pageViews.services + pageViews.contact)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Services</span>
                  <span className="font-semibold text-white">{pageViews.services}</span>
                </div>
                <div className="w-full bg-black rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(pageViews.services / (pageViews.home + pageViews.services + pageViews.contact)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Contact</span>
                  <span className="font-semibold text-white">{pageViews.contact}</span>
                </div>
                <div className="w-full bg-black rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(pageViews.contact / (pageViews.home + pageViews.services + pageViews.contact)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Status Card */}
          <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              Content Status
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-1">Last Edited</p>
                <p className="font-semibold text-white">
                  {lastEdited ? new Date(lastEdited).toLocaleString() : 'No edit history found'}
                </p>
              </div>
              <div>
                <p className="text-gray-300 mb-1">Content Sections</p>
                <div className="flex space-x-2">
                  <span className="bg-green-900 bg-opacity-20 text-green-400 px-2 py-1 rounded text-xs">Hero</span>
                  <span className="bg-green-900 bg-opacity-20 text-green-400 px-2 py-1 rounded text-xs">Services</span>
                  <span className="bg-green-900 bg-opacity-20 text-green-400 px-2 py-1 rounded text-xs">Mission</span>
                  <span className="bg-green-900 bg-opacity-20 text-green-400 px-2 py-1 rounded text-xs">Contact</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Card */}
          <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-yellow-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button 
                onClick={goToEditSite}
                className="w-full bg-b0ase-blue text-white font-semibold px-4 py-2 rounded hover:bg-opacity-80 transition flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                <span>Edit Website Content</span>
              </button>
              
              <Link 
                href="/newsite" 
                className="w-full bg-gray-800 text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 transition flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span>View Website</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Proposed 5-Day Development Plan */}
        <section className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Professional Development Package (40h, £400 + Supabase costs)
          </h2>
          <p className="mb-4 text-gray-400 text-sm italic">A complete solution to elevate your online presence with enterprise-grade data management, analytics, and AI integration.</p>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center text-b0ase-blue">
                <span className="bg-b0ase-blue bg-opacity-20 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-b0ase-blue">1</span>
                Database Infrastructure & Content Management (Day 1)
              </h3>
              <div className="ml-9 mt-2">
                <ul className="list-disc list-outside space-y-1 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete Supabase database setup with row-level security and data validation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Migration of all content from static JSON to flexible database storage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Implementation of content versioning system & rollback capability</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Admin API endpoints for secure content management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Environment variable configuration across dev/staging/production</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-1"><strong>Value:</strong> Enterprise-grade content infrastructure with version history and proper backup</p>
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-300">Client Feedback</h4>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-green-600 bg-black border-gray-700"
                          checked={dayFeedback[0].approved}
                          onChange={(e) => handleFeedbackChange(1, 'approved', e.target.checked)}
                        />
                        <span className="ml-2 text-xs text-gray-400">Approve</span>
                      </label>
                      <button
                        onClick={() => saveFeedback(1)}
                        disabled={isSavingFeedback}
                        className="text-xs bg-b0ase-blue text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={dayFeedback[0].comment}
                    onChange={(e) => handleFeedbackChange(1, 'comment', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-b0ase-blue focus:border-b0ase-blue text-white"
                    placeholder="Questions or comments about this feature set..."
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center text-green-600 dark:text-green-400">
                <span className="bg-green-100 dark:bg-green-900 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-green-600 dark:text-green-400">2</span>
                Analytics & Business Intelligence Suite (Day 2)
              </h3>
              <div className="ml-9 mt-2">
                <ul className="list-disc list-outside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Integration with Google Analytics 4 for comprehensive traffic tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom dashboard with key performance metrics (visitors, engagement, conversions)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Heatmap visualization to understand user behavior & interactions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Service popularity tracking to prioritize business offerings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Geographic & device analytics to target marketing efforts</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-1"><strong>Value:</strong> Data-driven decision making for marketing and business development</p>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Feedback</h4>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-green-600"
                          checked={dayFeedback[1].approved}
                          onChange={(e) => handleFeedbackChange(2, 'approved', e.target.checked)}
                        />
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Approve</span>
                      </label>
                      <button
                        onClick={() => saveFeedback(2)}
                        disabled={isSavingFeedback}
                        className="text-xs bg-b0ase-blue text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={dayFeedback[1].comment}
                    onChange={(e) => handleFeedbackChange(2, 'comment', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-b0ase-blue focus:border-b0ase-blue text-white"
                    placeholder="Questions or comments about this feature set..."
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center text-purple-600 dark:text-purple-400">
                <span className="bg-purple-100 dark:bg-purple-900 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400">3</span>
                AI Content & Social Proof Integration (Day 3)
              </h3>
              <div className="ml-9 mt-2">
                <ul className="list-disc list-outside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI testimonial generator with industry-specific engineering context</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Stability AI integration for custom project imagery & case study visuals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automated technical copywriting assistant for service descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Natural language form processing for improved client inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Admin interface for reviewing & publishing AI-generated content</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-1"><strong>Value:</strong> Cutting-edge AI capabilities to enhance content quality and social proof</p>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Feedback</h4>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-green-600"
                          checked={dayFeedback[2].approved}
                          onChange={(e) => handleFeedbackChange(3, 'approved', e.target.checked)}
                        />
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Approve</span>
                      </label>
                      <button
                        onClick={() => saveFeedback(3)}
                        disabled={isSavingFeedback}
                        className="text-xs bg-b0ase-blue text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={dayFeedback[2].comment}
                    onChange={(e) => handleFeedbackChange(3, 'comment', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-b0ase-blue focus:border-b0ase-blue text-white"
                    placeholder="Questions or comments about this feature set..."
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center text-amber-600 dark:text-amber-400">
                <span className="bg-amber-100 dark:bg-amber-900 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-amber-600 dark:text-amber-400">4</span>
                UI Refinement & Performance Optimization (Day 4)
              </h3>
              <div className="ml-9 mt-2">
                <ul className="list-disc list-outside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Admin dashboard polish with intuitive content management workflows</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Image optimization pipeline for faster page loading</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Responsive design refinements for perfect mobile experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Accessibility compliance (WCAG) for inclusive user experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Performance tuning for 90+ Lighthouse/PageSpeed scores</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-1"><strong>Value:</strong> Professional, high-performance website that makes exceptional first impressions</p>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Feedback</h4>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-green-600"
                          checked={dayFeedback[3].approved}
                          onChange={(e) => handleFeedbackChange(4, 'approved', e.target.checked)}
                        />
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Approve</span>
                      </label>
                      <button
                        onClick={() => saveFeedback(4)}
                        disabled={isSavingFeedback}
                        className="text-xs bg-b0ase-blue text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={dayFeedback[3].comment}
                    onChange={(e) => handleFeedbackChange(4, 'comment', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-b0ase-blue focus:border-b0ase-blue text-white"
                    placeholder="Questions or comments about this feature set..."
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center text-red-600 dark:text-red-400">
                <span className="bg-red-100 dark:bg-red-900 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-red-600 dark:text-red-400">5</span>
                Production Deployment & Documentation (Day 5)
              </h3>
              <div className="ml-9 mt-2">
                <ul className="list-disc list-outside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>CI/CD pipeline configuration for automated testing & deployment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive admin documentation with video walkthroughs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Security audit & implementation of best practices</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Environment setup for staging/production with proper variable isolation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SEO optimization & structured data implementation</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-1"><strong>Value:</strong> Enterprise-grade deployment with proper documentation and security</p>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Feedback</h4>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-green-600"
                          checked={dayFeedback[4].approved}
                          onChange={(e) => handleFeedbackChange(5, 'approved', e.target.checked)}
                        />
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Approve</span>
                      </label>
                      <button
                        onClick={() => saveFeedback(5)}
                        disabled={isSavingFeedback}
                        className="text-xs bg-b0ase-blue text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={dayFeedback[4].comment}
                    onChange={(e) => handleFeedbackChange(5, 'comment', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-b0ase-blue focus:border-b0ase-blue text-white"
                    placeholder="Questions or comments about this feature set..."
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Investment: <span className="font-semibold">£400</span> (40 hours @ £100/day) + Supabase hosting costs
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Supabase free tier covers most small business needs. Usage beyond free tier may incur additional costs.
            </p>
          </div>
        </section>
        
        {/* Content Preview Section */}
        {content && (
          <div className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-white border-b dark:border-gray-700 pb-2">
              Content Preview
            </h2>
            
            <div className="space-y-6">
              {/* Hero Section Preview */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-b0ase-blue flex items-center justify-center mr-2 text-b0ase-blue">H</span>
                  Hero Section
                </h3>
                <div className="pl-10">
                  <p className="font-semibold text-white">{content.hero.title}</p>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{content.hero.subtitle}</p>
                </div>
              </div>
              
              {/* Services Section Preview */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 text-green-600 dark:text-green-400">S</span>
                  Services Section
                </h3>
                <div className="pl-10">
                  <p className="font-semibold text-white">{content.services.introTitle}</p>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{content.services.introText}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-500">{content.services.cards.length} service cards defined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Content Generation Section */}
        <section className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">AI Content Generation</h2>
          <p className="text-gray-400 mb-4">Leverage AI to assist with content creation and improvements.</p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/images/stability-ai-logo.png"
                alt="Stability AI Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-white">Stability AI Integration</h3>
                <p className="text-sm text-gray-400">Generate professional images for your website using Stability AI.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Image
                src="/images/ai-assistant.png"
                alt="AI Assistant"
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-white">Content Assistant</h3>
                <p className="text-sm text-gray-400">AI-powered content suggestions to improve engagement and clarity.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                className="bg-b0ase-blue text-white px-4 py-2 rounded font-medium hover:bg-opacity-80 transition disabled:opacity-50"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        {/* Feedback and Support Section */}
        <section className="bg-b0ase-card p-6 rounded-lg border border-b0ase-card-border">
          <h2 className="text-2xl font-semibold mb-4 text-white">Help & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium mb-2 text-white">Documentation</h3>
              <p className="text-gray-400 mb-4">Access detailed guides and documentation for your website.</p>
              <a 
                href="#" 
                className="mt-auto text-b0ase-blue hover:text-white transition-colors flex items-center"
              >
                View Documentation
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium mb-2 text-white">Technical Support</h3>
              <p className="text-gray-400 mb-4">Need assistance with your website? Get in touch with our support team.</p>
              <a 
                href="mailto:support@robust-ae.com" 
                className="mt-auto text-b0ase-blue hover:text-white transition-colors flex items-center"
              >
                Contact Support
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t dark:border-gray-800 mt-auto py-6 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Robust AE Admin Panel &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
} 