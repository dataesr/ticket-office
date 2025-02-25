import { Button, ButtonGroup, Container, Notice, Text } from "@dataesr/dsfr-plus"
import uploadFiles from "../actions/upload-files"
import { useVariationsContext } from "../context"
import { Variation } from "../types"

export default function ActionBar({ variations }: { variations: Array<Variation> }) {
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
      <ButtonGroup isInlineFrom="sm">
        <Button
          icon="server-line"
          onClick={() => {
            uploadFiles(variations)
            refetch()
          }}
        >
          Envoyer les fichiers sur OVH
        </Button>
        <Button icon="article-line" disabled>
          Relancer un index BSO
        </Button>
      </ButtonGroup>
    </Container>
  )
}
