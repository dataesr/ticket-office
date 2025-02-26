import { Badge, BadgeGroup, Button, Checkbox, Col, Container, Row, Text } from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { useVariationsContext } from "../context"
import { tagGetColor } from "../config/tags"

const CheckboxItem = ({ variation }: { variation: Variation }) => {
  const { checkedIds, checkId, setSelectedId, getCodeFromBSO } = useVariationsContext()
  const codeTag = getCodeFromBSO(variation.structure?.id)

  return (
    <Container fluid>
      <Row gutters verticalAlign="middle">
        <Col lg={1} className="fr-pt-0">
          <Checkbox
            size="sm"
            value={variation.id}
            checked={checkedIds.includes(variation.id)}
            onChange={(event) => checkId(String(event.target.value))}
          />
        </Col>
        <Col lg={11}>
          <button style={{ display: "block", width: "100%" }} onClick={() => setSelectedId(variation.id)}>
            <BadgeGroup className="fr-mt-1w">
              <Badge size="sm" color={BadgeStatus({ status: variation?.status })}>
                {StatusLabel({ status: variation.status })}
              </Badge>
              {variation.tags.file !== "none" && (
                <Badge size="sm" noIcon color={tagGetColor("file", variation.tags.file)}>
                  {variation.tags.file}
                </Badge>
              )}
              {codeTag !== "none" && (
                <Badge size="sm" noIcon color={tagGetColor("code", codeTag)}>
                  {codeTag}
                </Badge>
              )}
            </BadgeGroup>
            <Text bold size="sm" className="fr-mb-2w" as="p" style={{ textAlign: "left" }}>
              <i>
                {variation.structure.name} {new Date(variation.created_at).toLocaleDateString()}
              </i>
            </Text>
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default function CheckboxList({ variations }: { variations: Array<Variation> }) {
  const { checkedIds, checkAllIds } = useVariationsContext()
  const total = variations.length

  return (
    <Container fluid>
      <Text size="lg" bold>
        Demandes{" "}
        <Button
          className="fr-ml-4w"
          size="sm"
          variant="tertiary"
          disabled={total === 0}
          onClick={() => checkAllIds(checkedIds.length === total ? [] : variations.map((variation) => variation.id))}
        >
          {checkedIds.length === total ? "Tout déselectionner" : "Tout sélectionner"}
        </Button>
      </Text>
      <Container className="fr-pl-1w">
        {variations.map((variation, index) => (
          <CheckboxItem key={index} variation={variation} />
        ))}
      </Container>
    </Container>
  )
}
