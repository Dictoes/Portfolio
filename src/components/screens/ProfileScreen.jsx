import { useState } from "react";

const ACHIEVEMENTS = [
  { icon: "★", title: "OUTSTANDING STUDENT", detail: "Academic achievement · 2022-2024" },
  { icon: "◆", title: "RESEARCH LEADER", detail: "Research leadership · 2022-2024" },
  { icon: "⚙", title: "TECHNICAL OPERATIONS", detail: "CSS · 2026-2027" },
  { icon: "⌘", title: "JAVA CERTIFICATION", detail: "EXCEPTIONAL PERFORMANCE · PROGRAMMING RANK" },
  { icon: "✦", title: "280-HOUR IMMERSION", detail: "PC building and technical support" },
];

export default function ProfileScreen() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [scrollClosing, setScrollClosing] = useState(false);

  function closeScroll() {
    setScrollClosing(true);
    window.setTimeout(() => {
      setScrollOpen(false);
      setScrollClosing(false);
    }, 700);
  }

  return (
    <>
      <h2 className="screen-title">DEVELOPER&apos;S JOURNEY</h2>

      <section className="character-profile">
        <div className="character-profile__top">
          <div className="profile-photo-frame">
            <div className="profile-photo-frame__inner">
              {!photoFailed ? (
                <img
                  src="/assets/profile.jpg"
                  alt="Developer profile"
                  className="profile-photo"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <span className="profile-photo-placeholder__icon" aria-hidden="true"></span>
                  <strong>YOUR PHOTO</strong>
                  <span>Replace /assets/profile.jpg</span>
                </div>
              )}
            </div>
          </div>

          <section className="profile-status rpg-panel" aria-label="Developer character status">
            <div className="profile-status__heading">
              <p className="introduction-dialogue__eyebrow">CHARACTER STATUS</p>
              <h3>John Benedict B. Nacua</h3>
            </div>
            <div className="profile-status__resources" aria-label="Character resources">
              <div className="profile-resource profile-resource--hp">
                <div className="profile-resource__label">
                  <span className="profile-resource__icon" aria-hidden="true">♥</span>
                  <span>Health</span>
                  <strong>100 / 100</strong>
                </div>
                <div className="profile-resource__bar" role="progressbar" aria-label="Health points" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                  <span className="profile-resource__fill"></span>
                </div>
              </div>
              <div className="profile-resource profile-resource--mp">
                <div className="profile-resource__label">
                  <span className="profile-resource__icon" aria-hidden="true">⚡</span>
                  <span>Stamina</span>
                  <strong>75 / 100</strong>
                </div>
                <div className="profile-resource__bar" role="progressbar" aria-label="Stamina points" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                  <span className="profile-resource__fill"></span>
                </div>
              </div>
            </div>
            <dl className="profile-status__grid">
              <div>
                <dt>CLASS</dt>
                <dd>SOFTWARE DEVELOPER</dd>
              </div>
              <div>
                <dt>LEVEL(Age)</dt>
                <dd>21</dd>
              </div>
              <div>
                <dt>EXPERIENCE</dt>
                <dd>2+ YEARS CODING</dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>Minglanilla, Cebu</dd>
              </div>
              <div>
                <dt>GWA</dt>
                <dd>4.2</dd>
              </div>
              <div className="profile-status__school">
                <dt>SCHOOL</dt>
                <dd>Cebu Institute of Technology - University</dd>
              </div>
              <div className="profile-status__wide">
              </div>
            </dl>
          </section>
        </div>

        <section className={`story-scroll${scrollOpen ? " story-scroll--open" : ""}${scrollClosing ? " story-scroll--closing" : ""}`}>
          {!scrollOpen ? (
            <button
              type="button"
              className="story-scroll__closed"
              aria-label="Open introduction scroll"
              onClick={() => setScrollOpen(true)}
            >
              <span className="story-scroll__roll story-scroll__roll--top" aria-hidden="true"></span>
              <span className="story-scroll__closed-title">INTRODUCTION</span>
              <span className="story-scroll__prompt">[ CLICK TO OPEN ]</span>
              <span className="story-scroll__roll story-scroll__roll--bottom" aria-hidden="true"></span>
            </button>
          ) : (
            <div className="story-scroll__open">
              <span className="story-scroll__roll story-scroll__roll--top" aria-hidden="true"></span>
              <article className="introduction-dialogue">
                <p className="introduction-dialogue__eyebrow">A NEW CHAPTER BEGINS</p>
                <h3>WELCOME TO MY PORTFOLIO.</h3>
                <p className="introduction-dialogue__body">
                  I’m an aspiring software developer who enjoys learning through hands-on experience and turning challenges into opportunities to grow.
                </p>
                <p className="introduction-dialogue__body">
                  I’m someone who values curiosity, problem-solving, and continuous improvement. Every experience has helped me become more adaptable, persistent, and confident in taking on new challenges.
                </p>
                <p className="introduction-dialogue__body">
                  As I continue developing my skills, I also make use of modern AI tools to speed up development, explore ideas, solve problems, and bring useful features to life.
                </p>
                <p className="introduction-dialogue__body">
                  I’ve learned how to write effective prompts and clearly communicate the features and results I want, using AI as a development partner while still understanding, refining, and implementing the solutions myself.
                </p>
                <p className="introduction-dialogue__body">
                  For me, technology is not just about writing code. It’s about learning how different tools can work together to turn an idea into something useful.
                </p>
                <p className="introduction-dialogue__body">
                  I’m always looking forward to the next challenge, the next thing to learn, and the opportunity to grow along the way.
                </p>
                <button type="button" className="story-scroll__close" onClick={closeScroll} disabled={scrollClosing}>
                  CLOSE SCROLL
                </button>
              </article>
              <span className="story-scroll__roll story-scroll__roll--bottom" aria-hidden="true"></span>
            </div>
          )}
        </section>
      </section>

      <section className="achievement-board" aria-labelledby="achievement-board-title">
        <div className="achievement-board__heading">
          <div>
            <p className="introduction-dialogue__eyebrow">UNLOCKED MILESTONES</p>
            <h3 id="achievement-board-title">ACHIEVEMENTS</h3>
          </div>
          <span>{ACHIEVEMENTS.length} UNLOCKED</span>
        </div>
        <div className="achievement-board__grid">
          {ACHIEVEMENTS.map((achievement) => (
            <article className="achievement-badge" key={achievement.title}>
              <span className="achievement-badge__icon" aria-hidden="true">{achievement.icon}</span>
              <strong>{achievement.title}</strong>
              <small>{achievement.detail}</small>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
