import quests from "../../data/quests.json";

const QUEST_MARKERS = { completed: "[✓]", active: "[!]", locked: "[?]" };

export default function QuestsScreen() {
  return (
    <>
      <h2 className="screen-title">QUEST LOG</h2>
      <p className="screen-subtitle">
        Education, experience &amp; milestones. Data loaded from <code>data/quests.json</code>.
      </p>
      <ul className="quest-list" id="quest-list">
        {quests.map((quest, i) => (
          <li className="quest-item" data-status={quest.status} key={i}>
            <span className="quest-item__marker">{QUEST_MARKERS[quest.status] || "[ ]"}</span>
            <span className="quest-item__text">{quest.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
