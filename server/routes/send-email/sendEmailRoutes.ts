import { Elysia } from "elysia";
import { errorSchema } from "../../schemas/errors/errorSchema";
import { postSendEmailSchema } from "../../schemas/post/sendEmailSchema";

const sendEmail = new Elysia();

sendEmail.post(
  "/send-email",
  async ({ body, set }) => {
    try {
      const {
        to,
        name,
        subject,
        message,
        templateId,
        params,
        senderEmail,
        senderName,
      } = body;

      const BREVO_API_KEY = process.env.BREVO_API_KEY;
      if (!BREVO_API_KEY) {
        set.status = 500;
        return {
          success: false,
          error: "BREVO_API_KEY is not defined",
        };
      }

      const dataForBrevo = {
        sender: {
          email: senderEmail ?? process.env.SCANR_MAIL_SENDER,
          name: senderName ?? "L'équipe DISD",
        },
        to: [{ email: to, name: name }],
        subject: subject,
        ...(templateId ? { templateId, params } : { htmlContent: message }),
      };

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify(dataForBrevo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur Brevo:", errorText);
        set.status = 500;
        return {
          success: false,
          error: `Erreur d'envoi: ${response.statusText}`,
          details: errorText,
        };
      }

      return {
        success: true,
        message: "E-mail envoyé avec succès",
      };
    } catch (error) {
      set.status = 500;
      return {
        success: false,
        error: "Error processing request",
      };
    }
  },
  {
    body: postSendEmailSchema,
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Envoi d'un email",
      description:
        "Envoie un e-mail via Brevo à un destinataire, sans enregistrement en base de données. Supporte un contenu HTML libre ou un template Brevo (templateId + params).",
      tags: ["Envoi de mails"],
      responses: {
        200: {
          description: "E-mail envoyé avec succès",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "E-mail envoyé avec succès",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Requête invalide",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
        500: {
          description: "Erreur serveur",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string" },
                  details: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }
);

export default sendEmail;
