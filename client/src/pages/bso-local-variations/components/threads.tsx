import { useState } from "react"
import {
  Container,
  Modal,
  ModalTitle,
  ModalContent,
  Alert,
  Row,
  Col,
  Text,
  TextArea,
  ButtonGroup,
  Button,
} from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import EmailForm from "../../../components/mail-form"
import { notificationGetName, notificationGetTemplate } from "../config/notifications"
import { useVariationsContext } from "../context"

export default function Threads({ variation }: { variation: Variation }) {
  const { getCommentsNameFromBSO } = useVariationsContext()
  const [userResponse, setUserResponse] = useState("")
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const selectedProfile = localStorage.getItem("selectedProfile")
  const commentsName = getCommentsNameFromBSO(variation.structure?.id)

  return (
    <Container fluid>
      {variation?.threads?.length > 0 && (
        <Col className="staffSide">
          {variation.threads.map((thread, threadIndex) =>
            thread.responses.map((response, responseIndex) => (
              <Text size="sm" key={`${threadIndex}-${responseIndex}`}>
                Réponse apportée par {response.team.join(", ")} le {new Date(response.timestamp).toLocaleDateString()}
                {" à "}
                {new Date(response.timestamp).toLocaleTimeString()} :<br />
                {response.responseMessage}
              </Text>
            ))
          )}
        </Col>
      )}
      {variation.contact.email && (
        <Row gutters>
          <Col offsetMd="2" md="10" xs="12">
            <label htmlFor="templateSelect">Choisir un template de réponse</label>
            <select
              id="templateSelect"
              value={"1"}
              onChange={(event) =>
                setUserResponse(notificationGetTemplate(event.target.value, variation.structure?.id, commentsName))
              }
              className="fr-select"
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
              value={userResponse}
              onChange={(event) => setUserResponse(event.target.value)}
              placeholder="Votre réponse..."
              rows={5}
            />
          </Col>
          <Col offsetMd="9" md="3" xs="12">
            <ButtonGroup size="sm">
              <Button className="fr-mt-1w" variant="secondary" onClick={() => setShowPreviewModal(true)}>
                Prévisualiser le mail
              </Button>
              <Button className="fr-mt-1w" variant="primary" onClick={null}>
                {"Répondre"}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
      <Container>
        <EmailForm
          userResponse={userResponse}
          setUserResponse={setUserResponse}
          handlePreview={null}
          sendEmail={null}
          contribution={variation}
        />
      </Container>
      <Modal isOpen={showPreviewModal} hide={() => setShowPreviewModal(false)}>
        <ModalTitle>Prévisualisation du mail</ModalTitle>
        <ModalContent>
          <Row gutters>
            <Col>
              <p>De: {`${selectedProfile} de l'équipe BSO <support@bso.fr>`}</p>
              <p>À: {`<${variation.contact.email}>`}</p>
              <p>Objet: Réponse à votre demande de déclinaison locale, référence {variation?.id}</p>
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
