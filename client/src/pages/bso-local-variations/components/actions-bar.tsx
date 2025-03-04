import { Button, ButtonGroup, Container, Notice, Text } from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import { useState } from "react"
import EditModal from "./edit-modal"
import UploadModal from "./upload-modal"
import EmailModal from "./email-modal"
import IndexModal from "./index-modal"

export default function ActionBar({ variations }: { variations: Array<Variation> }) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false)
  const [showIndexModal, setShowIndexModal] = useState<boolean>(false)

  const variationsWithoutStructureId = variations.filter((variation) => !variation.structure?.id)
  const variationsWithStructureId = variations.filter((variation) => !!variation.structure?.id)
  const variationsWithUploadedFile = variations.filter((variation) => variation?.tags?.file === "uploaded")

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
      <EmailModal variations={variations} isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
      <UploadModal
        variations={variationsWithStructureId}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
      <IndexModal variations={variationsWithUploadedFile} isOpen={showIndexModal} onClose={() => setShowIndexModal(false)} />
      <ButtonGroup style={{ width: "60%" }}>
        <Button icon="edit-line" onClick={() => setShowEditModal(true)}>
          {`Editer les demandes (${variations?.length})`}
        </Button>
        <Button variant="secondary" icon="send-plane-line" onClick={() => setShowEmailModal(true)}>
          {`Envoyer des notifications (${variations.length})`}
        </Button>
        <Button
          variant="secondary"
          icon="server-line"
          onClick={() => setShowUploadModal(true)}
          disabled={!variationsWithStructureId.length}
        >
          {`Charger les fichiers sur OVH (${variationsWithStructureId.length})`}
        </Button>
        <Button
          icon="git-repository-commits-line"
          variant="secondary"
          onClick={() => setShowIndexModal(true)}
          disabled={!variationsWithUploadedFile.length}
        >
          {`Relancer un index BSO (${variationsWithUploadedFile.length})`}
        </Button>
      </ButtonGroup>
    </Container>
  )
}
