import { useEffect, useState } from "react";
import {
  Container,
  Modal,
  ModalTitle,
  ModalContent,
  Alert,
  Row,
  Col,
} from "@dataesr/dsfr-plus";
import { EmailSenderProps } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import ProfileModal from "../../components/profil-modal";
import EmailForm from "../../components/mail-form";

function EmailSender({ contribution, refetch }: EmailSenderProps) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile") || ""
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
    const profileFromLocalStorage = localStorage.getItem("selectedProfile");
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
        email: "scanr@recherche.gouv.fr",
        name: `${selectedProfile} de l'équipe scanR`,
      },
      to: [
        {
          email: `${contribution.email}`,
          name: `${contribution.name}`,
        },
      ],
      replyTo: {
        email: "scanr@recherche.gouv.fr",
        name: "L'équipe scanR",
      },
      subject: `Réponse à votre contribution, référence ${contribution._id}`,
      templateId: 262,
      params: {
        date: new Date().toLocaleDateString(),
        userResponse: userResponse,
        message: contribution.message,
        selectedProfile: selectedProfile,
      },
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
    localStorage.setItem("selectedProfile", profile);
    setShowProfileModal(false);
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <>
      <Container>
        <EmailForm
          userResponse={userResponse}
          setUserResponse={setUserResponse}
          handlePreview={handlePreview}
          sendEmail={sendEmail}
          contribution={contribution}
        />
      </Container>
      <ProfileModal
        isOpen={showProfileModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowProfileModal(false)}
        onSelectProfile={handleProfileSelect}
      />
      <Modal isOpen={showPreviewModal} hide={() => setShowPreviewModal(false)}>
        <ModalTitle>Prévisualisation du mail</ModalTitle>
        <ModalContent>
          <Row gutters>
            <Col>
              <p>
                De:{" "}
                {`${selectedProfile} de l'équipe scanR <scanr@recherche.gouv.fr>`}
              </p>
              <p>À: {`${contribution?.name} <${contribution?.email}>`}</p>
              <p>
                Objet: Réponse à votre contribution, référence{" "}
                {contribution?._id}
              </p>
              <div>
                <h4>Message:</h4>
                {userResponse ? (
                  <p>{userResponse}</p>
                ) : (
                  <Alert
                    variant="warning"
                    title="Alerte"
                    description="Attention ! Vous n'avez pas encore rédigé de réponse."
                  />
                )}
              </div>
            </Col>
          </Row>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmailSender;
