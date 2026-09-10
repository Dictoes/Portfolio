# John Benedict B. Nacua — Developer Portfolio (Pixel RPG Edition, React)

This is a React + Vite refactor of the original plain HTML/CSS/JS pixel-art RPG
developer portfolio. Same look, same behavior, same data files — now built as
proper React components instead of hand-written DOM manipulation.

---

## 1. What changed from the original

- **Framework**: plain HTML/CSS/JS → **React 18 + Vite**.
- **Screens** (`Profile`, `Skills`, `Projects`, `Inventory`, `Quests`, `Contact`)
  are now components in `src/components/screens/`, instead of `innerHTML`
  string templates in `script.js`.
- **State** (current screen, mute, reduce-motion, settings modal, the door
  transition effect) lives in `src/context/AppContext.jsx`, a React Context +
  provider, instead of a single global `state` object plus manual DOM queries.
- **Data loading**: `skills.json`, `projects.json`, and `quests.json` are now
  imported directly as ES modules (`import skills from "../data/skills.json"`)
  instead of being fetched at runtime with `fetch()`. This means **the old
  "you must use Live Server, opening index.html directly won't work" limitation
  is gone** — Vite bundles the JSON at build time, so there's no `file://`
  CORS issue to work around, and no fallback data needed.
- **XSS-escaping helpers** (`escapeHTML` / `escapeAttr`) are gone — React
  escapes all text content by default.
- **Sound effects** are triggered directly from the relevant `onClick` /
  `onMouseEnter` handlers instead of a global `document` click/mouseover
  listener that looked for `data-sound` attributes.
- The pixel/stone visual design, all CSS, and all animations are carried
  over **unchanged** in `src/index.css`.

The folder structure, JSON schema, and everything described below in "how to
edit content" is otherwise identical to the original — if you've already
customized `data/skills.json` etc. from the original project, you can drop
those files straight into `src/data/`.

---

## 2. Folder structure

```
react-portfolio/
├── index.html                 <- Vite entry HTML (loads Google Fonts + src/main.jsx)
├── package.json
├── vite.config.js
├── README.md
│
├── public/
│   └── assets/
│       ├── profile.jpg        <- put your photo here (not included)
│       ├── favicon.png        <- optional, not included
│       ├── sounds/            <- optional UI sounds, not included
│       │   ├── click.mp3
│       │   ├── hover.mp3
│       │   └── select.mp3
│       └── projects/          <- optional project screenshots, not included
│
└── src/
    ├── main.jsx                     <- React root
    ├── App.jsx                      <- top-level component + keyboard shortcuts
    ├── index.css                    <- all styling (unchanged from the original)
    ├── context/
    │   └── AppContext.jsx           <- global app state (nav, sound, settings, transitions)
    ├── data/
    │   ├── skills.json
    │   ├── projects.json
    │   ├── quests.json
    │   └── inventory.js             <- fixed equipment list (was hardcoded in script.js)
    └── components/
        ├── TitleScreen.jsx
        ├── AppShell.jsx
        ├── Nav.jsx
        ├── SettingsModal.jsx
        ├── TransitionOverlay.jsx
        └── screens/
            ├── ProfileScreen.jsx
            ├── SkillsScreen.jsx
            ├── ProjectsScreen.jsx
            ├── InventoryScreen.jsx
            ├── QuestsScreen.jsx
            └── ContactScreen.jsx
```

---

## 3. Running it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # to test the production build locally
```

---

## 4. Where to put your picture

Save a **square** photo as:

```
public/assets/profile.jpg
```

No code changes needed. If the file isn't there, a pixel-art
`[ INSERT PHOTO ]` placeholder shows automatically (this is now handled by
React state in `ProfileScreen.jsx` via the image's `onError` handler, instead
of an inline `onerror=""` attribute).

---

## 5. How to change your name and info

Search the codebase for `[YOUR NAME]`. It appears in:

- `index.html` (`<title>`)
- `src/components/TitleScreen.jsx`
- `src/components/screens/ProfileScreen.jsx`
- `src/components/AppShell.jsx` (header)

Also update `[YOUR ROLE]` and `[YOUR LOCATION]` the same way, wherever you
find them.

The **LEVEL**, **CLASS**, and stat text in `ProfileScreen.jsx` are plain JSX —
edit the values directly.

---

## 6. How to change your skills / projects / quests

Same as the original — edit the JSON files in `src/data/`:

- `skills.json` — `level` (0–100) controls the skill bar fill; entries with
  `level >= 90` render as "unique" rarity, `>= 75` as "rare", otherwise
  "common". Add/remove/reorder entries freely.
- `projects.json` — `image` should point to a file in `public/assets/projects/`
  (referenced from the project root, e.g. `/assets/projects/myproject.png`).
  Leave `github`/`demo` as `"#"` to hide that link button. `status` of
  `"COMPLETED"` renders green, `"IN PROGRESS"` renders gold.
- `quests.json` — `status` must be `"completed"`, `"active"`, or `"locked"`.

No JavaScript editing required for any of the above — each screen rebuilds
itself from the JSON automatically.

To edit the fixed inventory/equipment list, edit `src/data/inventory.js`.

---

## 7. Controls

- **Mouse / touch:** click anything — nav buttons, title menu items, skill
  cards, inventory items.
- **Keyboard**, once inside the portfolio:
  - `1`–`6` → jump to Profile / Skills / Projects / Inventory / Quests / Contact
  - `Esc` → return to the Title screen
  - `M` → mute/unmute sound
- **Title screen:** press `Enter` to start, or use arrow keys to move the
  selection cursor.

---

## 8. Sound (optional)

The site is wired to play `public/assets/sounds/click.mp3`, `hover.mp3`, and
`select.mp3` on relevant interactions, but works fine with no sound files
present — missing audio fails silently. Drop your own short, royalty-free UI
sound effects into `public/assets/sounds/` using those exact filenames.

---

## 9. Customizing colors and fonts

All design tokens (colors, fonts, spacing) live at the top of `src/index.css`
under `:root { ... }`, exactly as in the original.
"# Portfolio" 
# Portfolio
