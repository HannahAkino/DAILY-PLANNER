// components/Navigation.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListTodo, Menu, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavigationProps {
    onSignInClick?: () => void;
}

export default function Navigation({ onSignInClick }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, profile, signOut } = useAuth();
    const router = useRouter();

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

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const navigateToTasks = () => {
        console.log("Navigating to tasks page");
        // Use window.location for more direct navigation to ensure it works
        window.location.href = '/tasks';
    };

    // Get user's initials for avatar fallback
    const getInitials = () => {
        if (!profile?.name) return 'U';
        return profile.name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <nav className={`bg-white dark:bg-gray-950 fixed w-full z-10 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <ListTodo className="text-indigo-600 dark:text-indigo-400 w-7 h-7 mr-2" />
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Task Flow</span>
                        </div>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                        <button onClick={() => scrollToSection('features')} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection('testimonials')} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                            Testimonials
                        </button>
                        <button onClick={() => scrollToSection('pricing')} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                            Pricing
                        </button>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center space-x-2 focus:outline-none">
                                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-indigo-600 transition-all">
                                            <AvatarFallback className="bg-indigo-600 text-white">{getInitials()}</AvatarFallback>
                                            {profile?.avatar_url && (
                                                <AvatarImage src={profile.avatar_url} alt={profile?.name || 'User'} />
                                            )}
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-1">
                                    <DropdownMenuLabel>
                                        <div className="font-medium">{profile?.name || 'User'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={navigateToTasks} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Tasks</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button 
                                onClick={onSignInClick}
                                className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300"
                            >
                                Get Started
                            </Button>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden bg-white dark:bg-gray-950 shadow-lg ${mobileMenuOpen ? '' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection('testimonials')} className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        Testimonials
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        Pricing
                    </button>
                    {user && (
                        <button onClick={navigateToTasks} className="block px-3 py-2 text-base font-medium text-indigo-600 dark:text-indigo-400">
                            My Tasks
                        </button>
                    )}
                    {user && (
                        <button onClick={handleSignOut} className="block px-3 py-2 text-base font-medium text-red-600 dark:text-red-500">
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}