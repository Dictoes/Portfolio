import { useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import MusicToggle from "./MusicToggle.jsx";

const LOCATIONS = [
  { action: "profile", label: "START JOURNEY" },
  { action: "profile", label: "VIEW PROFILE" },
  { action: "quests", label: "EXPERIENCE" },
  { action: "projects", label: "PROJECTS" },
  { action: "inventory", label: "SKILLS" },
  { action: "contact", label: "CONTACT" },
];

export default function TitleScreen({ titleIndex, setTitleIndex }) {
  const { showTitle, muted, playSound, enterPortfolio, toggleMuted } = useApp();

  function handleAction(action) {
    playSound("select");
    enterPortfolio(action);
  }

  // Keep titleIndex in range if the menu ever changes length.
  useEffect(() => {
    if (titleIndex >= LOCATIONS.length) setTitleIndex(0);
  }, [titleIndex, setTitleIndex]);

  return (
    <section
      id="screen-title"
      className={`screen screen--active${showTitle ? "" : " screen--hidden"}`}
      data-screen="title"
    >
      <div className="stars" aria-hidden="true"></div>
      <div className="title-frame">
        <p className="title-eyebrow">DEVELOPER PORTFOLIO :: V1.0</p>
        <h1 className="title-name">John Benedict B. Nacua</h1>
        <p className="title-role">Aspiring Software Developer</p>

        <nav className="title-menu" aria-label="Portfolio main menu">
          {LOCATIONS.map((item, i) => (
            <button
              key={item.label}
              className={`title-menu__item${i === titleIndex ? " is-selected" : ""}`}
              data-action={item.action}
              onMouseEnter={() => {
                setTitleIndex(i);
                playSound("hover");
              }}
              onClick={() => handleAction(item.action)}
            >
              <span className="cursor" aria-hidden="true">&gt;</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <p className="title-hint">PRESS ENTER OR SPACE TO SELECT</p>
      </div>

      <button
        id="mute-toggle"
        className="icon-btn"
        aria-pressed={muted}
        title="Toggle sound"
        onClick={toggleMuted}
      >
        <span className={`sound-icon${muted ? " is-muted" : ""}`} aria-hidden="true"></span>
      </button>
      <MusicToggle className="music-toggle--title" />
    </section>
  );
}
