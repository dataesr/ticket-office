import { t } from "elysia";

export const putProductionSchema = t.Object(
  {
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
  },
  { additionalProperties: false }
);
