import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StorySection from "@/components/StorySection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen  ">
      <Navbar />
      <Hero />
      <StorySection />
      {/* <Features /> */}
      {/* <Benefits /> */}
      <Footer />
    </div>
  );
}
