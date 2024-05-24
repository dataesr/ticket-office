import { useEffect, useState } from "react";
import { Button, Col, Container, Row, TextArea } from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";

function EmailSender({
  contribution,
  setResponseScanR,
}: {
  contribution: Contribution;
  setResponseScanR: any;
}) {
  const [, setEmailSent] = useState(false);
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
    const dataForBrevo = {
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
      comment: userResponse,
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
          <Button variant="secondary" onClick={sendEmail} size="sm">
            {contribution.comment ? "Renvoyer un mail" : "Répondre"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailSender;
