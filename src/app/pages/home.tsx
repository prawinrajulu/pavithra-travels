import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Services } from "../components/services";
import { FeaturedDestinations } from "../components/featured-destinations";
import { WhyChooseUs } from "../components/why-choose-us";
import { Testimonials } from "../components/testimonials";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { ChatBot } from "../components/chatbot";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
}