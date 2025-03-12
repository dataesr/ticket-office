import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter, TextArea } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { useState } from "react"
import { notificationGetName, notificationGetTemplate } from "../config/notifications"
import sendEmails from "../actions/send-email"
import { Variation } from "../types"
import { tagGetName } from "../config/tags"

type EmailModalProps = {
  variations: Array<Variation>
  isOpen: boolean
  onClose: () => void
}
export default function EmailModal({ variations, isOpen, onClose }: EmailModalProps) {
  const {
    data: { refetch },
    getCommentsNameFromBSO,
    getCodeFromBSO,
  } = useVariationsContext()
  const singleVariation = variations?.length === 1 ? variations[0] : null
  const [notificationTag, setNotificationTag] = useState<string>("ongoing")
  const [userResponse, setUserResponse] = useState<string>(notificationGetTemplate("ongoing"))
  const variationsWithConfig = variations.filter((variation) => getCodeFromBSO(variation.structure?.id) === "production")
  const useTemplate = !!singleVariation ? false : true

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>
        {singleVariation
          ? "Envoyer une notification à 1 demande"
          : `Envoyer une notification à ${variations.length} demandes`}
      </ModalTitle>
      <ModalContent>
        <ul>
          {variations.map((variation, index) => (
            <li key={index}>{`${variation.structure.name} - ${tagGetName(
              "code",
              getCodeFromBSO(variation.structure?.id)
            )}`}</li>
          ))}
        </ul>
        <hr />
        <select
          id="templateSelect"
          className="fr-select"
          value={notificationTag}
          onChange={(event) => {
            setNotificationTag(event.target.value)
            setUserResponse(
              notificationGetTemplate(
                event.target.value,
                singleVariation?.structure?.id || "${structureId}",
                getCommentsNameFromBSO(singleVariation.structure?.id) || "${structureCommentsName}"
              )
            )
          }}
        >
          <option key="ongoing" value="ongoing">
            {notificationGetName("ongoing")}
          </option>
          <option key="done" value="done" disabled={variationsWithConfig.length !== variations.length}>
            {notificationGetName("done")}
          </option>
        </select>
        <TextArea
          style={{ resize: "none" }}
          value={userResponse}
          onChange={(event) => setUserResponse(event.target.value)}
          placeholder="Votre réponse..."
          rows={10}
          readOnly={useTemplate}
        />
      </ModalContent>
      <ModalFooter>
        <Container style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              sendEmails(variations, notificationTag, userResponse, useTemplate).then(() => {
                refetch()
                onClose()
              })
            }}
          >
            Envoyer
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
