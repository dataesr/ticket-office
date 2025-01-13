import { t } from "elysia";

export const postContributionObjectSchema = t.Object(
  {
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
      network: "network",
    }),
    extra: t.Optional(t.Record(t.String(), t.String())),
  },
  { additionalProperties: false }
)
