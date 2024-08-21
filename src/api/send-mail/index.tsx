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
import { Contribution, EmailSenderProps } from "../../types";
import { toast } from "react-toastify";
import ProfileModal from "../../components/profil-modal";
import EmailForm from "../../components/mail-form";

function EmailSender({ contribution, refetch, objectType }: EmailSenderProps) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile") || ""
  );

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

    const requestData = {
      contactId: contribution._id,
      threadId: (contribution as Contribution).threadId || "",
      responseText: userResponse,
      objectType: objectType,
    };

    try {
      const response = await fetch(`/reply-to-contribution/${objectType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
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
