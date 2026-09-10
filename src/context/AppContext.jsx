import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const AppContext = createContext(null);

const SOUND_FILES = {
  click: "/assets/sounds/click.mp3",
  hover: "/assets/sounds/hover.mp3",
  select: "/assets/sounds/select.mp3",
};

const TRANSITION_DURATION = 720;
const TRANSITION_SWAP_AT = 360;
const MUSIC_FILE = "/assets/audio/rpg-theme.mp3";
const MUSIC_VOLUME = 0.25;
const MUSIC_FADE_DURATION = 500;

export function AppProvider({ children }) {
  const [showTitle, setShowTitle] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("profile");
  const [muted, setMuted] = useState(() => {
    try {
      return window.localStorage.getItem("soundEnabled") === "false";
    } catch {
      return false;
    }
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [musicEnabled, setMusicEnabled] = useState(() => {
    try {
      return window.localStorage.getItem("musicEnabled") !== "false";
    } catch {
      return true;
    }
  });

  const soundCache = useRef({});
  const musicRef = useRef(null);
  const musicFadeRef = useRef(null);
  const mutedRef = useRef(muted);
  const reduceMotionRef = useRef(reduceMotion);
  const musicEnabledRef = useRef(musicEnabled);
  mutedRef.current = muted;
  reduceMotionRef.current = reduceMotion;
  musicEnabledRef.current = musicEnabled;

  useEffect(() => {
    document.body.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  const fadeMusic = useCallback((targetVolume, onComplete) => {
    const audio = musicRef.current;
    if (!audio) {
      onComplete?.();
      return;
    }
    if (musicFadeRef.current) window.clearInterval(musicFadeRef.current);
    const startVolume = audio.volume;
    const startedAt = performance.now();
    musicFadeRef.current = window.setInterval(() => {
      const progress = Math.min((performance.now() - startedAt) / MUSIC_FADE_DURATION, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;
      if (progress >= 1) {
        window.clearInterval(musicFadeRef.current);
        musicFadeRef.current = null;
        onComplete?.();
      }
    }, 30);
  }, []);

  const startMusic = useCallback(() => {
    if (!musicEnabledRef.current) return;
    if (!musicRef.current) {
      const audio = new Audio(MUSIC_FILE);
      audio.loop = true;
      audio.volume = 0;
      musicRef.current = audio;
    }
    const audio = musicRef.current;
    if (!audio.paused) return;
    audio.play()
      .then(() => fadeMusic(MUSIC_VOLUME))
      .catch(() => {});
  }, [fadeMusic]);

  const toggleMusic = useCallback(() => {
    const nextEnabled = !musicEnabledRef.current;
    musicEnabledRef.current = nextEnabled;
    setMusicEnabled(nextEnabled);
    try {
      window.localStorage.setItem("musicEnabled", String(nextEnabled));
    } catch {
      // The preference remains available for the current session.
    }
    if (nextEnabled) {
      startMusic();
      return;
    }
    fadeMusic(0, () => {
      musicRef.current?.pause();
    });
  }, [fadeMusic, startMusic]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const nextMuted = !current;
      try {
        window.localStorage.setItem("soundEnabled", String(!nextMuted));
      } catch {
        // The preference remains available for the current session.
      }
      return nextMuted;
    });
  }, []);

  useEffect(() => () => {
    if (musicFadeRef.current) window.clearInterval(musicFadeRef.current);
    musicRef.current?.pause();
  }, []);

  const playSound = useCallback((name) => {
    if (mutedRef.current || !name || !SOUND_FILES[name]) return;
    try {
      if (!soundCache.current[name]) {
        soundCache.current[name] = new Audio(SOUND_FILES[name]);
        soundCache.current[name].volume = 0.35;
      }
      const audio = soundCache.current[name].cloneNode();
      audio.volume = 0.35;
      // Fails silently if the file doesn't exist - that's fine.
      audio.play().catch(() => {});
    } catch (err) {
      /* Audio unsupported or file missing - safe to ignore. */
    }
  }, []);

  const playTransition = useCallback((callback) => {
    if (reduceMotionRef.current) {
      setTransitioning(true);
      window.setTimeout(callback, 45);
      window.setTimeout(() => setTransitioning(false), 180);
      return;
    }
    setTransitioning(true);
    window.setTimeout(() => {
      callback();
    }, TRANSITION_SWAP_AT);
    window.setTimeout(() => {
      setTransitioning(false);
    }, TRANSITION_DURATION);
  }, []);

  const showScreen = useCallback(
    (name) => {
      startMusic();
      playTransition(() => {
        setCurrentScreen(name);
        setAnnouncement(`${name} screen`);
      });
    },
    [playTransition, startMusic]
  );

  const enterPortfolio = useCallback(
    (targetScreen) => {
      startMusic();
      playTransition(() => {
        setShowTitle(false);
        setCurrentScreen(targetScreen || "profile");
      });
    },
    [playTransition, startMusic]
  );

  const returnToTitle = useCallback(() => {
    playTransition(() => {
      setShowTitle(true);
    });
  }, [playTransition]);

  const toggleReduceMotion = useCallback(() => setReduceMotion((r) => !r), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = {
    showTitle,
    currentScreen,
    muted,
    musicEnabled,
    reduceMotion,
    settingsOpen,
    transitioning,
    announcement,
    playSound,
    startMusic,
    toggleMusic,
    showScreen,
    enterPortfolio,
    returnToTitle,
    toggleMuted,
    toggleReduceMotion,
    openSettings,
    closeSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
