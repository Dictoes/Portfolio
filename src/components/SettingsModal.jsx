import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function SettingsModal() {
  const {
    settingsOpen,
    closeSettings,
    muted,
    toggleMuted,
    musicEnabled,
    toggleMusic,
    reduceMotion,
    toggleReduceMotion,
    playSound,
  } = useApp();
    useApp();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (settingsOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeSettings();
  }

  function handleClose() {
    playSound("click");
    closeSettings();
  }

  return (
    <div id="settings-modal" className="modal" onClick={handleBackdropClick}>
      <div className="modal__panel rpg-panel">
        <h3 className="modal__title">SETTINGS</h3>
        <div className="modal__row">
          <span>SOUND EFFECTS</span>
          <button id="settings-mute-btn" className="pixel-btn pixel-btn--small" onClick={toggleMuted}>
            {muted ? "OFF" : "ON"}
          </button>
        </div>
        <div className="modal__row">
          <span>MUSIC</span>
          <button id="settings-music-btn" className="pixel-btn pixel-btn--small" onClick={toggleMusic}>
            {musicEnabled ? "ON" : "OFF"}
          </button>
        </div>
        <div className="modal__row">
          <span>REDUCE MOTION</span>
          <button id="settings-motion-btn" className="pixel-btn pixel-btn--small" onClick={toggleReduceMotion}>
            {reduceMotion ? "ON" : "OFF"}
          </button>
        </div>
        <button id="settings-close" className="pixel-btn" ref={closeBtnRef} onClick={handleClose}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
