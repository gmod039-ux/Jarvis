import React, { useState, useEffect } from "react";
import {
  Volume2,
  Sparkles,
  Play,
  Check,
  X,
  Sliders,
  RotateCcw,
  Mic,
  Languages,
  Heart,
} from "lucide-react";
import { VOICE_PROFILES, VoiceProfile, jarvisVoice } from "../utils/speech";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: string;
  onSelectPersona: (personaId: string) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  currentPersona,
  onSelectPersona,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(currentPersona || "jarvis");
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.05);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [sampleLang, setSampleLang] = useState<"ru" | "en">("ru");
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  useEffect(() => {
    setSelectedProfileId(currentPersona);
    const profile = VOICE_PROFILES.find((p) => p.id === currentPersona) || VOICE_PROFILES[0];
    setPitch(profile.pitch);
    setRate(profile.rate);
  }, [currentPersona, isOpen]);

  useEffect(() => {
    const voices = jarvisVoice.getAvailableVoices();
    setAvailableVoices(voices);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentProfile =
    VOICE_PROFILES.find((p) => p.id === selectedProfileId) || VOICE_PROFILES[0];

  const handleProfileChange = (profile: VoiceProfile) => {
    setSelectedProfileId(profile.id);
    setPitch(profile.pitch);
    setRate(profile.rate);
    jarvisVoice.customPitch = profile.pitch;
    jarvisVoice.customRate = profile.rate;
    jarvisVoice.setPersona(profile.id);
    onSelectPersona(profile.id);
  };

  const handleTestSample = () => {
    setIsPlayingSample(true);
    const textToSpeak =
      sampleLang === "ru" ? currentProfile.samplePhraseRu : currentProfile.samplePhraseEn;

    jarvisVoice.speak(textToSpeak, {
      personaId: selectedProfileId,
      pitch,
      rate,
      voiceName: selectedVoiceName || undefined,
      onStart: () => setIsPlayingSample(true),
      onEnd: () => setIsPlayingSample(false),
      onError: () => setIsPlayingSample(false),
    });
  };

  const handleSaveAndApply = () => {
    jarvisVoice.customPitch = pitch;
    jarvisVoice.customRate = rate;
    jarvisVoice.customVoiceName = selectedVoiceName || null;
    jarvisVoice.setPersona(selectedProfileId);
    onSelectPersona(selectedProfileId);
    onClose();
  };

  const handleResetToPreset = () => {
    setPitch(currentProfile.pitch);
    setRate(currentProfile.rate);
    setSelectedVoiceName("");
    jarvisVoice.customPitch = null;
    jarvisVoice.customRate = null;
    jarvisVoice.customVoiceName = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121212] border border-white/15 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative font-sans">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between z-10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#E0E0E0] font-mono flex items-center space-x-2">
                <span>VOICE SYNTHESIS &amp; PERSONA MATRIX</span>
                <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30 font-sans">
                  Anime Tyan / Custom Pitch Engine
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Choose voice personality, tune speech frequency (Pitch/Rate), or activate Anime Tyan mode.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-5 overflow-y-auto z-10 space-y-5">
          {/* Preset Profile Cards Grid */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block font-mono">
              Select Voice Persona Preset
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {VOICE_PROFILES.map((profile) => {
                const isSelected = selectedProfileId === profile.id;
                const isAnime = profile.id === "anime" || profile.id === "tsundere";
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleProfileChange(profile)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? isAnime
                          ? "bg-pink-500/15 border-pink-500/50 shadow-[0_0_20px_rgba(244,114,182,0.2)]"
                          : "bg-[#00D1FF]/15 border-[#00D1FF]/50 shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                        : "bg-[#181818] border-white/10 hover:border-white/20 hover:bg-[#1f1f1f]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isAnime && <Heart className="w-4 h-4 text-pink-400 fill-current animate-pulse" />}
                        <span
                          className={`font-bold text-xs font-mono ${
                            isSelected ? (isAnime ? "text-pink-300" : "text-[#00D1FF]") : "text-white"
                          }`}
                        >
                          {profile.name}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${profile.badgeColor}`}
                      >
                        Pitch: {profile.pitch}x
                      </span>
                    </div>

                    <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                      {profile.subtitle}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-1 border-t border-white/5">
                      <span>Rate: {profile.rate}x</span>
                      {isSelected ? (
                        <span className="flex items-center space-x-1 text-[#34C759]">
                          <Check className="w-3 h-3" />
                          <span>Active Preset</span>
                        </span>
                      ) : (
                        <span className="text-white/40">Click to activate</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Tuning & Soundboard Studio */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2 text-xs font-mono text-white/80">
                <Sliders className="w-4 h-4 text-[#00D1FF]" />
                <span className="font-bold">Acoustic Frequency &amp; Voice Synthesis Calibration</span>
              </div>
              <button
                onClick={handleResetToPreset}
                className="text-[10px] font-mono text-white/40 hover:text-white flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Preset Defaults</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pitch Slider */}
              <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/70">Voice Pitch (Высота голоса):</span>
                  <span className="text-pink-400 font-bold">{pitch.toFixed(2)}x {pitch >= 1.4 ? "✨ Kawaii" : pitch < 0.95 ? "🤵 Deep" : "Normal"}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-white/30 font-mono">
                  <span>0.5x (Deep Robot)</span>
                  <span>1.0x (Neutral)</span>
                  <span>1.55x (Anime Tyan)</span>
                  <span>2.0x (Max High)</span>
                </div>
              </div>

              {/* Rate / Speed Slider */}
              <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/70">Speech Speed (Скорость речи):</span>
                  <span className="text-[#00D1FF] font-bold">{rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-[#00D1FF] cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-white/30 font-mono">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Default)</span>
                  <span>1.5x (Fast)</span>
                  <span>2.0x (Turbo)</span>
                </div>
              </div>
            </div>

            {/* System Audio Voice Device Select */}
            {availableVoices.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block font-mono">
                  Target System TTS Voice (Web Speech Engine)
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-xs font-mono text-white/90 focus:outline-none transition-colors"
                >
                  <option value="">Auto-Detect (Use Persona Optimized Engine)</option>
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang}) {v.default ? "★ Default" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Test Sample Player Box */}
            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    Sample Audition Phrase:
                  </span>
                  <div className="flex space-x-1 font-mono text-[10px]">
                    <button
                      onClick={() => setSampleLang("ru")}
                      className={`px-1.5 py-0.5 rounded ${
                        sampleLang === "ru"
                          ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      RU
                    </button>
                    <button
                      onClick={() => setSampleLang("en")}
                      className={`px-1.5 py-0.5 rounded ${
                        sampleLang === "en"
                          ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/80 italic font-sans">
                  &ldquo;{sampleLang === "ru" ? currentProfile.samplePhraseRu : currentProfile.samplePhraseEn}&rdquo;
                </p>
              </div>

              <button
                onClick={handleTestSample}
                disabled={isPlayingSample}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-pink-500/20 active:scale-95 shrink-0 disabled:opacity-50 font-mono"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingSample ? "Playing..." : "Test Voice Live"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between z-10">
          <span className="text-xs font-mono text-white/40 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Persona updates live in voice synthesizer and Gemini model</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-1.5 rounded-xl bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)] active:scale-95"
            >
              Apply Voice &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
