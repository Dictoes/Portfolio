import { useApp } from "../context/AppContext.jsx";

const NAV_ITEMS = [
  { target: "profile", label: "INTRODUCTION" },
  { target: "quests", label: "EXPERIENCE" },
  { target: "projects", label: "PROJECTS" },
  { target: "inventory", label: "SKILLS" },
  { target: "contact", label: "CONTACT" },
];

export default function Nav() {
  const { currentScreen, showScreen, openSettings, playSound } = useApp();

  return (
    <nav className="app-nav" aria-label="Portfolio sections">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.target}
          className={`app-nav__item${currentScreen === item.target ? " is-active" : ""}`}
          data-target={item.target}
          onMouseEnter={() => playSound("hover")}
          onClick={() => showScreen(item.target)}
        >
          <span>{item.label}</span>
        </button>
      ))}
      <button
        className="app-nav__item app-nav__item--settings"
        data-action="settings"
        onMouseEnter={() => playSound("hover")}
        onClick={openSettings}
      >
        SETTINGS
      </button>
    </nav>
  );
}
