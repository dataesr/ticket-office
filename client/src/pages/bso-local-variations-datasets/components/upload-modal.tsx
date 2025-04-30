import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import uploadFiles from "../actions/upload-files"
import { Variation } from "../types"

type UploadModalProps = {
  variations: Array<Variation>
  isOpen: boolean
  onClose: () => void
}
export default function UploadModal({ variations, isOpen, onClose }: UploadModalProps) {
  const {
    data: { refetch },
  } = useVariationsContext()
  const singleVariation = variations?.length === 1 ? variations[0] : null

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>{singleVariation ? "Charger 1 fichier" : `Charger ${variations?.length} fichiers`}</ModalTitle>
      <ModalContent>
        <ul>
          {variations.map((variation, index) => (
            <li key={index}>{`${variation.structure.name} - ${variation.structure?.id}`}</li>
          ))}
        </ul>
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
              uploadFiles(variations).then(() => {
                refetch()
                onClose()
              })
            }}
          >
            Charger sur OVH
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
