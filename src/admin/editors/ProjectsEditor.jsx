import {
  EditorSection,
  Field,
  Repeater,
  StringListEditor,
  TextField,
  TwoColumn,
} from "../ui";

export function ProjectsEditor({ data, onPatch }) {
  return (
    <EditorSection
      title="Projects"
      description="The first project is featured with a large preview. Drag-free reordering uses the arrows."
    >
      <Repeater
        items={data.projects}
        onChange={(projects) => onPatch({ projects })}
        createItem={() => ({
          number: String(data.projects.length + 1).padStart(2, "0"),
          title: "",
          type: "",
          description: "",
          highlights: [],
          tech: [],
          github: "",
          demo: "",
          accent: "violet",
          domain: "",
        })}
        itemLabel={(item) => item.title || "New project"}
        addLabel="Add project"
        emptyText="No projects yet."
        renderItem={(item, index, update) => (
          <div className="admin-stack admin-stack--tight">
            <TwoColumn>
              <TextField
                label="Number"
                value={item.number}
                placeholder="01"
                onChange={(event) =>
                  update({ ...item, number: event.target.value })
                }
              />
              <TextField
                label="Title"
                value={item.title}
                placeholder="Turf Management System"
                onChange={(event) =>
                  update({ ...item, title: event.target.value })
                }
              />
              <TextField
                label="Type"
                value={item.type}
                placeholder="Full Stack Web Application"
                onChange={(event) =>
                  update({ ...item, type: event.target.value })
                }
              />
              <Field label="Preview accent">
                <select
                  value={item.accent}
                  onChange={(event) =>
                    update({ ...item, accent: event.target.value })
                  }
                >
                  <option value="violet">Violet</option>
                  <option value="cyan">Cyan</option>
                  <option value="amber">Amber</option>
                </select>
              </Field>
              <TextField
                label="Preview domain"
                value={item.domain}
                placeholder="project.app"
                onChange={(event) =>
                  update({ ...item, domain: event.target.value })
                }
              />
              <TextField
                label="GitHub URL"
                value={item.github}
                placeholder="https://github.com/username/repo"
                onChange={(event) =>
                  update({ ...item, github: event.target.value })
                }
              />
              <TextField
                label="Live demo URL"
                value={item.demo}
                placeholder="https://project.app"
                onChange={(event) =>
                  update({ ...item, demo: event.target.value })
                }
                hint="Leave empty to hide the demo link."
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
              label="Highlights"
              items={item.highlights}
              onChange={(highlights) => update({ ...item, highlights })}
              placeholder="Add a highlight"
              addLabel="Add"
            />

            <StringListEditor
              label="Tech stack"
              items={item.tech}
              onChange={(tech) => update({ ...item, tech })}
              placeholder="Add a technology"
              addLabel="Add"
            />
          </div>
        )}
      />
    </EditorSection>
  );
}
