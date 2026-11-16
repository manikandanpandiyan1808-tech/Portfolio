import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view.
 * `ids` must be a stable array (define it outside the component).
 */
export function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const update = () => {
      const scrollPosition = window.scrollY + offset;
      let current = ids[0] ?? "";

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) current = id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;

      if (atBottom) current = ids[ids.length - 1] ?? current;
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids, offset]);

  return active;
}
