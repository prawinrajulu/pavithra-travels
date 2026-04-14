import { Outlet } from "react-router-dom";
import { ScrollToTop } from "./scroll-to-top";
import { Header } from "./header";
import { Footer } from "./footer";
import { ChatBot } from "./chatbot";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
