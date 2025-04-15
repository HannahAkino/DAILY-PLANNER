// components/HowItWorks.tsx
import Image from "next/image";

interface StepType {
    number: number;
    title: string;
    description: string;
}

export default function HowItWorks() {
    const steps: StepType[] = [
        {
            number: 1,
            title: "Sign Up in Seconds",
            description: "Create your free account with just your email or use social login for instant access."
        },
        {
            number: 2,
            title: "Add Your Tasks",
            description: "Quickly add tasks with titles, descriptions, due dates, and priority levels."
        },
        {
            number: 3,
            title: "Organize & Prioritize",
            description: "Drag and drop tasks into categories, set reminders, and focus on what matters most."
        },
        {
            number: 4,
            title: "Boost Your Productivity",
            description: "Watch your productivity soar as you complete tasks and achieve your goals."
        }
    ];

    return (
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Task Flow Works</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get started in minutes and transform how you manage tasks</p>
                </div>

                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                        <Image
                            src="https://illustrations.popsy.co/amber/designer.svg"
                            alt="How it works"
                            className="w-full max-w-md mx-auto"
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white font-bold">
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                                        <p className="mt-2 text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}