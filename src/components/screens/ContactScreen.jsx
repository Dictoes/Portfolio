import { useApp } from "../../context/AppContext.jsx";

export default function ContactScreen() {
  const { showScreen, playSound } = useApp();

  return (
    <>
      <h2 className="screen-title">COMMUNICATION TERMINAL</h2>
      <div className="terminal rpg-panel">
        <div className="terminal-line">
          <span className="terminal-line__label">EMAIL</span>
          <span className="terminal-line__value">[ johnbenedictbucao2@gmail.com ]</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-line__label">GITHUB</span>
          <span className="terminal-line__value">[ https://github.com/Dictoes ]</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-line__label">LINKEDIN</span>
          <span className="terminal-line__value">[ linkedin.com/in/username ]</span>
        </div>

        <div className="terminal-actions">
          <a
            className="pixel-btn"
            id="btn-send-message"
            href="mailto:johnbenedictbucao2@gmail.com"
            onClick={() => playSound("click")}
          >
            SEND MESSAGE
          </a>
          <a
            className="pixel-btn"
            id="btn-open-github"
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound("click")}
          >
            OPEN GITHUB
          </a>
          <a
            className="pixel-btn"
            id="btn-open-linkedin"
            href="https://linkedin.com/in/username"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound("click")}
          >
            OPEN LINKEDIN
          </a>
          <button
            className="pixel-btn pixel-btn--ghost"
            data-action="return"
            onClick={() => {
              playSound("click");
              showScreen("profile");
            }}
          >
            RETURN
          </button>
        </div>
      </div>
    </>
  );
}
