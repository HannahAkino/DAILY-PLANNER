// app/page.tsx
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
// import TrustedBy from "@/components/TrustedBy";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      {/* <TrustedBy /> */}
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}