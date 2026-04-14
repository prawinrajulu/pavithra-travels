import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import logo from "../../../assets/logo.png";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 400); // Wait for progress bar to finish before firing complete
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#ffffff] overflow-hidden"
    >
      {/* Subtle Background Gradient Lighting */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-gradient-to-tr from-cyan-200/40 via-blue-100/30 to-indigo-200/40 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Image */}
        <motion.img
          src={logo}
          alt="Pavithra Travels"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-20 md:h-24 w-auto object-contain mb-12"
        />

        {/* Minimal Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-56 md:w-64 h-[2px] bg-slate-100 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            style={{ width: `${progress}%`, transition: 'width 20ms linear' }}
          />
        </motion.div>
      </div>

      {/* Brand Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center"
      >
        <p className="text-slate-400 text-xs md:text-sm tracking-[0.3em] font-light uppercase">
          Powered by <span className="text-slate-600 font-medium">Marca Rise</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
