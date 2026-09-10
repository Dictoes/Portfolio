import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import TitleScreen from "./components/TitleScreen.jsx";
import AppShell from "./components/AppShell.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import TransitionOverlay from "./components/TransitionOverlay.jsx";

const BOOT_LINES = [
  "INITIALIZING PORTFOLIO...",
  "LOADING CHARACTER DATA...",
  "LOADING QUEST LOG...",
  "LOADING PROJECT ARCHIVE...",
  "LOADING SKILL INVENTORY...",
  "SYSTEM READY.",
];

const KEY_TO_SCREEN = {
  1: "profile",
  2: "quests",
  3: "projects",
  4: "inventory",
  5: "contact",
};

const TITLE_MENU_LENGTH = 6;
const TITLE_SCREENS = ["profile", "profile", "quests", "projects", "inventory", "contact"];

function Shell() {
  const { showTitle, settingsOpen, showScreen, enterPortfolio, returnToTitle, toggleMuted, closeSettings } =
    useApp();
  const [titleIndex, setTitleIndex] = useState(0);
  const [booting, setBooting] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio-booted") !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!booting) return undefined;
    const timer = window.setTimeout(() => {
      setBooting(false);
      try {
        sessionStorage.setItem("portfolio-booted", "1");
      } catch {
        // Session storage may be unavailable; the boot still completes.
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [booting]);

  useEffect(() => {
    function handleKeydown(e) {
      const target = e.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (isTypingTarget) return;

      if (showTitle) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enterPortfolio(TITLE_SCREENS[titleIndex]);
        } else if (e.key === "ArrowDown") {
          setTitleIndex((i) => (i + 1) % TITLE_MENU_LENGTH);
        } else if (e.key === "ArrowUp") {
          setTitleIndex((i) => (i - 1 + TITLE_MENU_LENGTH) % TITLE_MENU_LENGTH);
        }
        return;
      }

      if (settingsOpen) {
        if (e.key === "Escape") closeSettings();
        return;
      }

      if (e.key === "Escape") {
        returnToTitle();
      } else if (KEY_TO_SCREEN[e.key]) {
        showScreen(KEY_TO_SCREEN[e.key]);
      } else if (e.key.toLowerCase() === "m") {
        toggleMuted();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [showTitle, settingsOpen, titleIndex, showScreen, enterPortfolio, returnToTitle, toggleMuted, closeSettings]);

  return (
    <>
      <div className="crt-overlay" aria-hidden="true"></div>

      <TitleScreen titleIndex={titleIndex} setTitleIndex={setTitleIndex} />
      {booting && <BootOverlay />}
      <AppShell />
      <SettingsModal />
      <TransitionOverlay />

      <Announcer />
    </>
  );
}

function BootOverlay() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLineIndex((index) => Math.min(index + 1, BOOT_LINES.length - 1));
    }, 240);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="boot-overlay" role="status" aria-live="polite">
      <div className="boot-overlay__panel">
        {BOOT_LINES.slice(0, lineIndex + 1).map((line) => (
          <p key={line}>{line}</p>
        ))}
        <span className="boot-overlay__cursor" aria-hidden="true">_</span>
      </div>
    </div>
  );
}

function Announcer() {
  const { announcement } = useApp();
  return (
    <div id="a11y-announcer" className="sr-only" aria-live="polite">
      {announcement}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
