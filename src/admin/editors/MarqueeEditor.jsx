import { EditorSection, StringListEditor } from "../ui";

export function MarqueeEditor({ data, onPatch }) {
  return (
    <EditorSection
      title="Technology strip"
      description="The scrolling list of technologies under the hero."
    >
      <StringListEditor
        label="Technologies"
        items={data.marqueeItems}
        onChange={(items) => onPatch({ marqueeItems: items })}
        placeholder="e.g. React.js"
        addLabel="Add technology"
        hint="Keep these short so the marquee stays readable."
      />
    </EditorSection>
  );
}
