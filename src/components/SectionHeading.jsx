import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  titleId,
}) {
  return (
    <Reveal
      className={`section-heading${
        align === "center" ? " section-heading--center" : ""
      }`}
    >
      <span className="eyebrow">
        <span className="eyebrow-dot" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 id={titleId}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </Reveal>
  );
}
