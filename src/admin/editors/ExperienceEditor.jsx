import {
  EditorSection,
  Repeater,
  StringListEditor,
  TextField,
  TwoColumn,
} from "../ui";

export function ExperienceEditor({ data, onPatch }) {
  return (
    <EditorSection
      title="Experience timeline"
      description="Roles, internships, and learning milestones shown on the timeline."
    >
      <Repeater
        items={data.experience}
        onChange={(experience) => onPatch({ experience })}
        createItem={() => ({
          date: "",
          meta: "",
          title: "",
          org: "",
          description: "",
          tags: [],
        })}
        itemLabel={(item) => item.title || "New entry"}
        addLabel="Add experience"
        emptyText="No experience entries yet."
        renderItem={(item, index, update) => (
          <div className="admin-stack admin-stack--tight">
            <TwoColumn>
              <TextField
                label="Date"
                value={item.date}
                placeholder="Feb 2025"
                onChange={(event) =>
                  update({ ...item, date: event.target.value })
                }
              />
              <TextField
                label="Meta"
                value={item.meta}
                placeholder="2-week internship"
                onChange={(event) =>
                  update({ ...item, meta: event.target.value })
                }
              />
              <TextField
                label="Title"
                value={item.title}
                placeholder="Technology Intern"
                onChange={(event) =>
                  update({ ...item, title: event.target.value })
                }
              />
              <TextField
                label="Organisation"
                value={item.org}
                placeholder="R2C Technologies"
                onChange={(event) =>
                  update({ ...item, org: event.target.value })
                }
              />
            </TwoColumn>

            <TextField
              label="Description"
              textarea
              rows={3}
              value={item.description}
              onChange={(event) =>
                update({ ...item, description: event.target.value })
              }
            />

            <StringListEditor
              label="Tags"
              items={item.tags}
              onChange={(tags) => update({ ...item, tags })}
              placeholder="Add a tag"
              addLabel="Add"
            />
          </div>
        )}
      />
    </EditorSection>
  );
}
