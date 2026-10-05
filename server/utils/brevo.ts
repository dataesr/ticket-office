import { HttpError } from "./httpError";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendBrevoEmail(data: unknown): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    throw new HttpError(500, "BREVO_API_KEY is not defined", "MISSING_API_KEY");
  }

  let response: Response;
  try {
    response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new HttpError(
      500,
      `Erreur d'envoi d'email: ${error}`,
      "EMAIL_SEND_FAILED"
    );
  }

  if (!response.ok) {
    throw new HttpError(
      500,
      `Erreur d'envoi d'email: ${response.statusText}`,
      "EMAIL_SEND_FAILED"
    );
  }
}
