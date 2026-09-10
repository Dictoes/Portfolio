import { useState } from "react";
import projects from "../../data/projects.json";

const QUEST_REWARDS = {
  Stratagem: "TEAM GAME DEVELOPMENT XP",
  VaultByte: "ANDROID DEVELOPMENT XP",
  JNOTALY: "SOLO BUILD XP",
  Patutim: "GAME SYSTEMS XP",
  "Room Management System": "BACKEND DEVELOPMENT XP",
  "Book Management System": "DATABASE DEVELOPMENT XP",
  "GUI Calculator": "JAVA GUI XP",
  "GUI Vending Machine": "FIRST GUI QUEST XP",
  "Networking Projects": "NETWORKING XP",
};

function questMeta(project) {
  return {
    objective: project.description.split(".")[0],
    difficulty: project.technologies.length >= 3 ? "HARD" : "MEDIUM",
    reward: QUEST_REWARDS[project.name] || "DEVELOPER XP",
  };
}

function ProjectCard({ project }) {
  return (
    <article className="project-card rpg-panel" data-project={project.name}>
      <div className="project-card__body">
        <h3 className="project-card__name">{project.name}</h3>
      </div>
    </article>
  );
}

function ProjectDetail({ project, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(project.image) && !imageFailed;

  return (
    <div className="project-detail-backdrop" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <article className="project-detail rpg-panel" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
        <button className="project-detail__close" aria-label="Close project details" onClick={onClose}>×</button>
        <p className="project-detail__eyebrow">QUEST DETAIL</p>
        <h3 id="project-detail-title">{project.name}</h3>
        {hasImage && (
          <div className="project-detail__image">
            <img src={`/${project.image}`} alt={`${project.name} screenshot`} onError={() => setImageFailed(true)} />
          </div>
        )}
        <dl className="project-detail__quest-meta">
          <div><dt>OBJECTIVE</dt><dd>{questMeta(project).objective}</dd></div>
          <div><dt>DIFFICULTY</dt><dd>{questMeta(project).difficulty}</dd></div>
          <div><dt>REWARD</dt><dd>{questMeta(project).reward}</dd></div>
        </dl>
        <span className="project-card__status" data-status={project.status}>
          {project.status === "COMPLETED" ? "QUEST COMPLETE" : project.status}
        </span>
        <p>{project.description}</p>
        <h4>LANGUAGES &amp; TOOLS</h4>
        <div className="project-card__tags">{project.technologies.map((technology) => <span className="project-card__tag" key={technology}>{technology}</span>)}</div>
        <div className="project-card__links">
          {project.github && project.github !== "#" && <a className="pixel-btn pixel-btn--small" href={project.github} target="_blank" rel="noopener noreferrer">SOURCE CODE</a>}
          {project.demo && project.demo !== "#" && <a className="pixel-btn pixel-btn--small" href={project.demo} target="_blank" rel="noopener noreferrer">VIEW PROJECT</a>}
        </div>
      </article>
    </div>
  );
}

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <h2 className="screen-title">PROJECT DATABASE</h2>
      <p className="screen-subtitle">
        Select a project to inspect its details.
      </p>
      <div className="project-grid" id="project-grid">
        {projects.map((project, index) => (
          <div className="quest-entry" key={project.name}>
            <div className="quest-entry__number">QUEST #{String(index + 1).padStart(3, "0")}</div>
            <ProjectCard project={project} />
            <button className="pixel-btn pixel-btn--small quest-entry__inspect" onClick={() => setSelectedProject(project)}>
              INSPECT PROJECT
            </button>
          </div>
        ))}
      </div>
      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
