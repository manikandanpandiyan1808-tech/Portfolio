import { ExternalLink, Github } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { SpotlightCard } from "../components/SpotlightCard";
import { usePortfolio } from "../data/PortfolioProvider";

function ProjectPreview({ project }) {
  return (
    <div
      className={`project-preview preview--${project.accent}`}
      aria-hidden="true"
    >
      <div className="preview-chrome">
        <span />
        <span />
        <span />
        <span className="preview-url">{project.domain}</span>
      </div>
      <div className="preview-canvas">
        <div className="preview-sidebar">
          <span className="preview-logo" />
          <span className="preview-nav preview-nav--active" />
          <span className="preview-nav" />
          <span className="preview-nav" />
          <span className="preview-nav" />
        </div>
        <div className="preview-main">
          <div className="preview-topline">
            <span className="preview-pill" />
            <span className="preview-pill preview-pill--short" />
          </div>
          <div className="preview-cards">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-chart">
            <span style={{ height: "42%" }} />
            <span style={{ height: "68%" }} />
            <span style={{ height: "54%" }} />
            <span style={{ height: "82%" }} />
            <span style={{ height: "64%" }} />
            <span style={{ height: "92%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { projects } = usePortfolio();

  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Selected work"
          titleId="projects-title"
          title={
            <>
              Featured <span className="gradient-text">projects</span>
            </>
          }
          description="A few things I have designed and built — each one taught me something new."
        />

        <div className="projects-grid">
          {projects.map((project, index) => (
            <Reveal
              key={project.title}
              className={`project-reveal${
                index === 0 ? " project-reveal--featured" : ""
              }`}
              delay={index * 0.08}
            >
              <SpotlightCard
                as="article"
                className={`project-card${
                  index === 0 ? " project-card--featured" : ""
                }`}
              >
                <ProjectPreview project={project} />

                <div className="project-body">
                  <div className="project-meta">
                    <span className="project-type">{project.type}</span>
                    <span className="project-number">{project.number}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <ul className="project-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>

                  <div className="project-footer">
                    <div className="tag-list">
                      {project.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code`}
                        >
                          <Github size={17} />
                        </a>
                      ) : null}
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live demo`}
                        >
                          <ExternalLink size={17} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
