"use client";
import Background   from "@/app/components/Background";
import Navbar       from "@/app/components/Navbar";
import LandingPage         from "@/app/components/LandingPage";
import Marquee      from "@/app/components/Marquee";
import Features     from "@/app/components/Features";
import HowItWorks   from "@/app/components/HowItWorks";
import Testimonials from "@/app/components/Testimonials";
import Pricing      from "@/app/components/Pricing";
import CTA          from "@/app/components/CTA";
import Footer       from "@/app/components/Footer";
import Home         from "@/app/components/HomePage";
import CursorGlow   from "@/app/components/CursorGlow";

const Page=()=>{
  return (
    <>
      <CursorGlow />
      <Background />
      <Navbar />
      <main>
        <Home />
        <LandingPage />
        <Marquee />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default Page;
