// components/Testimonials.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialType {
    image: string;
    name: string;
    role: string;
    content: string;
    stars: number;
}

export default function Testimonials() {
    const testimonials: TestimonialType[] = [
        {
            image: "https://randomuser.me/api/portraits/women/32.jpg",
            name: "Sarah Johnson",
            role: "Product Manager",
            content: "Task Flow has completely transformed how I manage my work. The ability to prioritize tasks and set reminders has saved me hours every week. My team loves the collaboration features too!",
            stars: 5
        },
        {
            image: "https://randomuser.me/api/portraits/men/75.jpg",
            name: "Michael Chen",
            role: "Freelance Developer",
            content: "As a freelancer juggling multiple clients, Task Flow keeps me organized and on track. The mobile app is fantastic - I can update my tasks from anywhere. The analytics help me understand my work patterns too.",
            stars: 5
        },
        {
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            name: "Emma Rodriguez",
            role: "Marketing Director",
            content: "Our marketing team switched to Task Flow six months ago and we've never looked back. The shared projects and task assignment features have improved our workflow dramatically. Highly recommended!",
            stars: 4.5
        }
    ];

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of satisfied users who transformed their productivity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="testimonial-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md border-none">
                            <CardContent className="p-0">
                                <div className="flex items-center mb-4">
                                    <Image
                                        className="w-12 h-12 rounded-full"
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                    />
                                    <div className="ml-4">
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-indigo-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">{testimonial.content}</p>
                                <div className="mt-4 text-yellow-400">
                                    {[...Array(Math.floor(testimonial.stars))].map((_, i) => (
                                        <i key={i} className="fas fa-star"></i>
                                    ))}
                                    {testimonial.stars % 1 !== 0 && (
                                        <i className="fas fa-star-half-alt"></i>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}