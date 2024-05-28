import { useEffect, useState } from "react";
import { Button, Col, Container, Row, TextArea } from "@dataesr/dsfr-plus";
import { Contribution, Contribute_Production } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";

function EmailSender({
  contribution,
  setResponseScanR,
}: {
  contribution: Contribution | Contribute_Production;
  setResponseScanR: any;
}) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "contribute_productions";
  }

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
          name: "Mihoub mihoub",
        },
      ],
      subject: `Réponse à votre contribution`,
      htmlContent: userResponse,
    };

    const responseBrevo = await fetch("/email/", {
      // const responseBrevo = await fetch("https://api.brevo.com/v3/smtp/email", {
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

    const responseScanR = await fetch(`/api/${basePath}/${contribution._id}`, {
      // const responseScanR = await fetch(
      //   `https://scanr-api.dataesr.ovh/${basePath}/${contribution._id}`,
      //   {
      method: "PATCH",
      headers: postHeaders,
      body: JSON.stringify(dataForScanR),
    });

    if (!responseScanR.ok) {
      throw new Error(`HTTP error! status: ${responseScanR.status}`);
    }
    setResponseScanR(dataForScanR);
    setEmailSent(true);
    toast.success("Mail envoyé!");
    setUserResponse("");
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
            {contribution.mailSent ? "Renvoyer un mail" : "Répondre"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailSender;
