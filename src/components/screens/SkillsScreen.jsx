import skills from "../../data/skills.json";

function rarityForLevel(level) {
  const n = Number(level) || 0;
  if (n >= 90) return "unique";
  if (n >= 75) return "rare";
  return "common";
}

export default function SkillsScreen() {
  return (
    <>
      <h2 className="screen-title">SKILL TREE</h2>
      <p className="screen-subtitle">
        Hover a card to inspect it. Data loaded from <code>data/skills.json</code>.
      </p>
      <div className="skill-grid" id="skill-grid">
        {skills.map((skill) => (
          <article
            className="skill-card rpg-panel"
            data-rarity={rarityForLevel(skill.level)}
            tabIndex={0}
            key={skill.name}
          >
            {skill.icon && <span className={`skill-card__icon skill-card__icon--${skill.icon}`} aria-hidden="true"></span>}
            <h3 className="skill-card__name">[ {skill.name} ]</h3>
            <p className="skill-card__category">{skill.category}</p>
            <div className="skill-card__track">
              <div
                className="skill-card__fill"
                style={{ "--value": `${Number(skill.level) || 0}%` }}
              ></div>
            </div>
            <p className="skill-card__desc">{skill.description || ""}</p>
          </article>
        ))}
      </div>
    </>
  );
}
