import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not sign in.");
      }
      onLogin(payload.token);
    } catch (submitError) {
      setError(
        submitError instanceof TypeError
          ? "Could not reach the API. Start it with npm run dev, then try again."
          : submitError.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-glow" aria-hidden="true" />

      <div className="admin-login-card">
        <a className="admin-back" href="/">
          <ArrowLeft size={15} /> Back to portfolio
        </a>

        <div className="admin-login-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            M
          </span>
          <span>
            Manikandan<span className="admin-brand-dot">.</span>
          </span>
        </div>

        <div className="admin-login-heading">
          <span className="admin-login-icon" aria-hidden="true">
            <LockKeyhole size={20} />
          </span>
          <div>
            <p className="admin-eyebrow">Protected area</p>
            <h1>Content manager</h1>
          </div>
        </div>

        <p className="admin-login-copy">
          Sign in to update the portfolio. Changes go live immediately for
          every visitor.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-label">Admin password</span>
            <div className="admin-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error ? (
            <p className="admin-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="admin-button admin-button--primary"
            type="submit"
            disabled={loading || !password}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="admin-login-note">
          <ShieldCheck size={14} aria-hidden="true" />
          Set <code>ADMIN_PASSWORD</code> in your environment to change the
          password.
        </p>
      </div>
    </div>
  );
}
