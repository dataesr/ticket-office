import { v4 as uuidv4 } from "uuid";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const MAIL_SENDER = process.env.MAIL_SENDER;
const MAIL_NAME = process.env.MAIL_NAME;

export async function sendEmailViaBrevo(
  to: string,
  subject: string,
  text: string
) {
  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const uniqueIdentifier = uuidv4();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: MAIL_NAME,
        email: MAIL_SENDER,
      },
      to: [{ email: to }],
      subject: `${subject} [ID:${uniqueIdentifier}]`,
      textContent: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return await response.json();
}
