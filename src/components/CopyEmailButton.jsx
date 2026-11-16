import { Check, Copy } from "lucide-react";
import { usePortfolio } from "../data/PortfolioProvider";
import { useClipboard } from "../hooks/useClipboard";

export function CopyEmailButton({ className = "" }) {
  const { profile } = usePortfolio();
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      className={`copy-button${copied ? " is-copied" : ""} ${className}`}
      onClick={() => copy(profile.email)}
      aria-live="polite"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? "Copied to clipboard" : "Copy email"}
    </button>
  );
}
