import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { CopyEmailButton } from "../components/CopyEmailButton";
import { Reveal } from "../components/Reveal";
import { usePortfolio } from "../data/PortfolioProvider";

const emptyForm = { name: "", email: "", message: "" };

export function Contact() {
  const { profile } = usePortfolio();
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio enquiry from ${form.name || "a visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <Reveal className="contact-card">
          <div className="contact-grid">
            <div className="contact-copy">
              <span className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                Have a project or opportunity?
              </span>
              <h2 id="contact-title">
                Let&apos;s build something{" "}
                <span className="gradient-text">great.</span>
              </h2>
              <p>
                I&apos;m open to entry-level developer roles, collaborations,
                and interesting projects. Tell me what you&apos;re working on —
                I&apos;d love to hear about it.
              </p>

              <div className="contact-actions">
                <a
                  className="button button-primary"
                  href={`mailto:${profile.email}`}
                >
                  Say hello <Mail size={17} aria-hidden="true" />
                </a>
                <CopyEmailButton />
              </div>

              <div className="contact-socials">
                {profile.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={17} aria-hidden="true" /> GitHub
                  </a>
                ) : null}
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size={17} aria-hidden="true" /> LinkedIn
                  </a>
                ) : null}
              </div>
            </div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              aria-label="Contact form"
              aria-describedby="form-note"
            >
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="What would you like to build?"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="button button-primary" type="submit">
                Send message <Send size={16} aria-hidden="true" />
              </button>
              <p className="form-note" id="form-note">
                This opens your email app with the message ready to send.
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
