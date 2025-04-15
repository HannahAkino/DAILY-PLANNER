// components/CTA.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function CTA() {
    const { user } = useAuth();

    const handleStartClick = () => {
        console.log("CTA: Start button clicked, user:", !!user);
        if (user) {
            // User is logged in, navigate directly to tasks
            window.location.href = '/tasks';
        } else {
            // Scroll to top and trigger auth modal
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Add auth parameter to trigger modal
            const url = new URL(window.location.href);
            url.searchParams.set('auth', 'required');
            window.history.pushState({}, '', url.toString());
            // Force a small refresh to ensure the auth modal opens
            setTimeout(() => {
                window.dispatchEvent(new Event('popstate'));
            }, 100);
        }
    };

    return (
        <section className="gradient-bg text-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                    Join thousands of professionals who are getting more done with Task Flow.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button 
                        onClick={handleStartClick}
                        className="bg-white text-indigo-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 h-auto"
                    >
                        {user ? 'Go to My Tasks' : 'Start Today'}
                    </Button>
                    <Button 
                        variant="outline" 
                        className="border-2 border-white text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 h-auto"
                    >
                        Request a Demo
                    </Button>
                </div>
            </div>
        </section>
    );
}