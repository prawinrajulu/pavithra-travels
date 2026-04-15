import { Hero } from "../components/hero";
import { ServicesNew } from "../components/services-new";
import { Packages } from "../components/packages";
import { WhyChooseUs } from "../components/why-choose-us";
import { Testimonials } from "../components/testimonials";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { VideoSection } from "../components/VideoSection";

// Importing the local video asset
import aboutVideo from "../../assets/about.mp4";

export function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <About />
      <ServicesNew />
      <Packages />
      <WhyChooseUs />
      <VideoSection 
        type="local" 
        src={aboutVideo} 
        title="Experience the Journey with Pavithra Travels" 
      />
      <Testimonials />
      <Contact />
    </div>
  );
}