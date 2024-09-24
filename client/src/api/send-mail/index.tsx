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
import { toast } from "react-toastify";
import ProfileModal from "../../components/profil-modal";
import EmailForm from "../../components/mail-form";
import { getCollectionNameFromUrl } from "../utils/collectionName";

function EmailSender({ contribution, refetch }: EmailSenderProps) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile") || ""
  );

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
<<<<<<< HEAD
  const apiBaseUrl = isDevelopment
    ? "http://localhost:3000/api/send-email"
    : "https://ticket-office.staging.dataesr.ovh/api/send-email";
=======
  let basePath = "contact";
  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }
  const brevoUrl = isDevelopment
    ? "http://localhost:3000/api/"
    : "https://ticket-office.staging.dataesr.ovh/";
  const scanRUrl = isDevelopment
<<<<<<< HEAD
    ? `http://localhost:3000/api${basePath}/${contribution?._id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${contribution?._id}`;
>>>>>>> dfca0bc (chore(api): clean code)
=======
    ? `http://localhost:3000/api${basePath}/${contribution?.id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${contribution?.id}`;
>>>>>>> 2e9190f (fix(api): update schemas)

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

    const formattedResponse = userResponse.replace(/\n/g, "<br/>");

<<<<<<< HEAD
    const currentUrl = window.location.href;
    const collectionName = getCollectionNameFromUrl(currentUrl);

    const emailPayload = {
      contributionId: contribution.id,
      collectionName: collectionName,
      to: contribution.email,
      name: contribution.name,
      subject: `Réponse à votre contribution, référence ${collectionName}-${contribution.id}`,
      userResponse: formattedResponse,
      selectedProfile,
      message: contribution.message,
=======
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
      subject: `Réponse à votre contribution, référence ${contribution.id}`,
      templateId: 262,
      params: {
        date: new Date().toLocaleDateString(),
        userResponse: formattedResponse,
        message: contribution.message,
        selectedProfile: selectedProfile,
      },
>>>>>>> 2e9190f (fix(api): update schemas)
    };

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
                De: {`${selectedProfile} de l'équipe scanR <support@scanr.fr>`}
              </p>
              <p>À: {`${contribution?.name} <${contribution?.email}>`}</p>
              <p>
                Objet: Réponse à votre contribution, référence{" "}
                {contribution?.id}
              </p>
              <div>
                <h4>Message:</h4>
                {userResponse ? (
                  <pre style={{ whiteSpace: "pre-wrap" }}>{userResponse}</pre>
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
