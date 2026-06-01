import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const LOADING_STEPS = [
  "Analyzing email draft grammar & style...",
  "Applying tone-specific vocabulary upgrades...",
  "Formatting structure for optimal readability...",
  "Polishing greetings and sign-off elements...",
  "Synthesizing revision change summary...",
];

export default function Loader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[350px]" id="email-loader">
      <div className="relative mb-6">
        {/* Glow behind spinner */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
        
        {/* Animated Spin Ring */}
        <div className="relative w-16 h-16 rounded-full border-2 border-slate-800 border-t-2 border-t-blue-500 animate-spin flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-400 animate-bounce" />
        </div>
      </div>

      <h3 className="text-lg font-medium text-slate-100 mb-2">
        AI Email Optimizer at Work
      </h3>
      
      {/* Changing status items */}
      <div className="h-6 overflow-hidden">
        <p className="text-sm font-mono text-blue-400 animate-pulse">
          {LOADING_STEPS[currentStep]}
        </p>
      </div>

      <div className="mt-8 flex gap-1 justify-center">
        {LOADING_STEPS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
              idx === currentStep ? "bg-blue-500 w-10" : "bg-slate-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
