import { useRef } from "react";

/**
 * Card with a pointer-following spotlight highlight.
 * `as` lets you keep semantic markup (e.g. "article").
 */
export function SpotlightCard({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      className={`spotlight ${className}`}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      {children}
    </Tag>
  );
}
