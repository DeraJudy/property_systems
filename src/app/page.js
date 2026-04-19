import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import SocialSection from "@/components/SocialSection";
import StorySection from "@/components/StorySection";
import VideoSection from "@/components/VideoSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen  ">
      <Navbar />
      <Hero />
      <StorySection />
      <VideoSection />
      <SocialSection />
      {/* <Features /> */}
      {/* <Benefits /> */}
      <Footer />
    </div>
  );
}
