import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Text,
  TextArea,
} from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";

function EmailSender({ contribution }: { contribution: Contribution }) {
  const [emailSent, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
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
    const data = {
      sender: {
        email: "mihoub.debache@enseignementsup.gouv.fr",
        name: "Debache ",
      },
      to: [
        {
          email: "mihoub.debache@enseignementsup.gouv.fr",
          name: "Mihoub mihoub",
        },
      ],
      subject: `${selectedProfile} de l'équipe scanR`,
      htmlContent: userResponse,
    };

    const response = await fetch("/email/", {
      method: "POST",
      headers: {
        "api-key": import.meta.env.VITE_BREVO_API_AUTHORIZATION,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responsePatch = await fetch(`/api/${basePath}/${contribution._id}`, {
      method: "PATCH",
      headers: postHeaders,
      body: JSON.stringify(data),
    });

    if (!responsePatch.ok) {
      throw new Error(
        `Erreur pendant la mise à jour de l'api ! status: ${response.status}`
      );
    }

    setEmailSent(true);
  };

  return (
    <Container>
      <Row gutters>
        <Col offsetMd="2" md="8">
          <TextArea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
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
