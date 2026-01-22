import React from 'react';
import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="bg-black py-12 px-6 border-t border-gray-900">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="mb-6 md:mb-0">
                        <Image
                            src="/images/logos/AE vector-2.png"
                            alt="Robust AE Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto opacity-80 hover:opacity-100 transition"
                        />
                        <p className="text-gray-500 text-sm mt-3 max-w-xs">Engineered for durability. Designed for performance.</p>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-center md:text-right">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Accreditations</p>
                            <div className="flex gap-4 items-center justify-center md:justify-end">
                                <span className="text-gray-600 text-sm font-bold">NAPIT #60482</span>
                                <span className="text-gray-600 text-sm font-bold">IET #1100789092</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Robust AE Ltd. Company No: 11269142. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-600 hover:text-white text-sm transition">Privacy Policy</a>
                        <a href="#" className="text-gray-600 hover:text-white text-sm transition">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
