import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter, TextArea } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { Variation } from "../types"

type IndexModalProps = {
  variations: Array<Variation>
  isOpen: boolean
  onClose: () => void
}
export default function IndexModal({ variations, isOpen, onClose }: IndexModalProps) {
  const {
    data: { refetch },
  } = useVariationsContext()

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>{"Relancer un index BSO"}</ModalTitle>
      <ModalContent>
        <ul>
          {variations.map((variation, index) => (
            <li key={index}>{`${variation.structure.name} - ${variation.structure?.id}`}</li>
          ))}
        </ul>
        <TextArea
          style={{ resize: "none" }}
          value={"Props"}
          onChange={(event) => console.log(event.target.value)}
          placeholder="Props..."
          rows={10}
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
              refetch()
            }}
          >
            Exécuter
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
