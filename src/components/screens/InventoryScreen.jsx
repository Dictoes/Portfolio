import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import skills from "../../data/skills.json";
import projects from "../../data/projects.json";
import { INVENTORY_ITEMS } from "../../data/inventory.js";

const BRANCHES = [
  { key: "web", label: "WEB DEVELOPMENT", tone: "cyan", skills: ["HTML", "CSS", "JAVASCRIPT", "PHP / MYSQL"] },
  { key: "application", label: "APPLICATIONS & GAMES", tone: "purple", skills: ["JAVA / KOTLIN", "LIBGDX", "C"] },
  { key: "design", label: "CREATIVE ARTS", tone: "gold", skills: ["FIGMA", "CANVA", "FILMORA"] },
  { key: "systems", label: "SYSTEMS & NETWORKS", tone: "blue", skills: ["PC HARDWARE", "NETWORK CABLING"] },
  { key: "tools", label: "TOOLS & WORKFLOW", tone: "cyan", skills: ["VS CODE", "GIT", "SQL"] },
];

const TREE_POSITIONS = {
  DEVELOPER: [396, 30],
  HTML: [210, 330],
  CSS: [210, 455],
  JAVASCRIPT: [210, 580],
  "PHP / MYSQL": [210, 705],
  SQL: [380, 705],
  FIGMA: [40, 455],
  CANVA: [40, 580],
  FILMORA: [40, 705],
  C: [380, 580],
  "JAVA / KOTLIN": [600, 330],
  KOTLIN: [600, 455],
  LIBGDX: [600, 580],
  "PC HARDWARE": [780, 330],
  "NETWORK CABLING": [780, 455],
  "VS CODE": [780, 580],
  GIT: [780, 705],
};

const LEFT_TREE_CONNECTIONS = [
  ["DEVELOPER", "HTML"],
  ["HTML", "CSS"],
  ["CSS", "JAVASCRIPT"],
  ["CSS", "FIGMA"],
  ["FIGMA", "CANVA"],
  ["CANVA", "FILMORA"],
  ["JAVASCRIPT", "PHP / MYSQL"],
  ["PHP / MYSQL", "SQL"],
  ["JAVASCRIPT", "C"],
];

const RIGHT_TREE_CONNECTIONS = [
  ["DEVELOPER", "JAVA / KOTLIN"],
  ["JAVA / KOTLIN", "KOTLIN"],
  ["KOTLIN", "LIBGDX"],
  ["JAVA / KOTLIN", "PC HARDWARE"],
  ["PC HARDWARE", "NETWORK CABLING"],
  ["NETWORK CABLING", "VS CODE"],
  ["VS CODE", "GIT"],
];

const TREE_BRANCH_LABELS = [
  { label: "WEB", left: 164, top: 295 },
  { label: "APPLICATIONS", left: 548, top: 295 },
  { label: "SYSTEMS", left: 748, top: 295 },
  { label: "DESIGN", left: 18, top: 416 },
  { label: "TOOLS", left: 742, top: 548 },
];

const INVENTORY_CATEGORIES = ["ALL", "LANGUAGES", "FRAMEWORKS", "DESIGN", "TOOLS"];
const MIN_TREE_ZOOM = 0.7;
const MAX_TREE_ZOOM = 2;
const TREE_ZOOM_STEP = 0.1;

function connectionIsActive(from, to, selectedName) {
  return from === selectedName || to === selectedName;
}

function connectorPath(from, to) {
  const [x1, y1] = TREE_POSITIONS[from];
  const [x2, y2] = TREE_POSITIONS[to];
  const startX = x1 + 59;
  const startY = y1 + 59;
  const endX = x2 + 59;
  const endY = y2 + 59;

  if (startX === endX || startY === endY) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  const midpointY = Math.round((startY + endY) / 2);
  return `M ${startX} ${startY} V ${midpointY} H ${endX} V ${endY}`;
}

const RELATED_TECHNOLOGY = {
  HTML: ["HTML", "JavaScript", "CSS"],
  CSS: ["HTML", "JavaScript"],
  JAVASCRIPT: ["HTML", "CSS", "PHP / MySQL"],
  "PHP / MYSQL": ["JavaScript", "SQL"],
  "JAVA / KOTLIN": ["Java", "Kotlin", "Android"],
  LIBGDX: ["Java", "2D game development"],
  C: ["Procedural programming", "Algorithms"],
  FIGMA: ["UI/UX", "Visual layout"],
  CANVA: ["Typography", "Graphic design"],
  FILMORA: ["Video editing", "Motion and audio"],
  "PC HARDWARE": ["Desktop assembly", "Troubleshooting"],
  "NETWORK CABLING": ["Ethernet", "RJ45", "Packet Tracer"],
};

const SKILL_PROGRESSION = {
  DEVELOPER: { state: "ROOT UNLOCKED", next: "HTML + JAVA / KOTLIN" },
  HTML: { state: "UNLOCKED", next: "CSS" },
  CSS: { state: "UNLOCKED", next: "JAVASCRIPT" },
  JAVASCRIPT: { state: "UNLOCKED", next: "PHP / MYSQL + C" },
  "PHP / MYSQL": { state: "UNLOCKED", next: "SQL" },
  SQL: { state: "UNLOCKED", next: "DATABASE QUESTS" },
  FIGMA: { state: "UNLOCKED", next: "CANVA" },
  CANVA: { state: "UNLOCKED", next: "FILMORA" },
  FILMORA: { state: "UNLOCKED", next: "CREATIVE QUESTS" },
  C: { state: "UNLOCKED", next: "ALGORITHMS" },
  "JAVA / KOTLIN": { state: "UNLOCKED", next: "KOTLIN + ANDROID" },
  KOTLIN: { state: "UNLOCKED", next: "LIBGDX" },
  LIBGDX: { state: "UNLOCKED", next: "2D GAME QUESTS" },
  "PC HARDWARE": { state: "UNLOCKED", next: "NETWORK CABLING" },
  "NETWORK CABLING": { state: "UNLOCKED", next: "VS CODE" },
  "VS CODE": { state: "UNLOCKED", next: "GIT" },
  GIT: { state: "UNLOCKED", next: "ADVANCED WORKFLOW" },
};

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findSkill(name) {
  if (name === "DEVELOPER") {
    return {
      name: "John Benedict B. Nacua",
      category: "Aspiring Software Developer",
      level: 100,
      experience: "LV. 21 DEVELOPER",
      description: "A developer journey built through curiosity, hands-on experience, and continuous growth.",
      verse: "Philippians 4:13",
    };
  }

  const skillName = name;
  const existingSkill = skills.find((skill) => skill.name === skillName);
  if (existingSkill) return existingSkill;
  const inventorySkill = INVENTORY_ITEMS.find((item) => normalize(item.label) === normalize(skillName));
  return {
    name: skillName,
    category: "Tools & workflow",
    level: 60,
    description: inventorySkill?.desc || "A progression node on my developer journey.",
  };
}

function getIcon(name) {
  const item = INVENTORY_ITEMS.find((entry) => normalize(entry.label) === normalize(name));
  return item?.icon || "◈";
}

function projectsForSkill(skillName) {
  const aliases = {
    "JAVA / KOTLIN": ["java", "kotlin"],
    "PHP / MYSQL": ["php", "mysql"],
    "PC HARDWARE": ["hardware"],
    "NETWORK CABLING": ["cisco", "packet tracer"],
  };
  const terms = aliases[skillName] || [skillName];
  return projects
    .filter((project) => project.technologies.some((technology) => terms.some((term) => normalize(technology).includes(normalize(term)))))
    .map((project) => project.name);
}

export default function InventoryScreen() {
  const { currentScreen, reduceMotion, playSound, showScreen } = useApp();
  const [selectedName, setSelectedName] = useState("HTML");
  const [detailOpen, setDetailOpen] = useState(false);
  const [inventoryCategory, setInventoryCategory] = useState("ALL");
  const [treeZoom, setTreeZoom] = useState(1);
  const [isDraggingTree, setIsDraggingTree] = useState(false);
  const treeMapRef = useRef(null);
  const dragStateRef = useRef({ active: false, moved: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
  const selectedSkill = useMemo(() => findSkill(selectedName), [selectedName]);
  const selectedProjects = useMemo(() => projectsForSkill(selectedName), [selectedName]);
  const selectedProgression = SKILL_PROGRESSION[selectedName] || { state: "UNLOCKED", next: "NEXT QUEST" };
  const visibleInventory = useMemo(
    () => inventoryCategory === "ALL"
      ? INVENTORY_ITEMS
      : INVENTORY_ITEMS.filter((item) => item.category === inventoryCategory),
    [inventoryCategory]
  );

  useEffect(() => {
    document.body.classList.toggle("skill-tree-open", currentScreen === "inventory");
    return () => document.body.classList.remove("skill-tree-open");
  }, [currentScreen]);

  function selectSkill(name) {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }
    setSelectedName(name);
    setDetailOpen(true);
    playSound("select");
  }

  function startTreeDrag(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    const map = treeMapRef.current;
    if (!map) return;
    dragStateRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: map.scrollLeft,
      scrollTop: map.scrollTop,
    };
    if (map.setPointerCapture) map.setPointerCapture(event.pointerId);
    setIsDraggingTree(true);
  }

  function moveTreeDrag(event) {
    const map = treeMapRef.current;
    const drag = dragStateRef.current;
    if (!map || !drag.active) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) drag.moved = true;
    if (!drag.moved) return;
    map.scrollLeft = drag.scrollLeft - deltaX;
    map.scrollTop = drag.scrollTop - deltaY;
    event.preventDefault();
  }

  function endTreeDrag(event) {
    const map = treeMapRef.current;
    if (map?.hasPointerCapture?.(event.pointerId)) map.releasePointerCapture(event.pointerId);
    dragStateRef.current.active = false;
    setIsDraggingTree(false);
  }

  function changeTreeZoom(amount) {
    setTreeZoom((currentZoom) => Math.min(MAX_TREE_ZOOM, Math.max(MIN_TREE_ZOOM, Number((currentZoom + amount).toFixed(1)))));
  }

  return (
    <div className={`skill-tree${reduceMotion ? " skill-tree--reduced" : ""}`}>
      <header className="skill-tree__header">
        <div>
          <p className="skill-tree__eyebrow">CHARACTER PROGRESSION</p>
          <h2 className="screen-title">MY SKILL TREE</h2>
          <p className="screen-subtitle">Follow each path to see how my skills build on one another.</p>
        </div>
        <div className="skill-tree__points" aria-label="Skill points">
          <span>SKILL POINTS</span>
          <strong>∞</strong>
          <button type="button" className="skill-tree__close" onClick={() => showScreen("profile")}>CLOSE</button>
        </div>
      </header>

      <div className="skill-tree__instruction"><strong>DEVELOPER PROGRESSION</strong><span>Select a node to inspect its path and details.</span></div>

      <div className="skill-tree__workspace">
        <section
          className={`skill-tree-map${isDraggingTree ? " is-dragging" : ""}`}
          aria-label="Interactive developer skill tree. Drag to navigate."
          ref={treeMapRef}
          onPointerDown={startTreeDrag}
          onPointerMove={moveTreeDrag}
          onPointerUp={endTreeDrag}
          onPointerCancel={endTreeDrag}
          onPointerLeave={(event) => {
            if (dragStateRef.current.active) moveTreeDrag(event);
          }}
        >
          <div className="skill-tree-zoom" aria-label="Skill tree zoom controls">
            <span>ZOOM</span>
            <button type="button" onClick={() => changeTreeZoom(-TREE_ZOOM_STEP)} aria-label="Zoom out">-</button>
            <output>{Math.round(treeZoom * 100)}%</output>
            <button type="button" onClick={() => changeTreeZoom(TREE_ZOOM_STEP)} aria-label="Zoom in">+</button>
            <button type="button" className="skill-tree-zoom__reset" onClick={() => setTreeZoom(1)}>RESET</button>
          </div>
          <div className="skill-tree-canvas" style={{ "--tree-zoom": treeZoom }}>
            <svg className="skill-tree-lines skill-tree-lines--left" viewBox="0 0 910 830" aria-hidden="true">
              {LEFT_TREE_CONNECTIONS.map(([from, to]) => {
                return (
                  <path className={connectionIsActive(from, to, selectedName) ? "is-active" : ""} key={`${from}-${to}`} d={connectorPath(from, to)} />
                );
              })}
            </svg>
            <svg className="skill-tree-lines skill-tree-lines--right" viewBox="0 0 910 830" aria-hidden="true">
              {RIGHT_TREE_CONNECTIONS.map(([from, to]) => (
                <path className={connectionIsActive(from, to, selectedName) ? "is-active" : ""} key={`${from}-${to}`} d={connectorPath(from, to)} />
              ))}
            </svg>
            {TREE_BRANCH_LABELS.map(({ label, left, top }) => (
              <span className="skill-tree-branch-label" style={{ left, top }} key={label}>{label}</span>
            ))}
            {Object.entries(TREE_POSITIONS).map(([name, [left, top]]) => {
              const skill = findSkill(name);
              const label = name;
              const selected = selectedName === name;
              return (
                <button
                  type="button"
                  className={`skill-node${selected ? " is-selected" : ""}`}
                  key={name}
                  style={{ left, top }}
                  data-node={name}
                  aria-pressed={selected}
                  aria-label={`${label}: ${skill.category}, level ${skill.level}`}
                  title={skill.description}
                  onClick={() => selectSkill(name)}
                >
                  <span className="skill-node__icon" aria-hidden="true">{getIcon(name)}</span>
                  <span className="skill-node__name">{label}</span>
                  <span className="skill-node__level">LV {Math.max(1, Math.round((Number(skill.level) || 0) / 20))}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className={`skill-detail rpg-panel${detailOpen ? " is-open" : ""}`} aria-live="polite">
          <button type="button" className="skill-detail__close" onClick={() => setDetailOpen(false)} aria-label="Close selected ability">
            [ X ]
          </button>
          <p className="skill-detail__eyebrow">SELECTED ABILITY</p>
          <div className="skill-detail__icon" aria-hidden="true">{getIcon(selectedSkill.name)}</div>
          <h3>{selectedSkill.name}</h3>
          <p className="skill-detail__category">{selectedSkill.category}</p>
          {selectedSkill.experience && <p className="skill-detail__experience">{selectedSkill.experience}</p>}
          {selectedSkill.verse && <p className="skill-detail__verse">{selectedSkill.verse}</p>}
          <div className="skill-detail__progress">
            <span>EXPERIENCE</span>
            <strong>{Math.max(1, Math.round((Number(selectedSkill.level) || 0) / 20))} / 5</strong>
            <div><i style={{ width: `${Number(selectedSkill.level) || 0}%` }} /></div>
          </div>
          <div className="skill-detail__unlock">
            <span>PATH STATUS</span>
            <strong>{selectedProgression.state}</strong>
            <small>NEXT UNLOCK: {selectedProgression.next}</small>
          </div>
          <p className="skill-detail__description">{selectedSkill.description}</p>
          <div className="skill-detail__section">
            <span>RELATED TECHNOLOGY</span>
            <div className="skill-detail__tags">
              {(RELATED_TECHNOLOGY[selectedSkill.name] || [selectedSkill.category]).map((technology) => (
                <b key={technology}>{technology}</b>
              ))}
            </div>
          </div>
          <div className="skill-detail__section">
            <span>QUESTS USING THIS SKILL</span>
            {selectedProjects.length > 0 ? (
              <ul>{selectedProjects.map((project) => <li key={project}>{project}</li>)}</ul>
            ) : (
              <p className="skill-detail__empty">No linked quest recorded yet.</p>
            )}
          </div>
        </aside>
      </div>

      <section className="inventory-loadout" aria-labelledby="inventory-loadout-title">
        <div className="inventory-loadout__heading">
          <div>
            <p className="skill-tree__eyebrow">EQUIPPED LOADOUT</p>
            <h3 id="inventory-loadout-title">INVENTORY</h3>
          </div>
          <span>{visibleInventory.length} ITEMS</span>
        </div>
        <div className="inventory-loadout__filters" role="group" aria-label="Inventory categories">
          {INVENTORY_CATEGORIES.map((category) => (
            <button
              type="button"
              className={`inventory-loadout__filter${inventoryCategory === category ? " is-active" : ""}`}
              aria-pressed={inventoryCategory === category}
              onClick={() => setInventoryCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="inventory-grid">
          {visibleInventory.map((item) => (
            <button
              type="button"
              className="inventory-item"
              data-rarity={item.rarity.toLowerCase()}
              onClick={() => selectSkill(item.label)}
              key={item.label}
              title={item.desc}
            >
              <span className="inventory-item__icon" aria-hidden="true">{item.icon}</span>
              <span className="inventory-item__label">{item.label}</span>
              <small>{item.exp}</small>
            </button>
          ))}
        </div>
      </section>

      <footer className="skill-tree__legend" aria-label="Skill tree legend">
        <span><i className="legend-dot legend-dot--main" /> ROOT</span>
        <span><i className="legend-dot legend-dot--related" /> SKILL PATH</span>
        <span><i className="legend-dot legend-dot--technology" /> SELECTED PATH</span>
      </footer>
    </div>
  );
}
