import { Button, Col, Row, TextArea, ButtonGroup } from "@dataesr/dsfr-plus";

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
}) {
  return (
    <>
      {contribution?.email && (
        <Row gutters>
          <Col offsetMd="2" md="10">
            <TextArea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Votre réponse..."
              rows={2}
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
    </>
  );
}

export default EmailForm;
