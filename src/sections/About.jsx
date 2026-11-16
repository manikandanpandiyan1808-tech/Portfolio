import {
  ArrowUpRight,
  Check,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { usePortfolio } from "../data/PortfolioProvider";

export function About() {
  const { profile, about } = usePortfolio();

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          eyebrow="About me"
          titleId="about-title"
          title={
            <>
              Building for the <span className="gradient-text">web</span>
            </>
          }
          description="A developer who cares about how things look, how they work, and how they feel to use."
        />

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="about-lead">{about.lead}</p>
            <p>{about.body}</p>
            <ul className="check-list">
              {about.highlights.map((item) => (
                <li key={item}>
                  <Check size={15} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <a className="text-link" href="#contact">
              Let&apos;s work together <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>

          <div className="about-bento">
            <Reveal className="bento-card bento-card--wide" delay={0.08}>
              <span className="bento-icon">
                <Sparkles size={18} />
              </span>
              <span className="bento-label">Currently</span>
              <strong>{about.currently.title}</strong>
              <p>{about.currently.description}</p>
              <div className="bento-pills">
                {about.currently.pills.map((pill) => (
                  <span key={pill}>{pill}</span>
                ))}
              </div>
            </Reveal>

            <Reveal className="bento-card" delay={0.14}>
              <span className="bento-icon">
                <MapPin size={17} />
              </span>
              <span className="bento-label">Based in</span>
              <strong>{profile.location}</strong>
              <p>Open to remote and on-site opportunities.</p>
            </Reveal>

            <Reveal className="bento-card" delay={0.2}>
              <span className="bento-icon">
                <GraduationCap size={17} />
              </span>
              <span className="bento-label">Learning</span>
              <strong>{about.learning.title}</strong>
              <p>{about.learning.description}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
