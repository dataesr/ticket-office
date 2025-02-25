import { Button, ButtonGroup } from "@dataesr/dsfr-plus"

export default function ActionBar() {
  return (
    <ButtonGroup isInlineFrom="sm">
      <Button>Envoyer les fichiers sur OVH</Button>
      <Button>Relancer un index BSO</Button>
    </ButtonGroup>
  )
}
