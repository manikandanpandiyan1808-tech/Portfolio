import { EditorSection, TextField, TwoColumn } from "../ui";

export function ProfileEditor({ data, onPatch }) {
  const update = (key, value) => {
    onPatch({ profile: { ...data.profile, [key]: value } });
  };

  return (
    <div className="admin-stack">
      <EditorSection
        title="Identity"
        description="This is the name, role, and availability shown across the site."
      >
        <TwoColumn>
          <TextField
            label="Name"
            value={data.profile.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Manikandan"
          />
          <TextField
            label="Role"
            value={data.profile.role}
            onChange={(event) => update("role", event.target.value)}
            placeholder="Full Stack Developer"
            hint="The last word is highlighted in the hero heading."
          />
          <TextField
            label="Location"
            value={data.profile.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="India"
          />
          <TextField
            label="Availability"
            value={data.profile.availability}
            onChange={(event) => update("availability", event.target.value)}
            placeholder="Open to opportunities"
          />
        </TwoColumn>
      </EditorSection>

      <EditorSection
        title="Contact & links"
        description="Empty links are hidden automatically. Resume only appears when a URL is set."
      >
        <TwoColumn>
          <TextField
            label="Email"
            type="email"
            value={data.profile.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
          />
          <TextField
            label="Resume URL"
            value={data.profile.resume}
            onChange={(event) => update("resume", event.target.value)}
            placeholder="/resume.pdf"
            hint="Add the file to public/ and use /resume.pdf."
          />
          <TextField
            label="GitHub URL"
            value={data.profile.github}
            onChange={(event) => update("github", event.target.value)}
            placeholder="https://github.com/username"
          />
          <TextField
            label="LinkedIn URL"
            value={data.profile.linkedin}
            onChange={(event) => update("linkedin", event.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </TwoColumn>
      </EditorSection>

      <EditorSection
        title="Hero introduction"
        description="The paragraph under the large hero heading."
      >
        <TextField
          label="Hero lead"
          textarea
          rows={4}
          value={data.profile.heroLead}
          onChange={(event) => update("heroLead", event.target.value)}
          placeholder="I design and build modern, responsive web applications…"
        />
      </EditorSection>
    </div>
  );
}
