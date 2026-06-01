import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Settings, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Mail, 
  HelpCircle, 
  AlertCircle,
  Clock,
  Briefcase,
  Layers,
  FileText,
  User,
  Lightbulb
} from "lucide-react";
import { TONE_OPTIONS } from "./components/ToneSelector";
import ToneSelector from "./components/ToneSelector";
import SettingsModal from "./components/SettingsModal";
import Loader from "./components/Loader";
import { OptimizationResponse } from "./types";

export default function App() {
  // Input Workspace states
  const [originalEmail, setOriginalEmail] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");

  // App UI & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // API Key management (localStorage)
  const [apiKey, setApiKey] = useState("");

  // AI Output state
  const [optimizedResult, setOptimizedResult] = useState<OptimizationResponse | null>(null);

  // Time Tracker
  const [currentTime, setCurrentTime] = useState("");

  // Load API Key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("user_gemini_api_key") || "";
    setApiKey(savedKey);

    // Initial default draft text to help user start quickly
    setOriginalEmail(
      "Hey Sarah, I'm just checking in on that proposal. Did you see it yet? Let me know if we can meet tomorrow at 14:00 to discuss the next steps."
    );
    setRecipient("Sarah Chen");
    setContext("Brief follow-up after the initial outline sent last Wednesday");
  }, []);

  // Simple current time string update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimizedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalEmail.trim()) {
      setErrorMessage("Please input original email draft content before optimizing.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setOptimizedResult(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Gemini-Api-Key": apiKey, // custom header passed securely
        },
        body: JSON.stringify({
          originalEmail,
          tone: selectedTone,
          recipient,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Optimization request failed.");
      }

      setOptimizedResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong while communicating with the AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedResult) return;
    const fullText = `Subject: ${optimizedResult.subjectLine}\n\n${optimizedResult.optimizedEmail}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activeToneObj = TONE_OPTIONS.find((t) => t.id === selectedTone) || TONE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col font-sans overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200" id="email-optimizer-app">
      
      {/* Navbar Container */}
      <nav className="h-16 px-4 md:px-8 border-b border-slate-900 bg-[#0f0f13] flex items-center justify-between z-10 sticky top-0" id="main-navigation">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Refine<span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-1.5 text-xs font-semibold text-slate-500 bg-slate-950 p-1 rounded-lg border border-slate-900">
            <span className="px-2 py-0.5 bg-slate-900 text-blue-400 font-mono rounded-md border border-slate-800">gemini-3.5-flash</span>
            <span className="px-2 py-0.5 text-slate-400">Connected</span>
          </div>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer trigger-settings-btn"
            id="open-settings-trigger"
            title="Setup Custom Gemini API Key Credentials"
          >
            <Settings className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
            <span className="text-xs hidden md:inline font-semibold">Gemini API Configuration</span>
            {apiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Welcome Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 py-4 px-4 md:px-8 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5" id="hero-welcome-badge">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <p className="text-xs text-slate-400">
            Draft, optimize, and reform communications in real-time with zero system latency.
          </p>
        </div>
        {currentTime && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-[#121218] px-2.5 py-1 rounded-md border border-slate-900 w-fit">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime}</span>
          </div>
        )}
      </div>

      {/* Main Grid View Dashboard Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8" id="workspace-main-grid">
        
        {/* Left Side: Inputs */}
        <section className="flex flex-col space-y-6" id="input-parameters-section">
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-sm"></span>
              Input Workspace
            </h2>
            <button
              onClick={() => {
                setOriginalEmail("");
                setRecipient("");
                setContext("");
              }}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
              id="clear-form-btn"
            >
              Reset Draft
            </button>
          </div>

          <form onSubmit={handleOptimizedSubmit} className="space-y-5 flex-1 flex flex-col">
            
            {/* Real Textarea Input Area for Original copy */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Original Draft Email
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {originalEmail.length} characters
                </span>
              </div>
              <div className="flex-1 min-h-[160px] bg-[#121218] border border-slate-800 rounded-xl p-4 shadow-inner relative flex flex-col">
                <textarea
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  className="w-full flex-1 bg-transparent border-none text-slate-200 resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed placeholder-slate-600 font-sans"
                  placeholder="Paste or type your draft email here. E.g.: 'Hey we have that meeting tomorrow can you bring slides? thx'"
                  id="original-email-textarea"
                />
              </div>
            </div>

            {/* Recipient Input details & Custom Goal Context row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Recipient Name/Target
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Sarah Chen (e.g. Lead Designer)"
                  className="w-full bg-[#121218] border border-[#1e293b] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none transition-all"
                  id="recipient-name-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-slate-400" /> Goal / Core Objective
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Confirm PPT slides & attendance"
                  className="w-full bg-[#121218] border border-[#1e293b] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none transition-all"
                  id="goal-context-input"
                />
              </div>
            </div>

            {/* Tone selector section */}
            <ToneSelector 
              selectedTone={selectedTone} 
              onSelectTone={(toneId) => setSelectedTone(toneId)} 
            />

            {/* Clear Warning Alert if using global fallback API key */}
            {!apiKey && (
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-normal">
                  <span className="font-semibold text-slate-200">System Mode:</span> Using shared sandbox server credentials to rewrite your draft. For private, unthrottled performance, configure your own key in settings.
                </div>
              </div>
            )}

            {/* Large trigger block */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLoading ? "animate-pulse" : ""
              }`}
              id="submit-optimization-button"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? "Optimizing with Gemini Intelligence..." : "Reconstruct Optimized Email"}
            </button>

          </form>
        </section>

        {/* Right Side: Output */}
        <section className="flex flex-col space-y-6" id="ai-results-dashboard-section">
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-sm"></span>
              AI Refinement Output
            </h2>
            {optimizedResult && (
              <span className="text-xs text-blue-400 font-mono font-medium">
                Optimized in {activeToneObj.name} Style
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col space-y-5 h-full">
            
            {/* Loader block displayed when sending request */}
            {isLoading && (
              <div className="flex-1 bg-gradient-to-b from-[#101015] to-[#0c0c10] border border-slate-800/80 rounded-2xl flex items-center justify-center">
                <Loader />
              </div>
            )}

            {/* Error Message Handler */}
            {errorMessage && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl leading-relaxed text-sm flex items-start gap-3" id="error-alert-box">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">Authorization or Generation Failed</h4>
                  <p className="text-slate-300 text-xs mb-3">{errorMessage}</p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                  >
                    Open Settings Configuration & Check API Key
                  </button>
                </div>
              </div>
            )}

            {/* Idle state helper banner */}
            {!isLoading && !optimizedResult && !errorMessage && (
              <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full" id="idle-workspace-state">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center text-slate-300 mb-4 animate-bounce">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-slate-100 font-semibold mb-1">No Revise Executed</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                  Input your rough original draft on the left, choose your desired tone, specify target recipient details, and click optimizer.
                </p>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-left w-full max-w-sm space-y-1.5 text-[11px] font-mono">
                  <div className="text-blue-400 font-semibold">⚡ Expected Outputs:</div>
                  <div className="text-slate-400">• High-grade subject line matched to goal</div>
                  <div className="text-slate-400">• Fully punctuated optimized email draft</div>
                  <div className="text-slate-400">• Clear breakdown explanation logical changes</div>
                </div>
              </div>
            )}

            {/* Optimized content output card */}
            {!isLoading && optimizedResult && (
              <div className="flex-1 flex flex-col space-y-4" id="optimized-response-container">
                
                {/* Email Display Card */}
                <div className="bg-gradient-to-b from-[#1a1b26] to-[#121218] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative backdrop-blur-sm flex flex-col min-h-[290px]">
                  
                  {/* Actions Bar */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                    <div className="text-xs text-blue-400 font-mono bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10">
                      Draft Upgraded • {activeToneObj.name} Mode
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                        id="copy-to-clipboard-inner"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Draft
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
                          optimizedResult.subjectLine
                        )}&body=${encodeURIComponent(optimizedResult.optimizedEmail)}`}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-all font-semibold cursor-pointer"
                        id="send-mailto-trigger"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Now
                      </a>
                    </div>
                  </div>

                  {/* Subject preview */}
                  <div className="mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex items-start gap-2">
                    <span className="text-xs font-bold text-slate-400 shrink-0 font-mono mt-0.5">SUBJECT:</span>
                    <span className="text-xs font-semibold text-slate-100">{optimizedResult.subjectLine}</span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text">
                    {optimizedResult.optimizedEmail}
                  </div>
                </div>

                {/* Change Logic/Justification Summary card underneath */}
                <div className="bg-[#0f0f13] border border-slate-800 rounded-xl p-5" id="change-logic-panel">
                  <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    How Gemini Optimized Your Draft
                  </h3>
                  <div className="text-xs font-sans text-slate-300 leading-relaxed whitespace-pre-line pl-1 border-l border-blue-500/20">
                    {optimizedResult.changeSummary}
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>

      </main>

      {/* Persistent Settings Modal Backdrop Component overlay */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentApiKey={apiKey}
        onApiKeyChange={(newKey) => setApiKey(newKey)}
      />

      {/* Styled Human Footer */}
      <footer className="h-12 border-t border-slate-900 bg-[#07070a] flex items-center justify-between px-4 md:px-8 mt-12 shrink-0">
        <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
          <span>Local Engine Key Secure</span>
          <span>No login required</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          Powered by <span className="text-blue-400 font-semibold tracking-wider">Gemini 3.5 Flash</span>
        </div>
      </footer>

    </div>
  );
}
