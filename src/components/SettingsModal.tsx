import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Key, Eye, EyeOff, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyChange: (key: string) => void;
  currentApiKey: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onApiKeyChange,
  currentApiKey,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSavedDone, setIsSavedDone] = useState(false);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    localStorage.setItem("user_gemini_api_key", trimmedKey);
    onApiKeyChange(trimmedKey);
    setIsSavedDone(true);
    setTimeout(() => {
      setIsSavedDone(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem("user_gemini_api_key");
    onApiKeyChange("");
    setApiKey("");
    setIsSavedDone(true);
    setTimeout(() => {
      setIsSavedDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      id="settings-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        id="settings-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">API Credentials Settings</h3>
              <p className="text-xs text-slate-400 font-mono">Configure Gemini Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
            id="close-settings-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-2">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Local Security First:</strong> Your custom Gemini API Key will be saved directly inside your browser's private <code className="text-blue-400 font-mono">localStorage</code>. It is exclusively parsed on server-side calls under standard proxy headers.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API Key here (AIzaSy...)"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm font-mono glass-input"
                id="api-key-input-element"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                id="toggle-visibility-key"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {apiKey.trim() ? (
              apiKey.trim().startsWith("AIzaSy") ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" /> Valid Format (Starts with AIzaSy)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <AlertTriangle className="w-4 h-4" /> Format doesn't start with AIzaSy
                </span>
              )
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400">
                <AlertTriangle className="w-4 h-4" /> No active personal key. Falling back to platform key.
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 mt-6 border-t border-slate-900 pt-4 justify-end">
          {currentApiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs font-semibold rounded-xl transition-all"
              id="clear-settings-key"
            >
              Remove Stored Key
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSavedDone}
            className="px-5 py-2.5 bg-blue-600 active:scale-95 text-slate-100 hover:bg-blue-500 text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            id="save-settings-key"
          >
            {isSavedDone ? "Saved!" : "Save & Update Key"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
