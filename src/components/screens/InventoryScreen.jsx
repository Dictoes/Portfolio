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

const CORE_TREE_CONNECTIONS = [
  ["DEVELOPER", "HTML"],
  ["HTML", "CSS"],
  ["CSS", "JAVASCRIPT"],
  ["JAVASCRIPT", "JAVA / KOTLIN"],
  ["JAVA / KOTLIN", "LIBGDX"],
  ["DEVELOPER", "C"],
  ["C", "SQL"],
  ["SQL", "GIT"],
];
const TREE_CONNECTIONS = CORE_TREE_CONNECTIONS;
const TREE_NODE_SIZE = 118;
const MIN_HORIZONTAL_TREE_WIDTH = 1040;
const HORIZONTAL_TREE_HEIGHT = 500;

const INVENTORY_CATEGORIES = ["ALL", "LANGUAGES", "FRAMEWORKS", "DESIGN", "TOOLS"];
const MIN_TREE_ZOOM = 0.7;
const MAX_TREE_ZOOM = 2;
const TREE_ZOOM_STEP = 0.1;

function getPathEdges(selectedName) {
  const parentByNode = Object.fromEntries(TREE_CONNECTIONS.map(([from, to]) => [to, from]));
  const edges = [];
  let current = selectedName;

  while (parentByNode[current]) {
    const parent = parentByNode[current];
    edges.unshift(`${parent}-${current}`);
    current = parent;
  }

  return edges;
}

function getDescendantEdges(selectedName) {
  if (!selectedName || selectedName === "DEVELOPER") return [];
  const descendants = new Set([selectedName]);
  const edges = [];
  let expanded = true;

  while (expanded) {
    expanded = false;
    CORE_TREE_CONNECTIONS.forEach(([from, to]) => {
      if (descendants.has(from)) {
        edges.push(`${from}-${to}`);
        if (!descendants.has(to)) {
          descendants.add(to);
          expanded = true;
        }
      }
    });
  }

  return edges;
}

function getHoverEdges(skillName) {
  if (!skillName) return [];
  if (skillName === "DEVELOPER") return TREE_CONNECTIONS.map(([from, to]) => `${from}-${to}`);

  const upperSkills = new Set(["HTML", "CSS", "JAVASCRIPT", "JAVA / KOTLIN", "LIBGDX"]);
  const branch = CORE_TREE_CONNECTIONS.filter(([from, to]) =>
    upperSkills.has(skillName) ? upperSkills.has(from) || upperSkills.has(to) : !upperSkills.has(from) && !upperSkills.has(to)
  );
  const branchEdges = new Set(branch.map(([from, to]) => `${from}-${to}`));
  const parentByNode = Object.fromEntries(branch.map(([from, to]) => [to, from]));
  const related = [];
  let current = skillName;

  while (parentByNode[current]) {
    const parent = parentByNode[current];
    related.unshift(`${parent}-${current}`);
    current = parent;
  }

  branch.forEach(([from, to]) => {
    if (from === skillName || related.some((edge) => edge.endsWith(`-${from}`))) {
      const edge = `${from}-${to}`;
      if (branchEdges.has(edge)) related.push(edge);
    }
  });

  return [...new Set(related)];
}

function connectorPath(from, to, positions, orientation = "vertical") {
  const [x1, y1] = positions[from];
  const [x2, y2] = positions[to];
  const startX = x1 + TREE_NODE_SIZE / 2;
  const startY = y1 + TREE_NODE_SIZE / 2;
  const endX = x2 + TREE_NODE_SIZE / 2;
  const endY = y2 + TREE_NODE_SIZE / 2;

  if (startX === endX || startY === endY) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  if (orientation === "horizontal") {
    const midpointX = Math.round((startX + endX) / 2);
    return `M ${startX} ${startY} H ${midpointX} V ${endY} H ${endX}`;
  }

  const midpointY = Math.round((startY + endY) / 2);
  return `M ${startX} ${startY} V ${midpointY} H ${endX} V ${endY}`;
}

function createTreeLayout(width) {
  const canvasWidth = Math.max(MIN_HORIZONTAL_TREE_WIDTH, width);
  const xScale = (canvasWidth - 170) / 820;
  const point = (x, y) => [24 + x * xScale, y];
  const treeOne = {
    connections: CORE_TREE_CONNECTIONS.slice(0, 5),
    positions: {
      DEVELOPER: point(0, 194),
      HTML: point(155, 171),
      CSS: point(320, 171),
      JAVASCRIPT: point(485, 171),
      "JAVA / KOTLIN": point(650, 171),
      LIBGDX: point(815, 171),
    },
    labels: [
      { label: "CORE WEB & APPLICATION DEVELOPMENT", left: point(155, 136)[0], top: 138 },
    ],
  };
  const treeTwo = {
    connections: CORE_TREE_CONNECTIONS.slice(5),
    positions: {
      DEVELOPER: point(0, 356),
      C: point(275, 333),
      SQL: point(550, 333),
      GIT: point(815, 333),
    },
    labels: [
      { label: "SYSTEMS & DATA", left: point(275, 298)[0], top: 300 },
    ],
  };
  const positions = {
    ...treeOne.positions,
    ...treeTwo.positions,
    DEVELOPER: point(0, 250),
  };
  return {
    width: canvasWidth,
    height: HORIZONTAL_TREE_HEIGHT,
    orientation: "horizontal",
    positions,
    trees: [
      { ...treeOne, positions, nodePositions: { ...treeOne.positions, DEVELOPER: positions.DEVELOPER } },
      { ...treeTwo, positions, nodePositions: treeTwo.positions },
    ],
  };
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
  const [treeWidth, setTreeWidth] = useState(910);
  const [pathAnimationKey, setPathAnimationKey] = useState(0);
  const [hoveredName, setHoveredName] = useState(null);
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
  const treeLayout = useMemo(() => createTreeLayout(treeWidth), [treeWidth]);
  const activePath = useMemo(() => getPathEdges(selectedName), [selectedName]);
  const closedPath = useMemo(() => getDescendantEdges(selectedName), [selectedName]);
  const hoveredPath = useMemo(() => getHoverEdges(hoveredName), [hoveredName]);
  const hoveredNodes = useMemo(
    () => new Set(hoveredPath.flatMap((edge) => edge.split("-"))),
    [hoveredPath]
  );

  useEffect(() => {
    document.body.classList.toggle("skill-tree-open", currentScreen === "inventory");
    return () => document.body.classList.remove("skill-tree-open");
  }, [currentScreen]);

  useEffect(() => {
    const map = treeMapRef.current;
    if (!map) return undefined;
    const updateWidth = () => {
      const availableWidth = map.parentElement?.clientWidth || map.clientWidth;
      setTreeWidth(Math.max(320, availableWidth - 8));
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(map.parentElement || map);
    return () => observer.disconnect();
  }, []);

  function selectSkill(name) {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }
    setSelectedName(name);
    setPathAnimationKey((key) => key + 1);
    setDetailOpen(true);
    playSound("select");
  }

  function startTreeDrag(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button")) {
      dragStateRef.current.moved = false;
      return;
    }
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

      <div className={`skill-tree__workspace${detailOpen ? " is-detail-open" : ""}`}>
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
          <div
            className="skill-tree-canvas"
            style={{ "--tree-zoom": treeZoom, width: treeLayout.width, height: treeLayout.height }}
          >
            {treeLayout.trees.map((tree, treeIndex) => (
              <div className="skill-tree-lane" key={`tree-${treeIndex}`}>
                <svg
                  className="skill-tree-lines"
                  viewBox={`0 0 ${treeLayout.width} ${treeLayout.height}`}
                  aria-hidden="true"
                  key={`${pathAnimationKey}-${treeIndex}`}
                >
                  {tree.connections.map(([from, to], connectionIndex) => {
                    const edge = `${from}-${to}`;
                    const pathIndex = activePath.indexOf(edge);
                    const isHovered = hoveredPath.includes(edge);
                    const isClosed = closedPath.includes(edge) && pathIndex < 0;
                    return (
                      <path
                        className={`${pathIndex >= 0 ? "is-active " : ""}${isHovered ? "is-hovered " : ""}${isClosed ? "is-closed" : ""}`}
                        style={pathIndex >= 0 ? { "--path-delay": `${pathIndex * 160}ms` } : undefined}
                        pathLength="1"
                        key={`${edge}-${treeIndex}`}
                        d={connectorPath(from, to, tree.positions, treeLayout.orientation)}
                        data-connection={connectionIndex}
                      />
                    );
                  })}
                </svg>
                {tree.labels.map(({ label, left, top }) => (
                  <span className="skill-tree-branch-label" style={{ left, top }} key={`${label}-${treeIndex}`}>{label}</span>
                ))}
                {Object.entries(tree.nodePositions)
                  .filter(([name]) => treeIndex === 0 || name !== "DEVELOPER")
                  .map(([name, [left, top]]) => {
                  const skill = findSkill(name);
                  const selected = selectedName === name;
                  return (
                    <button
                      type="button"
                      className={`skill-node${selected ? " is-selected" : ""}${hoveredName === name ? " is-hovered" : ""}${hoveredNodes.has(name) ? " is-hover-related" : ""}`}
                      key={`${name}-${treeIndex}`}
                      style={{ left, top }}
                      data-node={name}
                      data-hovered={hoveredNodes.has(name) || undefined}
                      aria-pressed={selected}
                      aria-label={`${name}: ${skill.category}, level ${skill.level}`}
                      title={skill.description}
                      onClick={() => selectSkill(name)}
                      onMouseEnter={() => setHoveredName(name)}
                      onMouseLeave={() => setHoveredName(null)}
                    >
                      <span className="skill-node__icon" aria-hidden="true">{getIcon(name)}</span>
                      <span className="skill-node__name">{name}</span>
                      <span className="skill-node__level">LV {Math.max(1, Math.round((Number(skill.level) || 0) / 20))}</span>
                    </button>
                  );
                })}
              </div>
            ))}
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
