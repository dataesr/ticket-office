import { useState } from "react";
import {
  Container,
  Modal,
  ModalTitle,
  ModalContent,
  Alert,
  Row,
  Col,
} from "@dataesr/dsfr-plus";
import { toast } from "react-toastify";
import EmailForm from "../../components/mail-form";
import { getCollectionNameFromUrl } from "../utils/collectionName";
import { EmailSenderProps } from "../../types";

function EmailSender({ contribution, refetch }: EmailSenderProps) {
  const [, setEmailSent] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const apiBaseUrl = "/api/send-email"
  const selectedProfile = localStorage.getItem("selectedProfile");

  const sendEmail = async () => {
    const formattedResponse = userResponse.replace(/\n/g, "<br/>");

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
