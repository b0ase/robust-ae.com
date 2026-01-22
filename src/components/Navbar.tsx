"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();

        if (pathname === '/') {
            // If on home page, smooth scroll to section
            const section = document.getElementById(sectionId);
            if (section) {
                const offsetTop = section.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        } else {
            // If on other pages, navigate to home with hash
            router.push(`/#${sectionId}`);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-black/80 text-white shadow-lg backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/images/logos/AE vector-2.png"
                            alt="Robust AE Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto cursor-pointer"
                        />
                    </Link>
                </div>
                <div className="hidden md:flex space-x-8">
                    <Link href="/" className="hover:text-b0ase-blue transition font-medium">Home</Link>
                    <a href="#services" onClick={(e) => handleNavigation(e, 'services')} className="hover:text-b0ase-blue transition font-medium cursor-pointer">Services</a>
                    <a href="#projects" onClick={(e) => handleNavigation(e, 'projects')} className="hover:text-b0ase-blue transition font-medium cursor-pointer">Projects</a>
                    <a href="#contact" onClick={(e) => handleNavigation(e, 'contact')} className="hover:text-b0ase-blue transition font-medium cursor-pointer">Contact</a>
                </div>
            </div>
        </nav>
    );
};
