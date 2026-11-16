import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderKanban,
  Layers,
  Loader2,
  LogOut,
  Save,
  Sparkles,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AdminLogin } from "./AdminLogin";
import { AboutEditor } from "./editors/AboutEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { MarqueeEditor } from "./editors/MarqueeEditor";
import { ProfileEditor } from "./editors/ProfileEditor";
import { ProjectsEditor } from "./editors/ProjectsEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { StatsEditor } from "./editors/StatsEditor";
import "./admin.css";

const TOKEN_KEY = "portfolio-admin-token";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    description: "Your identity, links, and hero introduction.",
    icon: UserRound,
    Editor: ProfileEditor,
  },
  {
    id: "about",
    label: "About",
    description: "Your story, highlights, and current focus.",
    icon: FileText,
    Editor: AboutEditor,
  },
  {
    id: "stats",
    label: "Stats",
    description: "The quick numbers under the hero.",
    icon: BarChart3,
    Editor: StatsEditor,
  },
  {
    id: "marquee",
    label: "Tech strip",
    description: "The scrolling technologies below the hero.",
    icon: Sparkles,
    Editor: MarqueeEditor,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Capability cards and their technologies.",
    icon: Layers,
    Editor: SkillsEditor,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Case studies, links, and preview accents.",
    icon: FolderKanban,
    Editor: ProjectsEditor,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Your timeline of roles and growth.",
    icon: Briefcase,
    Editor: ExperienceEditor,
  },
];

export function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) || ""
  );
  const [authState, setAuthState] = useState(token ? "checking" : "guest");
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [online, setOnline] = useState(true);
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/portfolio", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Could not load portfolio data.");

      const json = await response.json();
      setData(json);
      setSaved(json);
      setOnline(true);
      setError("");
    } catch {
      setOnline(false);
      setError(
        "Could not load portfolio data. Make sure the API is running with npm run dev."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setAuthState("guest");
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/admin/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unauthorized");
        if (cancelled) return;

        setAuthState("authed");
        await loadData();
      } catch {
        if (cancelled) return;
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAuthState("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, loadData]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const isDirty = useMemo(() => {
    if (!data || !saved) return false;
    return JSON.stringify(data) !== JSON.stringify(saved);
  }, [data, saved]);

  const patch = useCallback((partial) => {
    setData((current) => (current ? { ...current, ...partial } : current));
  }, []);

  const save = useCallback(async () => {
    if (!data || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAuthState("guest");
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error || "Could not save changes.");
      }

      setData(payload);
      setSaved(payload);
      setOnline(true);
      setToast({ type: "success", message: "Saved — your portfolio is live." });
    } catch (saveError) {
      setOnline(false);
      setToast({
        type: "error",
        message:
          saveError instanceof TypeError
            ? "Could not reach the API. Check that the server is running."
            : saveError.message,
      });
    } finally {
      setSaving(false);
    }
  }, [data, saving, token]);

  const discard = useCallback(() => {
    if (!saved) return;
    setData(JSON.parse(JSON.stringify(saved)));
    setToast({ type: "neutral", message: "Unsaved changes discarded." });
  }, [saved]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthState("guest");
    setData(null);
    setSaved(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (isDirty && !saving) save();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDirty, save, saving]);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const counts = useMemo(() => {
    if (!data) return {};
    return {
      stats: data.stats?.length ?? 0,
      marquee: data.marqueeItems?.length ?? 0,
      skills: data.skills?.length ?? 0,
      projects: data.projects?.length ?? 0,
      experience: data.experience?.length ?? 0,
    };
  }, [data]);

  if (authState === "guest") {
    return (
      <AdminLogin
        onLogin={(newToken) => {
          sessionStorage.setItem(TOKEN_KEY, newToken);
          setToken(newToken);
          setAuthState("checking");
        }}
      />
    );
  }

  if (authState === "checking" || (loading && !data)) {
    return (
      <div className="admin-boot">
        <span className="admin-spinner" aria-hidden="true" />
        <p>Loading content manager…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-boot">
        <div className="admin-boot-card">
          <WifiOff size={26} aria-hidden="true" />
          <h1>API not reachable</h1>
          <p>
            The admin dashboard needs the Node API. Start the project with
            <code>npm run dev</code>, then reload this page.
          </p>
          <div className="admin-boot-actions">
            <button
              type="button"
              className="admin-button admin-button--primary"
              onClick={loadData}
            >
              Try again
            </button>
            <a className="admin-button admin-button--ghost" href="/">
              Back to portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  const active = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const ActiveEditor = active.Editor;

  return (
    <div className="admin">
      <div className="admin-aurora" aria-hidden="true" />

      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <span className="admin-brand-mark" aria-hidden="true">
            M
          </span>
          <span>
            Manikandan<span className="admin-brand-dot">.</span>
          </span>
        </a>

        <p className="admin-sidebar-label">Content</p>

        <nav className="admin-nav" aria-label="Admin sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`admin-nav-item${activeTab === id ? " is-active" : ""}`}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? "page" : undefined}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
              {counts[id] != null ? <em>{counts[id]}</em> : null}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ArrowUpRight size={16} /> <span>View portfolio</span>
          </a>
          <button type="button" onClick={logout}>
            <LogOut size={16} /> <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Content manager</p>
            <h1>{active.label}</h1>
            <p className="admin-topbar-copy">{active.description}</p>
          </div>
          <div className="admin-topbar-actions">
            <span className={`admin-live${online ? " is-online" : ""}`}>
              {online ? <Wifi size={14} /> : <WifiOff size={14} />}
              {online ? "Live API" : "Offline"}
            </span>
            <a
              className="admin-button admin-button--ghost"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View site <ArrowUpRight size={15} />
            </a>
          </div>
        </header>

        {error ? (
          <p className="admin-error admin-error--banner" role="alert">
            {error}
          </p>
        ) : null}

        <main className="admin-editor">
          <ActiveEditor data={data} onPatch={patch} />
        </main>

        <footer className="admin-savebar">
          <span className={`admin-save-state${isDirty ? " is-dirty" : ""}`}>
            {isDirty ? (
              <>
                <span className="admin-dirty-dot" aria-hidden="true" />
                Unsaved changes
              </>
            ) : (
              <>
                <CheckCircle2 size={15} aria-hidden="true" />
                All changes saved
              </>
            )}
          </span>

          <div className="admin-save-actions">
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={discard}
              disabled={!isDirty || saving}
            >
              Discard
            </button>
            <button
              type="button"
              className="admin-button admin-button--primary"
              onClick={save}
              disabled={!isDirty || saving}
            >
              {saving ? (
                <Loader2 className="admin-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </footer>
      </div>

      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.type}`}
          role="status"
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : null}
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
