import { Check, Download } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { usePortfolio } from "../data/PortfolioProvider";

const strengths = [
  "Full stack thinking — UI, API, and data",
  "Comfortable picking up new tools quickly",
  "Clear communication and steady delivery",
];

export function Experience() {
  const { experience, profile } = usePortfolio();

  return (
    <section
      id="experience"
      className="section"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="My journey"
          titleId="experience-title"
          title={
            <>
              Experience &amp; <span className="gradient-text">growth</span>
            </>
          }
          description="A short timeline of the experiences shaping how I build."
        />

        <div className="experience-grid">
          <div className="timeline">
            {experience.map((entry, index) => (
              <Reveal
                key={`${entry.title}-${entry.date}`}
                className="timeline-item"
                delay={index * 0.08}
              >
                <span className="timeline-dot" aria-hidden="true" />
                <div className="timeline-card">
                  <div className="timeline-top">
                    <span className="timeline-date">{entry.date}</span>
                    <span className="timeline-meta">{entry.meta}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <h4>{entry.org}</h4>
                  <p>{entry.description}</p>
                  <div className="tag-list">
                    {entry.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="experience-aside" delay={0.12}>
            <div className="aside-card">
              <span className="bento-label">What I bring</span>
              <h3>Ready to contribute from day one</h3>
              <ul className="check-list">
                {strengths.map((strength) => (
                  <li key={strength}>
                    <Check size={15} aria-hidden="true" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {profile.resume ? (
              <a
                className="button button-secondary"
                href={profile.resume}
                download
              >
                Download résumé <Download size={16} aria-hidden="true" />
              </a>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
