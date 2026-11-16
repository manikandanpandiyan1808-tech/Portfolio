import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultPortfolio, withSkillIcons } from "./portfolio";

const PortfolioContext = createContext(null);

function mergeWithDefaults(data) {
  return withSkillIcons({
    ...defaultPortfolio,
    ...data,
    profile: { ...defaultPortfolio.profile, ...(data.profile ?? {}) },
    about: {
      ...defaultPortfolio.about,
      ...(data.about ?? {}),
      currently: {
        ...defaultPortfolio.about.currently,
        ...(data.about?.currently ?? {}),
      },
      learning: {
        ...defaultPortfolio.about.learning,
        ...(data.about?.learning ?? {}),
      },
    },
    stats: Array.isArray(data.stats) ? data.stats : defaultPortfolio.stats,
    marqueeItems: Array.isArray(data.marqueeItems)
      ? data.marqueeItems
      : defaultPortfolio.marqueeItems,
    skills: Array.isArray(data.skills) ? data.skills : defaultPortfolio.skills,
    projects: Array.isArray(data.projects)
      ? data.projects
      : defaultPortfolio.projects,
    experience: Array.isArray(data.experience)
      ? data.experience
      : defaultPortfolio.experience,
  });
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => mergeWithDefaults(defaultPortfolio));
  const [status, setStatus] = useState("loading");
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = requestId.current + 1;
    requestId.current = id;

    try {
      const response = await fetch("/api/portfolio", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const json = await response.json();
      if (id !== requestId.current) return true;
      if (!json || typeof json !== "object" || !json.profile) {
        throw new Error("Invalid portfolio payload");
      }

      setData(mergeWithDefaults(json));
      setStatus("live");
      return true;
    } catch {
      if (id === requestId.current) {
        setStatus((current) => (current === "live" ? "live" : "static"));
      }
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let source;

    load().then((connected) => {
      if (!connected || cancelled || typeof EventSource === "undefined") return;

      source = new EventSource("/api/events");
      source.onmessage = (event) => {
        if (event.data === "updated") load();
      };
      source.onerror = () => {
        // EventSource reconnects automatically; the API may be restarting.
      };
    });

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [load]);

  const value = useMemo(
    () => ({ ...data, status, refresh: load }),
    [data, status, load]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used inside a PortfolioProvider");
  }
  return context;
}
