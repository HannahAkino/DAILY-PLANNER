// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
// import TrustedBy from "@/components/TrustedBy";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { AuthModal } from "@/components/tasks/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const { user, sessionChecked, loading, signIn, signUp } = useAuth();

  // Handle authentication modal
  const handleAuthModalOpen = () => {
    console.log("Opening auth modal");
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    console.log("Closing auth modal");
    setShowAuthModal(false);
  };

  // Handle authentication and redirection
  useEffect(() => {
    // Check for redirect loop prevention
    const isRedirectingFromTasks = document.cookie.includes('redirected_from_tasks=true');
    
    // Only proceed if session check is complete
    if (!sessionChecked) {
      console.log("Home: Waiting for session check to complete");
      return;
    }

    if (!initialAuthCheckDone) {
      setInitialAuthCheckDone(true);
      
      // Check if user is already logged in
      if (user) {
        console.log("Home: User already authenticated, redirecting to tasks");
        // Only redirect to tasks if not in a redirect loop
        if (!isRedirectingFromTasks) {
          setTimeout(() => {
            window.location.href = '/tasks';
          }, 100);
        } else {
          console.log("Home: Detected redirect loop, not redirecting to tasks");
          // Clear the prevention cookie since we've handled it
          document.cookie = "redirected_from_tasks=; max-age=0; path=/;";
        }
        return;
      }
      
      // Show auth modal if auth parameter is present
      const authParam = searchParams.get('auth');
      if (authParam === 'required') {
        console.log("Home: Auth required parameter detected, showing auth modal");
        setShowAuthModal(true);
      }
    }
  }, [searchParams, user, router, sessionChecked, initialAuthCheckDone]);

  // Handle successful login
  const handleLoginSuccess = () => {
    console.log("Login successful, redirecting to tasks");
    setTimeout(() => {
      window.location.href = '/tasks';
    }, 500); // Small delay to allow for state updates
  };

  async function handleLogin(email: string, password: string) {
    console.log("Home: Login attempt");
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error("Login error:", error);
      return { error };
    }
    
    handleLoginSuccess();
    return { error: null };
  }

  async function handleRegister(name: string, email: string, password: string) {
    console.log("Home: Registration attempt with:", { name, email });
    const { error } = await signUp(name, email, password);
    
    if (error) {
      console.error("Registration error:", error);
      return { error };
    }
    
    return { error: null };
  }

  // Show a loading state while checking authentication
  if (loading && !initialAuthCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-hidden">
      <Navigation onSignInClick={handleAuthModalOpen} />
      <Hero onGetStarted={handleAuthModalOpen} />
      {/* <TrustedBy /> */}
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </main>
  );
}