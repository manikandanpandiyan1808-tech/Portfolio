import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { SpotlightCard } from "../components/SpotlightCard";
import { usePortfolio } from "../data/PortfolioProvider";

export function Skills() {
  const { skills } = usePortfolio();

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          eyebrow="What I work with"
          titleId="skills-title"
          title={
            <>
              My <span className="gradient-text">skills</span>
            </>
          }
          description="The technologies and tools I use to take ideas from a blank canvas to a working product."
        />

        <div className="skills-grid">
          {skills.map(({ title, icon: Icon, description, items }, index) => (
            <Reveal
              key={title}
              className="skill-reveal"
              delay={index * 0.06}
            >
              <SpotlightCard className="skill-card">
                <div className="skill-head">
                  <span className="skill-icon">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="skill-index">
                    0{index + 1}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tag-list">
                  {items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
