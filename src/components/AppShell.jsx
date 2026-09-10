import { useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import Nav from "./Nav.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SkillsScreen from "./screens/SkillsScreen.jsx";
import ProjectsScreen from "./screens/ProjectsScreen.jsx";
import InventoryScreen from "./screens/InventoryScreen.jsx";
import ExperienceScreen from "./screens/ExperienceScreen.jsx";
import ContactScreen from "./screens/ContactScreen.jsx";
import MusicToggle from "./MusicToggle.jsx";

const ACTIVE_QUESTS = {
  profile: "Explore the developer's journey",
  skills: "Review the skill archive",
  projects: "Inspect completed project quests",
  inventory: "Unlock the skill paths",
  quests: "Review experience milestones",
  contact: "Establish communication",
};

export default function AppShell() {
  const { showTitle, currentScreen, reduceMotion } = useApp();

  useEffect(() => {
    const appMain = document.getElementById("app-main");
    if (appMain) {
      appMain.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [currentScreen, reduceMotion]);

  function screenClass(name) {
    return `screen${currentScreen === name ? " screen--active" : ""}`;
  }

  return (
    <div id="app-shell" className="app-shell" hidden={showTitle}>
      <header className="app-header">
        <div>
          <span className="app-header__eyebrow">MY DEVELOPER JOURNEY</span>
          <span className="app-header__title">PORTFOLIO OVERWORLD</span>
        </div>
        <div className="app-header__quest" aria-live="polite">
          <span>ACTIVE QUEST</span>
          <strong>{ACTIVE_QUESTS[currentScreen] || ACTIVE_QUESTS.profile}</strong>
        </div>
        <div className="app-header__actions">
          <MusicToggle />
          <span className="app-header__level">LV. 21 DEVELOPER</span>
        </div>
      </header>

      <main className="app-main" id="app-main">
        <section className={screenClass("profile")} data-screen="profile" id="screen-profile">
          <ProfileScreen />
        </section>
        <section className={screenClass("skills")} data-screen="skills" id="screen-skills">
          <SkillsScreen />
        </section>
        <section className={screenClass("projects")} data-screen="projects" id="screen-projects">
          <ProjectsScreen />
        </section>
        <section className={screenClass("inventory")} data-screen="inventory" id="screen-inventory">
          <InventoryScreen />
        </section>
        <section className={screenClass("quests")} data-screen="quests" id="screen-experience">
          <ExperienceScreen />
        </section>
        <section className={screenClass("contact")} data-screen="contact" id="screen-contact">
          <ContactScreen />
        </section>
      </main>

      <Nav />

      <p className="controls-hint">KEYS: 1-5 SECTIONS &middot; ESC TITLE &middot; M MUTE</p>
    </div>
  );
}
