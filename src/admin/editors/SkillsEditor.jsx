import { skillIconOptions } from "../../data/portfolio";
import {
  EditorSection,
  Field,
  Repeater,
  StringListEditor,
  TextField,
  TwoColumn,
} from "../ui";

export function SkillsEditor({ data, onPatch }) {
  return (
    <EditorSection
      title="Skill cards"
      description="Add, reorder, or remove the capability cards in the Skills section."
    >
      <Repeater
        items={data.skills}
        onChange={(skills) => onPatch({ skills })}
        createItem={() => ({
          title: "",
          icon: "layout",
          description: "",
          items: [],
        })}
        itemLabel={(item) => item.title || "New skill"}
        addLabel="Add skill card"
        emptyText="No skill cards yet."
        renderItem={(item, index, update) => (
          <div className="admin-stack admin-stack--tight">
            <TwoColumn>
              <TextField
                label="Title"
                value={item.title}
                placeholder="Frontend"
                onChange={(event) =>
                  update({ ...item, title: event.target.value })
                }
              />
              <Field label="Icon">
                <select
                  value={item.icon}
                  onChange={(event) =>
                    update({ ...item, icon: event.target.value })
                  }
                >
                  {skillIconOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </TwoColumn>

            <TextField
              label="Description"
              textarea
              rows={2}
              value={item.description}
              placeholder="Interfaces that feel fast, responsive, and intentional."
              onChange={(event) =>
                update({ ...item, description: event.target.value })
              }
            />

            <StringListEditor
              label="Technologies"
              items={item.items}
              onChange={(items) => update({ ...item, items })}
              placeholder="Add a technology"
              addLabel="Add"
            />
          </div>
        )}
      />
    </EditorSection>
  );
}
