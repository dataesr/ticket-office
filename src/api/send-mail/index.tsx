import { useEffect, useState } from "react";
import { Button, Col, Container, Row, TextArea } from "@dataesr/dsfr-plus";
import { Contribution, Contribute_Production } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";

function EmailSender({
  contribution,
  refetch,
}: {
  contribution: Contribution | Contribute_Production;
  refetch;
}) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  let basePath = "contact";
  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "contribute_productions";
  }
  const brevoUrl = isDevelopment
    ? "https://api.brevo.com/v3/smtp/email"
    : "/email/";
  const scanRUrl = isDevelopment
    ? `https://scanr-api.dataesr.ovh/${basePath}/${contribution?._id}`
    : `/api/${basePath}/${contribution?._id}`;
  const [selectedProfile, setSelectedProfile] = useState("");

  useEffect(() => {
    const profileFromLocalStorage = sessionStorage.getItem("selectedProfile");
    if (profileFromLocalStorage) {
      setSelectedProfile(profileFromLocalStorage);
    }
  }, []);
  const sendEmail = async () => {
    const dataForBrevo = {
      sender: {
        email: "mihoub.debache@enseignementsup.gouv.fr",
        name: `${selectedProfile} de l'équipe scanR`,
      },
      to: [
        {
          email: "mihoub.debache@enseignementsup.gouv.fr",
          name: "Mihoub Debache",
        },
      ],
      subject: `Réponse à votre contribution`,
      htmlContent: `
  <h1>Réponse à votre contribution</h1>
  <p>Bonjour,</p>
  <p>En réponse à votre contribution :</p>
  <blockquote>${contribution.message}</blockquote>
  <p>Voici notre réponse :</p>
  <p>${userResponse}</p>
`,
    };
    const responseBrevo = await fetch(brevoUrl, {
      method: "POST",
      headers: {
        "api-key": import.meta.env.VITE_BREVO_API_AUTHORIZATION,
      },
      body: JSON.stringify(dataForBrevo),
    });

    if (!responseBrevo.ok) {
      throw new Error(`HTTP error! status: ${responseBrevo.status}`);
    }

    const dataForScanR = {
      mailSent: userResponse,
      mailSentDate: new Date(),
      responseFrom: selectedProfile,
    };

    const responseScanR = await fetch(scanRUrl, {
      method: "PATCH",
      headers: postHeaders,
      body: JSON.stringify(dataForScanR),
    });

    if (!responseScanR.ok) {
      throw new Error(`HTTP error! status: ${responseScanR.status}`);
    }
    setEmailSent(true);
    refetch();
    setUserResponse("");
    toast.success("Mail envoyé!");
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
        <Col>
          <Button
            className="fr-mt-1w"
            variant="secondary"
            onClick={sendEmail}
            size="sm"
          >
            {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailSender;
