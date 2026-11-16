import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems } from "../data/portfolio";
import { usePortfolio } from "../data/PortfolioProvider";
import { useScrollSpy } from "../hooks/useScrollSpy";

const sectionIds = ["home", ...navItems.map((item) => item.id)];

export function Navbar() {
  const { profile } = usePortfolio();
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 821px)");
    const onChange = (event) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <a className="brand" href="#home" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>
              {profile.name}
              <span className="brand-dot">.</span>
            </span>
          </a>

          <nav
            id="primary-nav"
            className={`nav-links${open ? " is-open" : ""}`}
            aria-label="Primary"
          >
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "is-active" : undefined}
                aria-current={active === id ? "location" : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            ))}
            <a className="nav-cta" href="#contact" onClick={closeMenu}>
              Let&apos;s talk
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <motion.span
          className="scroll-progress"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </header>

      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}
    </>
  );
}
