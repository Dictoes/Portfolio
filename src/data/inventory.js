// Static inventory list — kept in JS (not JSON) since it's a fixed set
// of tools/technologies rather than user-editable profile content.
export const INVENTORY_ITEMS = [
  { icon: "◧", label: "HTML", category: "LANGUAGES", rarity: "COMMON", exp: "HIGH", desc: "Web Structure" },
  { icon: "◨", label: "CSS", category: "LANGUAGES", rarity: "COMMON", exp: "HIGH", desc: "Interface Design" },
  { icon: "◩", label: "JS", category: "LANGUAGES", rarity: "UNCOMMON", exp: "HIGH", desc: "Interactive Systems" },
  { icon: "▣", label: "VS CODE", category: "TOOLS", rarity: "RARE", exp: "DAILY USE", desc: "Primary code editor" },
  { icon: "◈", label: "GIT", category: "TOOLS", rarity: "UNCOMMON", exp: "HIGH", desc: "Version control system" },
  { icon: "▤", label: "SQL", category: "LANGUAGES", rarity: "RARE", exp: "MEDIUM", desc: "Relational database queries" },
  { icon: "◪", label: "KOTLIN", category: "LANGUAGES", rarity: "RARE", exp: "MEDIUM", desc: "Android app development" },
  { icon: "▥", label: "PHP", category: "LANGUAGES", rarity: "UNCOMMON", exp: "MEDIUM", desc: "Server-side scripting" },
  { icon: "◫", label: "LIBGDX", category: "FRAMEWORKS", rarity: "EPIC", exp: "MEDIUM", desc: "2D game framework" },
  { icon: "◇", label: "FIGMA", category: "DESIGN", rarity: "UNCOMMON", exp: "MEDIUM", desc: "UI/UX and interface design" },
  { icon: "✦", label: "CANVA", category: "DESIGN", rarity: "UNCOMMON", exp: "MEDIUM", desc: "Graphic and visual design" },
  { icon: "▶", label: "FILMORA", category: "DESIGN", rarity: "UNCOMMON", exp: "MEDIUM", desc: "Video editing" },
  { icon: "</>", label: "C", category: "LANGUAGES", rarity: "COMMON", exp: "MEDIUM", desc: "Procedural programming" },
];
