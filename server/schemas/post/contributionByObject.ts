import { t } from "elysia";

export const postContributionObjectSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 220c881 (fix(api): add meta in response schema)
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.Optional(t.String()),
    section: t.Optional(t.String()),
    objectId: t.String(),
    objectType: t.Enum({
      structures: "structures",
      persons: "persons",
      publications: "publications",
      project: "project",
      patent: "patent",
    }),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    email: t.String(),
    name: t.String(),
    message: t.Optional(t.String()),
    section: t.Optional(t.String()),
    objectId: t.Optional(t.String()),
<<<<<<< HEAD
    objectType: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
<<<<<<< HEAD
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> b05991b (fix(api): update schemas)
=======
    objectType: t.Enum({
      structures: "structures",
      persons: "persons",
      publications: "publications",
      project: "project",
      patent: "patent",
    }),
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  },
  { additionalProperties: false }
);
