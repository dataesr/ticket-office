import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  TextArea,
} from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import { notificationGetName, notificationGetTemplate } from "../config/notifications"
import sendEmails from "../actions/send-email"
import { useState } from "react"
import { useVariationsContext } from "../context"

export default function EmailBox({ variation }: { variation: Variation }) {
  const {
    data: { refetch },
    getCommentsNameFromBSO,
  } = useVariationsContext()
  const [userResponse, setUserResponse] = useState<string>("")
  const [notificationTag, setNotificationTag] = useState<string>("ongoing")
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const selectedProfile = localStorage.getItem("selectedProfile")
  const commentsName = getCommentsNameFromBSO(variation.structure?.id)

  return (
    <Container fluid>
      {variation.contact.email && (
        <Row gutters className="fr-mt-2w">
          <Col offsetMd="4" md="8" xs="12">
            <label htmlFor="templateSelect">Choisir un template de réponse</label>
            <select
              id="templateSelect"
              className="fr-select"
              value={"1"}
              onChange={(event) => {
                setNotificationTag(event.target.value)
                setUserResponse(notificationGetTemplate(event.target.value, variation.structure?.id, commentsName))
              }}
            >
              <option value="">Sélectionnez un template</option>

              <option key="ongoing" value="ongoing">
                {notificationGetName("ongoing")}
              </option>
              <option key="done" value="done" disabled={!variation.structure?.id || !commentsName}>
                {notificationGetName("done")}
              </option>
            </select>
            <TextArea
              style={{ resize: "none" }}
              value={userResponse}
              onChange={(event) => setUserResponse(event.target.value)}
              placeholder="Votre réponse..."
              rows={5}
            />
          </Col>
          <Col offsetMd="9" md="3" xs="12">
            <ButtonGroup size="sm">
              <Button variant="secondary" onClick={() => setShowPreviewModal(true)}>
                Prévisualiser le mail
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  sendEmails([variation], notificationTag, userResponse).then(() => setUserResponse(""))
                  refetch()
                }}
              >
                Envoyer
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
      <Modal isOpen={showPreviewModal} hide={() => setShowPreviewModal(false)}>
        <ModalTitle>Prévisualisation du mail</ModalTitle>
        <ModalContent>
          <Row gutters>
            <Col>
              <p>De: {`${selectedProfile} de l'équipe BSO <bso@dataesr.fr>`}</p>
              <p>À: {`<${variation.contact.email}>`}</p>
              <p>Objet: Réponse à votre demande de déclinaison locale, référence {variation.id}</p>
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
    </Container>
  )
}
