import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter, TextArea, Notice, Text } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { notificationGetTemplate } from "../config/notifications"
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
    api,
    data: { refetch },
    getCommentsNameFromBSO,
    getCodeFromBSO,
  } = useVariationsContext();
  const singleVariation = variations?.length === 1 ? variations[0] : null
  const useTemplate = !!singleVariation ? false : true
  const displayStructureId = singleVariation?.structure?.id || "${structureId}"
  const displayCommentsName = getCommentsNameFromBSO(singleVariation?.structure?.id) || "${structureCommentsName}"
  const displayUserResponse = notificationGetTemplate("done", api, displayStructureId, displayCommentsName);

  const variationsWithConfig = variations.filter((variation) => getCodeFromBSO(variation.structure?.id) === "production")

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
        <Text>Déclinaison locale integrée</Text>
        <TextArea style={{ resize: "none" }} value={displayUserResponse} rows={10} readOnly={useTemplate} />
        {useTemplate && (
          <Notice type="warning" closeMode="disallow">
            Le template n'est pas modifiable si plusieurs demandes sont selectionnées.
          </Notice>
        )}
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
              sendEmails(api, variations, "done", null, useTemplate, getCommentsNameFromBSO).then(() => {
                refetch()
                onClose()
              })
            }}
            disabled={variationsWithConfig.length !== variations.length}
          >
            Envoyer
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
