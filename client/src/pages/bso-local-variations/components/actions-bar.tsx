import { Button, ButtonGroup, Container, Notice, Text } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { Variation } from "../types"
import { useState } from "react"
import EditModal from "./edit-modal"
import UploadModal from "./upload-modal"

export default function ActionBar({ variations }: { variations: Array<Variation> }) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [_, setShowEmailModal] = useState<boolean>(false)

  const { getCodeFromBSO } = useVariationsContext()

  const variationsWithoutStructureId = variations.filter((variation) => !variation.structure?.id)
  const variationsWithStructureId = variations.filter((variation) => !!variation.structure?.id)
  const variationsWithConfig = variations.filter((variation) => getCodeFromBSO(variation.structure?.id) === "production")

  return (
    <Container fluid>
      <Text>
        Sélection:{" "}
        <strong>
          {variations.length} demande{variations.length > 1 ? "s" : ""}
        </strong>{" "}
        de déclinaison locale
      </Text>
      {!!variationsWithoutStructureId.length && (
        <Notice className="fr-mb-3w" type="warning" closeMode="disallow">
          {variationsWithoutStructureId.length} demande{variationsWithoutStructureId.length > 1 ? "s" : ""} ne contien
          {variationsWithoutStructureId.length > 1 ? "nent" : "t"} pas d'identifiant de structure!
          <br />
          {variationsWithoutStructureId.map((variation) => `- ${variation.structure.name} (${variation.id}) `)}
        </Notice>
      )}
      <EditModal variations={variations} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <UploadModal
        variations={variationsWithStructureId}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
      <ButtonGroup style={{ width: "60%" }}>
        <Button icon="edit-line" onClick={() => setShowEditModal(true)}>
          {`Editer les demandes (${variations?.length})`}
        </Button>
        <Button variant="secondary" icon="server-line" onClick={() => setShowUploadModal(true)}>
          {`Charger les fichiers sur OVH (${variationsWithStructureId.length})`}
        </Button>
        <Button icon="article-line" variant="secondary" disabled>
          {`Relancer un index BSO (${variationsWithConfig.length})`}
        </Button>
        <Button variant="secondary" icon="send-plane-line" onClick={() => setShowEmailModal(true)} disabled>
          {`Envoyer les notifications (${variationsWithStructureId.length})`}
        </Button>
      </ButtonGroup>
    </Container>
  )
}
