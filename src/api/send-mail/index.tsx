import { useState } from "react";
import { Button, Text, TextArea } from "@dataesr/dsfr-plus";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { Contribution } from "../../types";

function EmailSender({ contribution }: { contribution: Contribution }) {
  const [emailSent, setEmailSent] = useState(false);
  const [response, setResponse] = useState("");

  const { VITE_BREVO_API_AUTHORIZATION } = import.meta.env;

  const sendEmail = async () => {
    try {
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
      var apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = VITE_BREVO_API_AUTHORIZATION;

      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.sender = {
        name: "From name",
        email: "debache.mihoub@gmail.com",
      };
      sendSmtpEmail.to = [
        {
          name: "debache.mihoub@gmail.com",
          email: "debache.mihoub@gmail.com",
        },
      ];
      sendSmtpEmail.subject = "My subject";
      sendSmtpEmail.htmlContent = response;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
      <TextArea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Votre réponse..."
        rows={2}
      />
      <Button variant="secondary" onClick={sendEmail} className="fr-mb-1w">
        {contribution.comment ? "Renvoyer un mail" : "Répondre"}
      </Button>
      {emailSent && <Text>Mail envoyé!</Text>}
    </div>
  );
}

export default EmailSender;
