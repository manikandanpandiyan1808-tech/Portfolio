import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Atom,
  Database,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Server,
  Zap,
} from "lucide-react";
import { usePortfolio } from "../data/PortfolioProvider";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const { profile, stats } = usePortfolio();
  const roleWords = profile.role.split(" ");
  const roleAccent = roleWords.pop();
  const roleLead = roleWords.join(" ");

  return (
    <section id="home" className="hero container" aria-labelledby="hero-title">
      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="availability" variants={item}>
          <span className="status-dot" aria-hidden="true" />
          {profile.availability}
        </motion.div>

        <motion.p className="hero-kicker" variants={item}>
          <span aria-hidden="true">👋</span> Hi, I&apos;m{" "}
          <strong>{profile.name}</strong>
        </motion.p>

        <motion.h1 id="hero-title" variants={item}>
          {roleLead}
          <br />
          <span className="gradient-text">{roleAccent}</span>
        </motion.h1>

        <motion.p className="hero-lead" variants={item}>
          {profile.heroLead}
        </motion.p>

        <motion.div className="hero-actions" variants={item}>
          <a className="button button-primary" href="#projects">
            View my work <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="#contact">
            Get in touch <Mail size={16} aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div className="hero-socials" variants={item}>
          {profile.github ? (
            <a
              className="social-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <Github size={18} />
            </a>
          ) : null}
          {profile.linkedin ? (
            <a
              className="social-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={18} />
            </a>
          ) : null}
          {profile.email ? (
            <a
              className="social-link"
              href={`mailto:${profile.email}`}
              aria-label="Send an email"
            >
              <Mail size={18} />
            </a>
          ) : null}
        </motion.div>

        <motion.div className="hero-stats" variants={item}>
          {stats.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <div className="hero-halo" />

        <div className="hero-profile">
          <div className="profile-top">
            <div className="profile-avatar" aria-hidden="true">
              {profile.name.charAt(0)}
            </div>
            <div className="profile-identity">
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>
            <span className="profile-location">
              <MapPin size={12} aria-hidden="true" />
              {profile.location}
            </span>
          </div>

          <p className="profile-bio">
            I build end-to-end products — polished interfaces on the front,
            reliable APIs and databases behind them.
          </p>

          <div className="profile-stack">
            <span className="profile-label">Core stack</span>
            <div className="profile-chips">
              <span>
                <Atom size={14} aria-hidden="true" /> React &amp; Next.js
              </span>
              <span>
                <Server size={14} aria-hidden="true" /> Node.js
              </span>
              <span>
                <Database size={14} aria-hidden="true" /> PostgreSQL
              </span>
            </div>
          </div>

          <div className="profile-footer">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability}
            <span className="profile-footer-code">UTC +5:30</span>
          </div>

          <div className="profile-terminal">
            <span className="code-prompt">❯</span>
            npm run build
            <span className="code-success">✓ ready in 0.8s</span>
          </div>
        </div>

        <div className="float-card float-card--one">
          <span className="float-icon">
            <Atom size={17} />
          </span>
          <div>
            <strong>React &amp; Next.js</strong>
            <span>Modern frontend</span>
          </div>
        </div>

        <div className="float-card float-card--two">
          <span className="float-icon">
            <Zap size={17} />
          </span>
          <div>
            <strong>Fast by default</strong>
            <span>Performance first</span>
          </div>
        </div>
      </motion.div>

      <a href="#about" className="scroll-cue">
        <ArrowDown size={14} aria-hidden="true" /> Scroll to explore
      </a>
    </section>
  );
}
