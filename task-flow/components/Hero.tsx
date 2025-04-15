// components/Hero.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeroProps {
    onGetStarted?: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
    const { user } = useAuth();
    
    const handleStartClick = () => {
        if (onGetStarted) {
            onGetStarted();
        }
    };

    const handleGoToTasks = () => {
        window.location.href = '/tasks';
    };

    return (
        <section className="gradient-bg text-white pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                            Streamline Your Productivity with Task Flow
                        </h1>
                        <p className="text-xl text-indigo-100 mb-8">
                            The modern task management app that helps you organize, prioritize, and complete your work with ease.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            {user ? (
                                <Button 
                                    onClick={handleGoToTasks}
                                    className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 text-center h-auto"
                                >
                                    Go to My Tasks
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleStartClick}
                                    className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 text-center h-auto"
                                >
                                    Start Today
                                </Button>
                            )}
                            <Button variant="outline" className="border-2 border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 text-center h-auto">
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <Image
                            src="https://illustrations.popsy.co/amber/digital-nomad.svg"
                            alt="Task Management Illustration"
                            className="hero-image"
                            width={500}
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}