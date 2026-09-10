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
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(project.image);
  const showBrokenImage = hasImage && imageFailed;
  const meta = questMeta(project);

  return (
    <article className="project-card rpg-panel" data-project={project.name}>
      {hasImage && (
        <div className="project-card__image" data-empty={showBrokenImage ? "1" : undefined}>
          {!imageFailed && (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              onError={() => setImageFailed(true)}
            />
          )}
          <span className="project-card__image-fallback">
            {project.name}
            <br />
            [ NO IMAGE ]
          </span>
        </div>
      )}
      <div className="project-card__body">
        <h3 className="project-card__name">{project.name}</h3>
        <p className="project-card__desc">{project.description || ""}</p>
        <dl className="project-card__quest-meta">
          <div><dt>OBJECTIVE</dt><dd>{meta.objective}</dd></div>
          <div><dt>DIFFICULTY</dt><dd>{meta.difficulty}</dd></div>
          <div><dt>REWARD</dt><dd>{meta.reward}</dd></div>
        </dl>
        <div className="project-card__tags">
          {(project.technologies || []).map((t) => (
            <span className="project-card__tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <span className="project-card__status" data-status={project.status || ""}>
          {project.status === "COMPLETED" ? "QUEST COMPLETE" : project.status || "UNKNOWN"}
        </span>
        <div className="project-card__links">
          {project.github && project.github !== "#" && (
            <a className="pixel-btn pixel-btn--small" href={project.github} target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
          )}
          {project.demo && project.demo !== "#" && (
            <a className="pixel-btn pixel-btn--small" href={project.demo} target="_blank" rel="noopener noreferrer">
              DEMO
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <h2 className="screen-title">PROJECT DATABASE</h2>
      <p className="screen-subtitle">
        Data loaded from <code>data/projects.json</code>.
      </p>
      <div className="project-grid" id="project-grid">
        {projects.map((project, index) => (
          <div className="quest-entry" key={project.name}>
            <div className="quest-entry__number">QUEST #{String(index + 1).padStart(3, "0")}</div>
            <ProjectCard project={project} />
            <button className="pixel-btn pixel-btn--small quest-entry__inspect" onClick={() => setSelectedProject(project)}>
              INSPECT QUEST
            </button>
          </div>
        ))}
      </div>
      {selectedProject && (
        <div className="project-detail-backdrop" role="presentation" onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}>
          <article className="project-detail rpg-panel" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
            <button className="project-detail__close" aria-label="Close project details" onClick={() => setSelectedProject(null)}>×</button>
            <p className="project-detail__eyebrow">QUEST DETAIL</p>
            <h3 id="project-detail-title">{selectedProject.name}</h3>
            <dl className="project-detail__quest-meta">
              <div><dt>OBJECTIVE</dt><dd>{questMeta(selectedProject).objective}</dd></div>
              <div><dt>DIFFICULTY</dt><dd>{questMeta(selectedProject).difficulty}</dd></div>
              <div><dt>REWARD</dt><dd>{questMeta(selectedProject).reward}</dd></div>
            </dl>
            <span className="project-card__status" data-status={selectedProject.status}>
              {selectedProject.status === "COMPLETED" ? "QUEST COMPLETE" : selectedProject.status}
            </span>
            <p>{selectedProject.description}</p>
            <h4>TECHNOLOGIES</h4>
            <div className="project-card__tags">{selectedProject.technologies.map((technology) => <span className="project-card__tag" key={technology}>{technology}</span>)}</div>
            <div className="project-card__links">
              {selectedProject.github && selectedProject.github !== "#" && <a className="pixel-btn pixel-btn--small" href={selectedProject.github} target="_blank" rel="noopener noreferrer">SOURCE CODE</a>}
              {selectedProject.demo && selectedProject.demo !== "#" && <a className="pixel-btn pixel-btn--small" href={selectedProject.demo} target="_blank" rel="noopener noreferrer">VIEW PROJECT</a>}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
