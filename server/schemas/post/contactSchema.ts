import { t } from "elysia";

export const postContactSchema = t.Object(
  {
<<<<<<< HEAD
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
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
    extra: t.Optional(
      t.Record(t.String(), t.String(), {
        example: {
          exemple: "exemple",
          idref: "4134",
          fonction: "chercheur",
          organisation: "Université",
          subApplication: "teds",
        },
      })
    ),
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    fromApp: t.String(),
    collectionName: t.String(),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  },
  { additionalProperties: false }
);
