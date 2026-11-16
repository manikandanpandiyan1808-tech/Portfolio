import {
  EditorSection,
  StringListEditor,
  TextField,
  TwoColumn,
} from "../ui";

export function AboutEditor({ data, onPatch }) {
  const update = (key, value) => {
    onPatch({ about: { ...data.about, [key]: value } });
  };

  const updateNested = (group, key, value) => {
    onPatch({
      about: {
        ...data.about,
        [group]: { ...data.about[group], [key]: value },
      },
    });
  };

  return (
    <div className="admin-stack">
      <EditorSection
        title="Story"
        description="The two paragraphs and bullet list in the About section."
      >
        <div className="admin-stack admin-stack--tight">
          <TextField
            label="Lead paragraph"
            textarea
            rows={3}
            value={data.about.lead}
            onChange={(event) => update("lead", event.target.value)}
          />
          <TextField
            label="Second paragraph"
            textarea
            rows={4}
            value={data.about.body}
            onChange={(event) => update("body", event.target.value)}
          />
          <StringListEditor
            label="Highlights"
            items={data.about.highlights}
            onChange={(items) => update("highlights", items)}
            placeholder="Add a highlight"
            addLabel="Add highlight"
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Currently"
        description="The highlighted card in the About bento grid."
      >
        <TwoColumn>
          <TextField
            label="Title"
            value={data.about.currently.title}
            onChange={(event) =>
              updateNested("currently", "title", event.target.value)
            }
          />
          <TextField
            label="Description"
            value={data.about.currently.description}
            onChange={(event) =>
              updateNested("currently", "description", event.target.value)
            }
          />
        </TwoColumn>
        <StringListEditor
          label="Focus tags"
          items={data.about.currently.pills}
          onChange={(items) => updateNested("currently", "pills", items)}
          placeholder="Add a technology"
          addLabel="Add tag"
        />
      </EditorSection>

      <EditorSection title="Learning" description="The learning card in About.">
        <TwoColumn>
          <TextField
            label="Title"
            value={data.about.learning.title}
            onChange={(event) =>
              updateNested("learning", "title", event.target.value)
            }
          />
          <TextField
            label="Description"
            value={data.about.learning.description}
            onChange={(event) =>
              updateNested("learning", "description", event.target.value)
            }
          />
        </TwoColumn>
      </EditorSection>
    </div>
  );
}
