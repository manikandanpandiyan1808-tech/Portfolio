import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";

export function Field({ label, hint, className = "", children }) {
  return (
    <label className={`admin-field ${className}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <span className="admin-hint">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  hint,
  className = "",
  textarea = false,
  rows = 3,
  ...props
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      {textarea ? <textarea rows={rows} {...props} /> : <input {...props} />}
    </Field>
  );
}

export function StringListEditor({
  label,
  hint,
  items = [],
  onChange,
  placeholder = "Add an item",
  addLabel = "Add",
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (!items.includes(value)) onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <div className="admin-chips">
        {items.length === 0 ? (
          <span className="admin-empty-inline">Nothing added yet</span>
        ) : (
          items.map((item, index) => (
            <span className="admin-chip" key={`${item}-${index}`}>
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
      </div>
      <div className="admin-inline-add">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="admin-mini-button" onClick={add}>
          <Plus size={14} /> {addLabel}
        </button>
      </div>
      {hint ? <span className="admin-hint">{hint}</span> : null}
    </div>
  );
}

export function Repeater({
  items = [],
  onChange,
  createItem,
  itemLabel,
  renderItem,
  addLabel = "Add item",
  emptyText = "No items yet.",
}) {
  const replace = (index, next) => {
    onChange(items.map((item, i) => (i === index ? next : item)));
  };

  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="admin-repeater">
      {items.length === 0 ? (
        <p className="admin-empty">{emptyText}</p>
      ) : (
        items.map((item, index) => (
          <section className="admin-item" key={index}>
            <header className="admin-item-head">
              <span className="admin-item-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{itemLabel(item, index)}</strong>
              <div className="admin-item-actions">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  className="is-danger"
                  aria-label={`Delete ${itemLabel(item, index)}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </header>
            <div className="admin-item-body">
              {renderItem(item, index, (next) => replace(index, next))}
            </div>
          </section>
        ))
      )}

      <button
        type="button"
        className="admin-add"
        onClick={() => onChange([...items, createItem()])}
      >
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
}

export function EditorSection({ title, description, children }) {
  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function TwoColumn({ children }) {
  return <div className="admin-grid">{children}</div>;
}
