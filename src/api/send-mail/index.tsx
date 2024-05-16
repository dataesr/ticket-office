import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Text,
  TextArea,
} from "@dataesr/dsfr-plus";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";

function EmailSender({ contribution }: { contribution: Contribution }) {
  const [emailSent, setEmailSent] = useState(false);
  const [response, setResponse] = useState("");
  const { VITE_BREVO_API_AUTHORIZATION } = import.meta.env;
  const contributorName = contribution.name;
  const basePath = window.location.pathname.includes("contact")
    ? "contact"
    : "contribute";

  const [selectedProfile, setSelectedProfile] = useState("");

  useEffect(() => {
    const profileFromLocalStorage = sessionStorage.getItem("selectedProfile");
    if (profileFromLocalStorage) {
      setSelectedProfile(profileFromLocalStorage);
    }
  }, []);

  const sendEmail = async () => {
    try {
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
      var apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = VITE_BREVO_API_AUTHORIZATION;

      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.sender = {
        name: `${selectedProfile} - de l'équipe scanR`,
        email: "debache.mihoub@gmail.com",
      };
      sendSmtpEmail.to = [
        {
          name: contributorName,
          email: "debache.mihoub@gmail.com",
        },
      ];
      sendSmtpEmail.subject = "Réponse à votre contribution";
      sendSmtpEmail.htmlContent = response;

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      const data = {
        comment: response,
      };
      const responsePatch = await fetch(`api/${basePath}/${contribution._id}`, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify(data),
      });
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
    <Container>
      <Row gutters>
        <Col offsetMd="2" md="8">
          <TextArea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Votre réponse..."
            rows={2}
          />
        </Col>
        <Col className="fr-mt-10w">
          <Button variant="secondary" onClick={sendEmail} size="sm">
            {contribution.comment ? "Renvoyer un mail" : "Répondre"}
          </Button>
        </Col>
        {emailSent && <Text>Mail envoyé!</Text>}
      </Row>
    </Container>
  );
}

export default EmailSender;
