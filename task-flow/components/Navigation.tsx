// components/Navigation.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ListTodo, Menu } from "lucide-react";

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className={`bg-white fixed w-full z-10 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <ListTodo className="text-indigo-600 w-7 h-7 mr-2" />
                            <span className="text-xl font-bold text-indigo-600">Task Flow</span>
                        </div>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                        <button onClick={() => scrollToSection('features')} className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection('testimonials')} className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            Testimonials
                        </button>
                        <button onClick={() => scrollToSection('pricing')} className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            Pricing
                        </button>
                    </div>
                    <div className="flex items-center">
                        <Link href="/tasks" passHref legacyBehavior>
                            <Button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden bg-white shadow-lg ${mobileMenuOpen ? '' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600">
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection('testimonials')} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600">
                        Testimonials
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600">
                        Pricing
                    </button>
                </div>
            </div>
        </nav>
    );
}