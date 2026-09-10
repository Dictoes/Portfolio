import { useApp } from "../context/AppContext.jsx";

export default function TransitionOverlay() {
  const { transitioning } = useApp();

  return (
    <div
      id="transition-overlay"
      className={`transition-overlay${transitioning ? " is-active" : ""}`}
      aria-hidden="true"
    >
      <div className="transition-door transition-door--left"></div>
      <div className="transition-door transition-door--right"></div>
    </div>
  );
}
