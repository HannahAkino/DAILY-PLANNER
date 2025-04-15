// components/CTA.tsx
import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <section className="gradient-bg text-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                    Join thousands of professionals who are getting more done with Task Flow.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button className="bg-white text-indigo-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 h-auto">
                        Start Your Free Trial
                    </Button>
                    <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 h-auto">
                        Request a Demo
                    </Button>
                </div>
            </div>
        </section>
    );
}