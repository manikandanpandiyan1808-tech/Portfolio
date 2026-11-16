import {
  Cloud,
  Code2,
  Database,
  Layout,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import portfolioData from "../../data/portfolio.json";

/**
 * All portfolio content is stored in data/portfolio.json.
 * Edit it through the admin dashboard at /admin, or by hand.
 */
export const defaultPortfolio = portfolioData;

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const skillIcons = {
  layout: Layout,
  server: Server,
  database: Database,
  wrench: Wrench,
  code: Code2,
  cloud: Cloud,
  shield: ShieldCheck,
  palette: Palette,
  rocket: Rocket,
  sparkles: Sparkles,
};

export const skillIconOptions = Object.keys(skillIcons);

/**
 * JSON stores icon names; the UI needs components. This keeps the data
 * serialisable for the API while the components stay reusable.
 */
export function withSkillIcons(data) {
  return {
    ...data,
    skills: (data.skills ?? []).map((skill) => ({
      ...skill,
      icon: skillIcons[skill.icon] ?? Layout,
    })),
  };
}
