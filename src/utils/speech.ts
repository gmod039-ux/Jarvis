// Speech recognition and synthesis engine with robust phonetic text cleaning,
// strict language-matching (preventing garbled foreign phonemes), and natural persona pitch tuning.

export interface VoiceProfile {
  id: string;
  name: string;
  subtitle: string;
  gender: "female" | "male" | "robot";
  pitch: number;
  rate: number;
  samplePhraseRu: string;
  samplePhraseEn: string;
  description: string;
  badgeColor: string;
  preferredVoicesRu: string[];
  preferredVoicesEn: string[];
}

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: "anime",
    name: "Аой-тян (Anime Tyan / アニメ)",
    subtitle: "Милый, звонкий и дружелюбный аниме-голос",
    gender: "female",
    pitch: 1.45,
    rate: 1.08,
    samplePhraseRu: "Привет, Сэмпай! Все системы твоего Мака работают отлично, готова к любой задаче!",
    samplePhraseEn: "Hello Senpai! All macOS systems are online and ready for your command!",
    description: "Звонкий и эмоциональный женский голос с повышенным тоном и живой интонацией.",
    badgeColor: "text-pink-400 bg-pink-400/10 border-pink-400/30",
    preferredVoicesRu: ["milena", "tatyana", "katya", "yuri", "google русский", "russian"],
    preferredVoicesEn: ["victoria", "samantha", "karen", "tessa", "google uk english female", "google us english"],
  },
  {
    id: "tsundere",
    name: "Асука-AI (Tsundere Mode)",
    subtitle: "Энергичная, немного дерзкая помощница",
    gender: "female",
    pitch: 1.35,
    rate: 1.15,
    samplePhraseRu: "Команда выполнена. Не то чтобы я старалась ради тебя, просто это моя работа!",
    samplePhraseEn: "Task executed. It is not like I did this just for you, it is just my protocol!",
    description: "Быстрый, задорный голос с повышенной высотой тона и уверенной подачей.",
    badgeColor: "text-red-400 bg-red-400/10 border-red-400/30",
    preferredVoicesRu: ["milena", "tatyana", "katya", "google русский", "russian"],
    preferredVoicesEn: ["victoria", "karen", "samantha", "google uk english female"],
  },
  {
    id: "jarvis",
    name: "J.A.R.V.I.S. (Британский дворецкий)",
    subtitle: "Спокойный, вежливый и уверенный мужской голос",
    gender: "male",
    pitch: 0.95,
    rate: 1.0,
    samplePhraseRu: "Добрый день, сэр. Все протоколы системы активны. Чем могу быть полезен?",
    samplePhraseEn: "Good day, Sir. All system protocols are operational. How may I assist you?",
    description: "Классический бархатный и сдержанный мужской голос.",
    badgeColor: "text-[#00D1FF] bg-[#00D1FF]/10 border-[#00D1FF]/30",
    preferredVoicesRu: ["yuri", "dmitry", "google русский", "russian", "milena"],
    preferredVoicesEn: ["daniel", "oliver", "george", "rishi", "british", "uk english male", "alex"],
  },
  {
    id: "friday",
    name: "F.R.I.D.A.Y. (Тактический ассистент)",
    subtitle: "Чёткий, быстрый и профессиональный женский голос",
    gender: "female",
    pitch: 1.05,
    rate: 1.08,
    samplePhraseRu: "Системы онлайн. Команда обработана с наивысшим приоритетом.",
    samplePhraseEn: "Systems online, Boss. Command processed with top priority.",
    description: "Лаконичный и точный женский голос для продуктивной работы.",
    badgeColor: "text-[#34C759] bg-[#34C759]/10 border-[#34C759]/30",
    preferredVoicesRu: ["milena", "tatyana", "katya", "google русский", "russian"],
    preferredVoicesEn: ["moira", "samantha", "karen", "fiona", "google us english"],
  },
  {
    id: "cyberpunk",
    name: "NEURAL-01 (Киберпанк)",
    subtitle: "Низкий цифровой оператор терминала",
    gender: "robot",
    pitch: 0.85,
    rate: 1.15,
    samplePhraseRu: "Ядро подключено. Выполняю оптимизацию и сброс системного кеша.",
    samplePhraseEn: "Kernel linked. Purging memory cache and executing daemon script.",
    description: "Низкий, динамичный голос в стиле футуристичного кибер-терминала.",
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    preferredVoicesRu: ["yuri", "google русский", "dmitry", "russian"],
    preferredVoicesEn: ["fred", "zarvox", "daniel", "alex", "google us english"],
  },
  {
    id: "glados",
    name: "GLaDOS Core (Ироничный ИИ)",
    subtitle: "Невозмутимый синтетический голос",
    gender: "female",
    pitch: 1.15,
    rate: 0.95,
    samplePhraseRu: "Ваш запрос успешно выполнен. Поздравляю с успешным нажатием клавиши.",
    samplePhraseEn: "Your macOS command executed. Congratulations on operating a computer.",
    description: "Размеренный женский голос с лёгкой синтетической интонацией.",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    preferredVoicesRu: ["milena", "tatyana", "katya", "google русский"],
    preferredVoicesEn: ["victoria", "karen", "samantha", "cellos", "google us english"],
  },
];

export interface SpeechHelperOptions {
  personaId?: string;
  voiceName?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Clean text specifically for Text-To-Speech synthesis:
 * - Strips emojis and decorative symbols that TTS reads aloud (e.g. "sparkles", "smiling face")
 * - Strips kaomoji / ASCII emoticons like (≧◡≦), (*^▽^*), (｡•́︿•̀｡), (^_^), (-_-)
 * - Strips code blocks, markdown asterisks, backticks, hashtags, URLs, and JSON fragments
 * - Normalizes punctuation so voice synthesis sounds natural without clicks or stuttering
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Remove code blocks completely (do not read hundreds of lines of code out loud)
  text = text.replace(/```[\s\S]*?```/g, "Код выполнен.");

  // 2. Remove URLs and long file paths
  text = text.replace(/https?:\/\/\S+/g, "");
  text = text.replace(/(\/[\w.-]+){3,}/g, "файловый путь");

  // 3. Remove Kaomoji / ASCII face emoticons (e.g. (≧◡≦), (*^▽^*), (｡•́︿•̀｡), (^_~), (._.), etc.)
  text = text.replace(/\([^\w\sа-яёА-ЯЁ]{2,}\)/g, "");
  text = text.replace(/\([\s*_~^•><=.-]{2,}\)/g, "");
  text = text.replace(/\([≧◡≦*^▽^｡•́︿•̀｡💢✨🌸]\)/g, "");
  text = text.replace(/[≧◡≦▽︿•́•̀]/g, "");

  // 4. Remove all Unicode Emojis and pictograms
  try {
    text = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F100}-\u{1F1FF}]/gu, "");
  } catch (e) {
    // Fallback regex if unicode property escapes are restricted
    text = text.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "");
  }

  // 5. Remove markdown formatting
  text = text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[*-]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "");

  // 6. Clean technical symbols and clutter
  text = text.replace(/[<>{}[\]|\\~`^#$@%&*=+/]/g, " ");

  // 7. Clean repeated punctuation (e.g. "....", "???!!", "----")
  text = text.replace(/[.]{2,}/g, ".");
  text = text.replace(/[!]{2,}/g, "!");
  text = text.replace(/[?]{2,}/g, "?");
  text = text.replace(/[-_]{2,}/g, " ");

  // 8. Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // 9. Keep spoken output concise and pleasant (up to first 2-3 sentences or ~250 chars)
  if (text.length > 280) {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      let trimmed = "";
      for (const s of sentences) {
        if ((trimmed + s).length <= 260) {
          trimmed += s + " ";
        } else {
          break;
        }
      }
      text = trimmed.trim() || sentences[0].trim();
    } else {
      text = text.slice(0, 250).trim() + "...";
    }
  }

  return text;
}

export class JarvisVoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  public currentPersonaId: string = "anime";
  public customPitch: number | null = null;
  public customRate: number | null = null;
  public customVoiceName: string | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public setPersona(personaId: string) {
    this.currentPersonaId = personaId;
  }

  /**
   * Find the optimal system voice strictly matching the language of the clean text.
   * This is critical to avoid the browser speaking Russian words using an English/Japanese phonetic engine,
   * which produces garbled, noisy stuttering.
   */
  private pickBestVoice(cleanText: string, profile: VoiceProfile, explicitVoiceName?: string): SpeechSynthesisVoice | undefined {
    const allVoices = this.getAvailableVoices();
    if (!allVoices || allVoices.length === 0) return undefined;

    // Explicit manual voice override from UI
    if (explicitVoiceName) {
      const match = allVoices.find((v) =>
        v.name.toLowerCase().includes(explicitVoiceName.toLowerCase())
      );
      if (match) return match;
    }

    const isRussian = /[а-яёА-ЯЁ]/.test(cleanText);

    if (isRussian) {
      // 1. Filter only Russian-language voices
      const ruVoices = allVoices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith("ru") ||
          v.lang.toLowerCase().includes("ru") ||
          v.name.toLowerCase().includes("russian") ||
          v.name.toLowerCase().includes("русский")
      );

      if (ruVoices.length > 0) {
        // Match preferred profile list for Russian
        for (const pref of profile.preferredVoicesRu) {
          const matched = ruVoices.find((v) =>
            v.name.toLowerCase().includes(pref.toLowerCase())
          );
          if (matched) return matched;
        }
        // Fallback to first available Russian voice
        return ruVoices[0];
      }
    } else {
      // English text
      const enVoices = allVoices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith("en") ||
          v.name.toLowerCase().includes("english")
      );

      if (enVoices.length > 0) {
        for (const pref of profile.preferredVoicesEn) {
          const matched = enVoices.find((v) =>
            v.name.toLowerCase().includes(pref.toLowerCase())
          );
          if (matched) return matched;
        }
        return enVoices[0];
      }
    }

    // Default system fallback
    return allVoices.find((v) => v.default) || allVoices[0];
  }

  public speak(rawText: string, options?: SpeechHelperOptions) {
    if (!this.synth) return;

    // Clean text thoroughly before sending to browser TTS
    const cleanText = cleanTextForSpeech(rawText);
    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech to prevent overlapping noise
    try {
      this.synth.cancel();
    } catch (e) {
      console.warn("Synthesis cancel error:", e);
    }

    const personaId = options?.personaId || this.currentPersonaId;
    const profile = VOICE_PROFILES.find((p) => p.id === personaId) || VOICE_PROFILES[0];

    const pitch = options?.pitch ?? this.customPitch ?? profile.pitch;
    const rate = options?.rate ?? this.customRate ?? profile.rate;
    const chosenVoiceName = options?.voiceName || this.customVoiceName;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.7, Math.min(1.8, rate));
    utterance.pitch = Math.max(0.6, Math.min(1.8, pitch));

    const selectedVoice = this.pickBestVoice(cleanText, profile, chosenVoiceName || undefined);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = /[а-яёА-ЯЁ]/.test(cleanText) ? "ru-RU" : "en-US";
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("TTS Utterance error:", e);
      options?.onError?.(e);
    };

    // Small delay to ensure previous audio stream fully cleared
    setTimeout(() => {
      try {
        this.synth?.speak(utterance);
      } catch (err) {
        console.error("SpeechSynthesis speak failed:", err);
        options?.onError?.(err);
      }
    }, 40);
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn("Speech cancel error:", e);
      }
    }
  }
}

export const jarvisVoice = new JarvisVoiceSynthesizer();
