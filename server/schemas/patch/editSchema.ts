import { t } from "elysia";

export const editContributionsSchema = t.Object(
  {
    idref: t.Optional(t.String()),
    status: t.Optional(
      t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })
    ),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
  },
  { additionalProperties: false }
);
