import { useEffect, useState } from "react";
import { Button, Col, Container, Row, TextArea } from "@dataesr/dsfr-plus";
import { Contribution, Contribute_Production } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import ProfileModal from "../../components/profil-modal";

type EmailSenderProps = {
  contribution: Contribution | Contribute_Production;
  refetch: () => void;
};

function EmailSender({ contribution, refetch }: EmailSenderProps) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    sessionStorage.getItem("selectedProfile") || ""
  );

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

  useEffect(() => {
    const profileFromLocalStorage = sessionStorage.getItem("selectedProfile");
    if (profileFromLocalStorage) {
      setSelectedProfile(profileFromLocalStorage);
    }
  }, []);

  const sendEmail = async () => {
    if (
      !selectedProfile ||
      selectedProfile === "null" ||
      selectedProfile === ""
    ) {
      setShowProfileModal(true);
      return;
    }

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

    try {
      const responseBrevo = await fetch(brevoUrl, {
        method: "POST",
        headers: {
          "api-key": import.meta.env.VITE_BREVO_API_AUTHORIZATION,
          "Content-Type": "application/json",
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
    } catch (error) {
      console.error("Erreur lors de l'envoi du mail", error);
      toast.error("Erreur lors de l'envoi du mail");
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    sessionStorage.setItem("selectedProfile", profile);
    setShowProfileModal(false);
  };

  return (
    <>
      {contribution?.email && (
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
      )}

      <ProfileModal
        isOpen={showProfileModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowProfileModal(false)}
        onSelectProfile={handleProfileSelect}
      />
    </>
  );
}

export default EmailSender;
