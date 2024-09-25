import Elysia, { Static } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";
<<<<<<< HEAD
import { emailRecipients } from "./emailRecipents";

type postContactSchemaType = Static<typeof postContactSchema>;

const postContactsRoutes = new Elysia();
postContactsRoutes.post(
=======

type postContactSchemaType = Static<typeof postContactSchema>;
const postContactRoutes = new Elysia();

postContactRoutes.post(
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
  "/contacts",
  async ({ error, body }: { error: any; body: postContactSchemaType }) => {
    const allowedFromApps = [
      "paysage",
      "scanr",
      "bso",
      "works-magnet",
      "datasupr",
      "curiexplore",
    ];

<<<<<<< HEAD
    if (!allowedFromApps.includes(body.fromApplication)) {
      return error(400, {
        message: "Invalid fromApplication value, check child attributes",
        code: "INVALID_FROM_APP",
      });
    }

    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );
    const _id = new ObjectId();
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
      id: _id.toHexString(),
=======
    if (!allowedFromApps.includes(body.fromApp)) {
      return error(400, "Invalid fromApp value, check child attributes");
    }

    if (body.collectionName !== "contact") {
      return error(400, "Invalid collectionName value. Must be 'contact'");
    }

    const newContribution = {
      ...body,
      id: new ObjectId().toHexString(),
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
      created_at: new Date(),
      status: "new",
    };

    const result = await db.collection("contacts").insertOne(newContribution);
    if (!result.insertedId) {
<<<<<<< HEAD
      return error(500, {
        message: "Failed to create the contribution",
        code: "INSERTION_FAILED",
      });
=======
      return error(500, "Failed to create the contribution");
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

<<<<<<< HEAD
    const contributionLink = `https://ticket-office.staging.dataesr.ovh/${body.fromApplication}-contact?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients[body.fromApplication];
    if (!recipients) {
      return error(400, {
        message: "No email recipients found for this application",
        code: "NO_RECIPIENTS_FOUND",
      });
    }

    const dataForBrevo = {
      sender: {
        email: process.env.MAIL_SENDER,
        name: "L'équipe scanR",
      },
      to: recipients.to.map((email) => ({ email, name: email.split("@")[0] })),
      replyTo: { email: "support@scanr.fr", name: "L'équipe scanR" },
      subject: "Nouvelle contribution créée",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        message: `La contribution avec l'ID ${finalContribution.id} a été ajoutée. Vous pouvez consulter la contribution en cliquant sur le lien suivant : ${contributionLink}`,
      },
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
      return error(500, {
        message: `Erreur d'envoi d'email: ${response.statusText}`,
        code: "EMAIL_SEND_FAILED",
      });
    }

=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    return finalContribution;
  },
  {
    body: postContactSchema,
    response: {
      200: contactSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
<<<<<<< HEAD
      summary: "Créer une nouvelle contribution",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via un formulaire de contact.",
      tags: ["Contacts"],
=======
      summary: "Créer une nouvelle contribution via formulaire de contact",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Contact"],
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    },
  }
);

<<<<<<< HEAD
export default postContactsRoutes;
=======
export default postContactRoutes;
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
