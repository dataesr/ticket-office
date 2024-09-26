import { t } from "elysia";

export const postContactSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    fromApplication: t.Enum({
      paysage: "paysage",
      scanr: "scanr",
      bso: "bso",
      "works-magnet": "works-magnet",
      datasupr: "datasupr",
      curiexplore: "curiexplore",
    }),
    extra: t.Optional(t.Record(t.String(), t.String())),
  },
  { additionalProperties: false }
);
