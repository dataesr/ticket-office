import { useState } from "react";
import { Button, Col, Row, Text, TextArea } from "@dataesr/dsfr-plus";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";

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
      sendSmtpEmail.subject = "Réponse à votre contribution";
      sendSmtpEmail.htmlContent = response;

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      const data = {
        comment: response,
      };

      const responsePatch = await fetch(
        `https://scanr-api.staging.dataesr.ovh/contributions/${contribution.id}`,
        {
          method: "PATCH",
          headers: postHeaders,
          body: JSON.stringify(data),
        }
      );

      if (!responsePatch.ok) {
        console.log("Erreur lors de la mise à jour de la contribution");
        return;
      }

      setEmailSent(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email ou de la mise à jour de la contribution:",
        error
      );
    }
  };

  return (
    <Row gutters>
      <Col offsetMd="2">
        <TextArea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Votre réponse..."
          rows={2}
        />
      </Col>
      <Button variant="secondary" onClick={sendEmail} size="sm">
        {contribution.comment ? "Renvoyer un mail" : "Répondre"}
      </Button>
      {emailSent && <Text>Mail envoyé!</Text>}
    </Row>
  );
}

export default EmailSender;
