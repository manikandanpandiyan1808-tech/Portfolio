import { BackToTop } from "./components/BackToTop";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { TechMarquee } from "./components/TechMarquee";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";

export default function App() {
  return (
    <div className="portfolio">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="aurora aurora--one" aria-hidden="true" />
      <div className="aurora aurora--two" aria-hidden="true" />
      <div className="aurora aurora--three" aria-hidden="true" />

      <Navbar />

      <main id="main">
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
