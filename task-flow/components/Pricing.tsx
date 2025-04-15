
// components/Pricing.tsx
"use client"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlanFeature {
    text: string;
}

interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: PlanFeature[];
    buttonText: string;
    isPopular?: boolean;
    isFree?: boolean;
}

import { useRouter } from "next/navigation";

export default function Pricing() {
    const router = useRouter();
    const plans: PricingPlan[] = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for individuals getting started",
            features: [
                { text: "Up to 5 projects" },
                { text: "Basic task management" },
                { text: "Mobile app access" },
                { text: "Email reminders" },
                { text: "Task reminders & notifications" },
                { text: "Subtasks and checklists" },
                { text: "Attachments & file uploads" },
                { text: "Kanban board view" },
                { text: "Calendar view" },
                { text: "Dark mode support" },
                { text: "100% Free for Life" }
            ],
            buttonText: "Free for Life",
            isFree: true
        }
    ];

    return (
        <div className="flex justify-center items-center min-h-[60vh] py-12 bg-gradient-to-b from-indigo-50 to-white">
            <div className="w-full max-w-5xl">
                <Card className="shadow-xl border-2 border-indigo-200">
                    <CardHeader>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-3xl font-bold text-indigo-700 mb-2">{plans[0].name}</h3>
                            <span className="text-5xl font-extrabold text-indigo-600">{plans[0].price}</span>
                            <span className="text-gray-600 mt-1 text-center">{plans[0].description}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 mt-4">
                            {plans[0].features.map((feature, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg" onClick={() => plans[0].isFree && router.push('/tasks')}>
                            {plans[0].buttonText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}