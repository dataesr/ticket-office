import { t } from "elysia";

export const postContactSchema = t.Object(
  {
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    fromApplication: t.Enum({
      paysage: "paysage",
      scanr: "scanr",
      bso: "bso",
      "works-magnet": "works-magnet",
      tableaux: "tableaux",
      curiexplore: "curiexplore",
    }),
    contributionType: t.Optional(t.String()),
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
  },
  { additionalProperties: false }
);
