import React from "react";
import { ToneOption } from "../types";
import { Sparkles, Briefcase, Heart, Scroll, Zap, Volume2, Flame } from "lucide-react";

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clear, respectful, structured, and ideal for standard workplaces.",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  {
    id: "formal",
    name: "Formal",
    description: "Academic prose, deferential greetings, refined polite grammar.",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm, supportive, conversational, and highly enthusiastic.",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
  },
  {
    id: "casual",
    name: "Casual",
    description: "Relaxed tone, clean modern wording, effortless and friendly.",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  {
    id: "urgent",
    name: "Urgent",
    description: "Direct alerts, emphasized deadlines, commanding swift response.",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    id: "persuasive",
    name: "Persuasive",
    description: "Compelling value props with a magnetic call to action.",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-400",
  },
  {
    id: "concise",
    name: "Concise",
    description: "Stripped-down, fast-reading directives, bulleted focus layout.",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400",
  },
];

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (toneId: string) => void;
}

export default function ToneSelector({ selectedTone, onSelectTone }: ToneSelectorProps) {
  const getIcon = (id: string, className: string) => {
    switch (id) {
      case "professional":
        return <Briefcase className={className} />;
      case "formal":
        return <Scroll className={className} />;
      case "friendly":
        return <Heart className={className} />;
      case "casual":
        return <Volume2 className={className} />;
      case "urgent":
        return <Flame className={className} />;
      case "persuasive":
        return <Zap className={className} />;
      case "concise":
        return <Sparkles className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-3" id="tone-selector-container">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Select Draft Style Tone
        </label>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
          Active: {TONE_OPTIONS.find((t) => t.id === selectedTone)?.name || "Professional"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2" id="tone-grid-element">
        {TONE_OPTIONS.map((tone) => {
          const isSelected = tone.id === selectedTone;
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() => onSelectTone(tone.id)}
              className={`text-left p-3 rounded-xl border flex flex-col justify-between h-full transition-all relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] ${
                isSelected
                  ? "bg-slate-900 border-blue-500/60 shadow-lg ring-1 ring-blue-500/10"
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40"
              }`}
              id={`tone-option-${tone.id}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-bl-3xl flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${tone.bgColor} ${tone.textColor} group-hover:scale-110 transition-transform`}>
                  {getIcon(tone.id, "w-4 h-4")}
                </div>
                <h4 className="font-semibold text-slate-100 text-sm">{tone.name}</h4>
              </div>
              
              <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                {tone.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
