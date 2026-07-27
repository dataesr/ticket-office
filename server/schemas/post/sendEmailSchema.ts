import { t } from "elysia";

export const postSendEmailSchema = t.Object(
  {
    to: t.String({
      format: "email",
      description: "Adresse e-mail du destinataire",
    }),
    name: t.String({ description: "Nom du destinataire" }),
    subject: t.String({ description: "Objet de l'e-mail" }),
    senderEmail: t.Optional(
      t.String({
        format: "email",
        description:
          "Adresse e-mail de l'expéditeur (défaut : SCANR_MAIL_SENDER)",
      })
    ),
    senderName: t.Optional(
      t.String({ description: "Nom de l'expéditeur (défaut : L'équipe DISD)" })
    ),
    message: t.Optional(
      t.String({
        description:
          "Corps du message en HTML, si templateId est fourni, Brevo ignore htmlContent de toute façon côté API",
      })
    ),
    templateId: t.Optional(t.Number({ description: "ID du template Brevo" })),
    params: t.Optional(
      t.Record(t.String(), t.Any(), {
        description:
          "Variables injectées dans le template Brevo (ex: firstname, orderId, amount). Les clés doivent correspondre aux variables {{ params.xxx }} définies dans le template. (https://developers.brevo.com/reference/send-transac-email)",
      })
    ),
  },
  { additionalProperties: false }
);
