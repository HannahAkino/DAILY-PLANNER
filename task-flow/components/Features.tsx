// components/Features.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ListChecks, Users, Calendar, Bell, BarChart2, Smartphone } from "lucide-react";
import React from "react";

interface FeatureType {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function Features() {
    const features: FeatureType[] = [
        {
            icon: <ListChecks className="text-indigo-600 w-7 h-7" />,
            title: "Smart Task Management",
            description: "Easily create, organize, and prioritize tasks with our intuitive interface. Set due dates, reminders, and labels."
        },
        {
            icon: <Users className="text-indigo-600 w-7 h-7" />,
            title: "Team Collaboration",
            description: "Work seamlessly with your team. Assign tasks, leave comments, and track progress in real-time."
        },
        {
            icon: <Calendar className="text-indigo-600 w-7 h-7" />,
            title: "Calendar Integration",
            description: "Sync your tasks with your calendar. Get a complete view of your schedule and deadlines at a glance."
        },
        {
            icon: <Bell className="text-indigo-600 w-7 h-7" />,
            title: "Smart Reminders",
            description: "Never miss a deadline. Get timely notifications via email, mobile, or desktop alerts."
        },
        {
            icon: <BarChart2 className="text-indigo-600 w-7 h-7" />,
            title: "Productivity Analytics",
            description: "Track your performance with insightful reports and analytics. Identify your most productive times."
        },
        {
            icon: <Smartphone className="text-indigo-600 w-7 h-7" />,
            title: "Cross-Platform Sync",
            description: "Access your tasks anywhere. Available on web, iOS, and Android with seamless synchronization."
        }
    ];

    return (
        <section id="features" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to manage your tasks efficiently and boost your productivity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="feature-card bg-white p-8 rounded-xl shadow-md transition duration-300 border-none">
                            <CardContent className="p-0">
                                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}