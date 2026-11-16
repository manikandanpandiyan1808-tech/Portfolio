import { EditorSection, Repeater, TwoColumn, TextField } from "../ui";

export function StatsEditor({ data, onPatch }) {
  return (
    <EditorSection
      title="Hero stats"
      description="Short proof points shown under the hero buttons."
    >
      <Repeater
        items={data.stats}
        onChange={(stats) => onPatch({ stats })}
        createItem={() => ({ value: "", label: "" })}
        itemLabel={(item) => item.label || item.value || "New stat"}
        addLabel="Add stat"
        emptyText="No stats yet."
        renderItem={(item, index, update) => (
          <TwoColumn>
            <TextField
              label="Value"
              value={item.value}
              placeholder="03"
              onChange={(event) => update({ ...item, value: event.target.value })}
            />
            <TextField
              label="Label"
              value={item.label}
              placeholder="Projects built"
              onChange={(event) => update({ ...item, label: event.target.value })}
            />
          </TwoColumn>
        )}
      />
    </EditorSection>
  );
}
