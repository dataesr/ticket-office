import { Badge, BadgeGroup, Checkbox, Col, Container, Row, Text } from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { useVariationsContext } from "../context"

const CheckboxItem = ({ variation }: { variation: Variation }) => {
  const { checkedIds, checkId, setSelectedId } = useVariationsContext()

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
              <Badge size="sm" color={BadgeStatus({ status: variation?.status })} className="fr-mr-1w fr-mb-1w">
                {StatusLabel({ status: variation.status })}
              </Badge>
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
  return (
    <Container fluid className="fr-mt-3w">
      <Text size="lg" bold>
        Demandes
      </Text>
      <Container className="fr-pl-1w">
        {variations.map((variation, index) => (
          <CheckboxItem key={index} variation={variation} />
        ))}
      </Container>
    </Container>
  )
}
