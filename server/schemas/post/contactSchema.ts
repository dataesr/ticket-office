import { t } from "elysia";

export const postContactSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    fromApp: t.Enum({
      paysage: "paysage",
      scanr: "scanr",
      bso: "bso",
      "works-magnet": "works-magnet",
      datasupr: "datasupr",
      curieXplore: "curiexplore",
    }),
    fromSubApp: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
  },
  { additionalProperties: false }
);
