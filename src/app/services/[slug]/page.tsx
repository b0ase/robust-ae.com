import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { siteContent } from '@/data/siteContent';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/components/MotionWrapper';

interface PageProps {
    params: {
        slug: string;
    }
}

// Generate static params to statically build all service pages
export async function generateStaticParams() {
    return siteContent.services.cards.map((service) => ({
        slug: service.slug,
    }));
}

export default function ServicePage({ params }: PageProps) {
    const service = siteContent.services.cards.find(s => s.slug === params.slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.details?.image || service.details?.image || "/images/hero-bg.jpg"}
                        alt={service.title}
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center pt-20">
                    <MotionWrapper type="slideUp">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-mono tracking-tight drop-shadow-lg">
                            {service.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                            {service.description}
                        </p>
                    </MotionWrapper>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <MotionWrapper type="fadeIn" delay={0.2}>
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold mb-6 text-b0ase-blue">Overview</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {service.details?.fullDescription}
                            </p>
                        </div>
                    </MotionWrapper>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        <MotionWrapper type="slideUp" delay={0.3}>
                            <div className="bg-b0ase-card p-8 rounded-xl border border-b0ase-card-border h-full">
                                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-b0ase-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Key Features
                                </h3>
                                <ul className="space-y-4">
                                    {service.details?.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300">
                                            <span className="w-1.5 h-1.5 bg-b0ase-blue rounded-full mt-2 mr-3 shrink-0"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </MotionWrapper>

                        <MotionWrapper type="slideUp" delay={0.4}>
                            <div className="bg-b0ase-card p-8 rounded-xl border border-b0ase-card-border h-full">
                                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Benefits
                                </h3>
                                <ul className="space-y-4">
                                    {service.details?.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </MotionWrapper>
                    </div>

                    <MotionWrapper type="fadeIn" delay={0.5}>
                        <div className="text-center bg-gradient-to-r from-b0ase-blue/20 to-purple-900/20 p-10 rounded-2xl border border-b0ase-blue/30">
                            <h3 className="text-2xl font-bold text-white mb-4">Ready to start your project?</h3>
                            <p className="text-gray-300 mb-8 max-w-lg mx-auto">Let's discuss how we can help you implement {service.title.toLowerCase()} solutions for your business.</p>
                            <a
                                href="/#contact"
                                className="inline-block bg-b0ase-blue text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
                            >
                                Contact Us
                            </a>
                        </div>
                    </MotionWrapper>
                </div>
            </section>

            <Footer />
        </div>
    );
}
