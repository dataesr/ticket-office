import { Button, Col, Row, TextArea, ButtonGroup } from "@dataesr/dsfr-plus";
import { useState } from "react";
import TemplateResponseModal from "./template";

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      {contribution?.email && (
        <Row gutters>
          <Col offsetMd="2" md="10">
            <Button size="sm" variant="secondary" onClick={openModal}>
              Utiliser une réponse préparée
            </Button>
            <TextArea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Votre réponse..."
              rows={3}
            />
          </Col>
          <Col offsetMd="10" md="2">
            <ButtonGroup size="sm">
              <Button
                className="fr-mt-1w"
                variant="secondary"
                onClick={handlePreview}
              >
                Prévisualiser le mail
              </Button>
              <Button
                className="fr-mt-1w"
                variant="primary"
                onClick={sendEmail}
              >
                {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
      <TemplateResponseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        setUserResponse={setUserResponse}
      />
    </>
  );
}

export default EmailForm;
