import { useApp } from "../context/AppContext.jsx";

export default function MusicToggle({ className = "" }) {
  const { musicEnabled, toggleMusic } = useApp();
  const label = musicEnabled ? "MUSIC ON" : "MUSIC OFF";

  return (
    <button
      type="button"
      className={`music-toggle ${className}`.trim()}
      aria-pressed={musicEnabled}
      aria-label={label}
      title={label}
      onClick={toggleMusic}
    >
      <span aria-hidden="true">♫</span>
      <span>{label}</span>
    </button>
  );
}
