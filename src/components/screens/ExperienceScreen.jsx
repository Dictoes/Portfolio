const EXPERIENCE_ITEMS = [
  {
    title: "TECHNICAL OPERATIONS OFFICER - (2026-2027)",
    description: "Serve on the Committee of Technical Operations for the Computer Students' Society (CSS), a school organization under the Information Technology department. I support the organization's technical operations, coordinate technology-related activities, and help deliver projects that improve students' IT experience.",
    status: "ONGOING QUEST",
  },
  {
    title: "GOOGLE DEVELOPER GROUPS ON CAMPUS CIT-U (2026-2027)",
    description: "Member of Google Developer Groups on Campus CIT-U, a student community that connects learners and developers through technology, knowledge sharing, and collaborative activities.",
  },
  {
    title: "OUTSTANDING STUDENT - (2022-2024)",
    description: "Recognized as an outstanding student during my academic years. This award reflects my academic performance, consistent effort, and commitment to growth throughout 2022-2024.",
    section: "honors",
  },
  {
    title: "RESEARCH LEADER - (2022-2024)",
    description: "Led a research group during my academic years by organizing tasks, reviewing our work, keeping the project on schedule, and preparing the team for presentation. I presented and defended our research before a panel specific to our school, working with standards and expectations different from those used by other schools.",
  },
  {
    title: "IT WORK IMMERSION & PC BUILDING",
    description: "Completed 280 hours of work immersion at Ragomez Computer Trading & Build PC, assembling and troubleshooting desktop hardware, working with Ethernet networking, and assisting customers with practical computer needs.",
  },
  {
    title: "JAVA CERTIFICATION",
    description: "Passed my Java Certification with a 91% score. Strengthened my programming knowledge and gained greater confidence working with Java.",
  },
  {
    title: "PC ASSEMBLY & HARDWARE",
    description: "Built a complete PC from scratch. Gained practical experience in assembling computer hardware and understanding how its components work together.",
  },
  {
    title: "NETWORK CABLING",
    description: "Learned and performed Ethernet cable crimping and termination, gaining hands-on experience with physical network connections and basic networking.",
  },
  {
    title: "TEAM GAME DEVELOPMENT",
    description: "Co-developed Stratagen, a 2D strategy game. Worked with the development team and contributed to the game's code while gaining experience in collaborative software development.",
  },
  {
    title: "SOLO SOFTWARE DEVELOPMENT",
    description: "Independently built Jnotaly, transforming engineering review notes into an interactive reviewer and quiz platform for studying and self-testing.",
  },
  {
    title: "FIRST JAVA GUI DEVELOPMENT",
    description: "Built a GUI-based vending machine in Java during Grade 11. Applied programming concepts to create a functional interactive application.",
  },
  {
    title: "UI/UX DESIGN & FIGMA",
    description: "Gained hands-on experience designing interfaces and visual layouts using Figma. Practiced creating clean, organized, and user-friendly designs while developing an eye for UI/UX.",
    tools: ["Figma"],
  },
  {
    title: "GRAPHIC DESIGN & CANVA",
    description: "Gained experience creating and editing visual content using Canva. Worked with layouts, typography, graphics, and visual elements to create clean and engaging designs.",
    tools: ["Canva"],
  },
  {
    title: "VIDEO EDITING & FILMORA",
    description: "Gained hands-on experience editing videos using Filmora. Worked with video clips, transitions, text, effects, audio, and overall presentation to create polished video content.",
    tools: ["Filmora"],
  },
];

function ExperienceEntry({ item, number }) {
  return (
    <li className={`experience-journal__item rpg-panel${number == null ? " experience-journal__item--no-number" : ""}`} key={item.title}>
      {number != null && <span className="experience-journal__marker" aria-hidden="true">{String(number).padStart(2, "0")}</span>}
      <span className={`experience-journal__status${item.status === "ONGOING QUEST" ? " experience-journal__status--ongoing" : ""}`}>
        {item.status || "QUEST COMPLETE"}
      </span>
      <h3 className="experience-journal__title">{item.title}</h3>
      <p>{item.description}</p>
      {item.tools && (
        <div className="project-card__tags" aria-label="Tools used">
          {item.tools.map((tool) => <span className="project-card__tag" key={tool}>{tool}</span>)}
        </div>
      )}
    </li>
  );
}

export default function ExperienceScreen() {
  const numberedItems = EXPERIENCE_ITEMS.map((item, index) => ({ item, number: index + 1 }));
  const experienceItems = numberedItems.filter(({ item }) => item.section !== "honors");
  const honorItems = numberedItems.filter(({ item }) => item.section === "honors");

  return (
    <>
      <h2 className="screen-title">EXPERIENCE JOURNAL</h2>
      <p className="screen-subtitle">A record of hands-on learning, milestones, and work completed along the journey.</p>
      <ol className="experience-journal" aria-label="Experience quests">
        {experienceItems.map(({ item }, index) => <ExperienceEntry item={item} number={index + 1} key={item.title} />)}
      </ol>
      <section className="experience-section" aria-labelledby="honors-heading">
        <h3 className="experience-section__title" id="honors-heading">HONORS &amp; AWARDS</h3>
        <ol className="experience-journal" aria-label="Honors and awards">
          {honorItems.map(({ item }) => <ExperienceEntry item={item} number={null} key={item.title} />)}
        </ol>
      </section>
    </>
  );
}
