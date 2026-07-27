import { t } from "elysia";

export const postSendSimpleEmailSchema = t.Object(
  {
    to: t.String({
      format: "email",
      description: "Adresse e-mail du destinataire",
    }),
    name: t.String({ description: "Nom du destinataire" }),
    subject: t.String({ description: "Objet de l'e-mail" }),
    message: t.String({ description: "Corps du message" }),
  },
  { additionalProperties: false }
);
