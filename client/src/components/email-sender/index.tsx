import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import EmailForm from "../mail-form";
import { Contribution, Contribute_Production } from "../../types";

type EmailSenderProps = {
  contribution: Contribution | Contribute_Production;
  refetch: () => void;
  apiRoute: string;
  collectionName: string;
};

function EmailSender({
  contribution,
  refetch,
  apiRoute,
  collectionName,
}: EmailSenderProps) {
  const [userResponse, setUserResponse] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const apiBaseUrl = "/api/reply-to-contribution";
  const selectedProfile = localStorage.getItem("selectedProfile");

  const sendEmail = async () => {
    const formattedResponse = userResponse.replace(/\n/g, "<br/>");

    const emailPayload = {
      contributionId: contribution.id,
      collectionName,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      refetch();
      setUserResponse("");
      toast.success("Mail envoyé!");
    } catch (error) {
      console.error("Erreur lors de l'envoi du mail", error);
      toast.error("Erreur lors de l'envoi du mail");
    }
  };

  return (
    <>
      <EmailForm
        userResponse={userResponse}
        setUserResponse={setUserResponse}
        handlePreview={() => setShowPreviewModal(true)}
        sendEmail={sendEmail}
        apiRoute={apiRoute}
        contribution={contribution}
      />

      <Modal isOpen={showPreviewModal} hide={() => setShowPreviewModal(false)}>
        <ModalTitle>Prévisualisation du mail</ModalTitle>
        <ModalContent>
          <p>
            De : {`${selectedProfile} de l'équipe scanR <support@scanr.fr>`}
          </p>
          <p>À : {`${contribution?.name} <${contribution?.email}>`}</p>
          <p>
            Objet : Réponse à votre contribution, référence {contribution?.id}
          </p>
          <p className="fr-text--bold fr-mb-1w">Message :</p>
          {userResponse ? (
            <pre className="fr-p-2w">{userResponse}</pre>
          ) : (
            <div className="fr-alert fr-alert--warning">
              <p className="fr-alert__title">Alerte</p>
              <p>Attention ! Vous n'avez pas encore rédigé de réponse.</p>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmailSender;
