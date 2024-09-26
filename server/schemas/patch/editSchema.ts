import { t } from "elysia";

export const editContributionsSchema = t.Object(
  {
    status: t.Optional(
      t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })
    ),
    extra: t.Optional(t.Record(t.String(), t.String())),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.Union([t.String(), t.Null()]),
        })
      )
    ),
  },
  { additionalProperties: false }
);
