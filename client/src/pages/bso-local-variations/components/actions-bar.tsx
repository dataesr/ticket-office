import { Button, ButtonGroup, Container, Notice, Text } from "@dataesr/dsfr-plus"
import uploadFiles from "../actions/upload-files"
import { useVariationsContext } from "../context"
import { Variation } from "../types"
import { useState } from "react"
import EditModal from "./edit-modal"

export default function ActionBar({ variations }: { variations: Array<Variation> }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const {
    data: { refetch },
  } = useVariationsContext()

  const noStructureIds = variations.filter((variation) => !("id" in variation.structure))

  return (
    <Container fluid>
      <Text>
        Sélection:{" "}
        <strong>
          {variations.length} demande{variations.length > 1 ? "s" : ""}
        </strong>{" "}
        de déclinaison locale
      </Text>
      {!!noStructureIds.length && (
        <Notice className="fr-mb-3w" type="warning" closeMode="disallow">
          {noStructureIds.length} demande{noStructureIds.length > 1 ? "s" : ""} ne contien
          {noStructureIds.length > 1 ? "nent" : "t"} pas d'identifiant de structure!
          <br />
          {noStructureIds.map((variation) => `- ${variation.structure.name} (${variation.id}) `)}
        </Notice>
      )}
      <EditModal variations={variations} isOpen={showModal} onClose={() => setShowModal(false)} />
      <ButtonGroup style={{ width: "60%" }}>
        <Button icon="edit-line" onClick={() => setShowModal(true)}>
          Editer les demandes
        </Button>
        <Button
          variant="secondary"
          icon="server-line"
          onClick={() => {
            uploadFiles(variations)
            refetch()
          }}
        >
          Charger les fichiers sur OVH
        </Button>
        <Button icon="article-line" variant="secondary" disabled>
          Relancer un index BSO
        </Button>
      </ButtonGroup>
    </Container>
  )
}
