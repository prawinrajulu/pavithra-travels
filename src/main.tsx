import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";
import { LoadingScreen } from "./app/components/ui/loading-screen";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function Root() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence mode="sync">
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);