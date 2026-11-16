import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { navItems } from "../data/portfolio";
import { usePortfolio } from "../data/PortfolioProvider";

export function Footer() {
  const { profile } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#home">
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>
              {profile.name}
              <span className="brand-dot">.</span>
            </span>
          </a>
          <p>
            Full stack developer building thoughtful, performant web
            experiences.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="footer-meta">
          <div className="footer-socials">
            {profile.github ? (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Github size={16} />
              </a>
            ) : null}
            {profile.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={16} />
              </a>
            ) : null}
            {profile.email ? (
              <a href={`mailto:${profile.email}`} aria-label="Send an email">
                <Mail size={16} />
              </a>
            ) : null}
          </div>
          <p>
            © {year} {profile.name}. Built with React.
          </p>
          <a className="back-top" href="#home">
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
