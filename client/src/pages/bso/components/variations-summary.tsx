import { Badge, BadgeGroup, Col, Row, SideMenu, SideMenuItem, Text } from "@dataesr/dsfr-plus"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { VariationsSummaryProps } from "../types"

const VariationsSummary: React.FC<VariationsSummaryProps> = ({ variations, onSelectedVariation }) => {
  const handleClick = (id: string) => {
    onSelectedVariation(id)
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  return (
    <SideMenu title="Demandes" sticky fullHeight>
      {variations.map((variation, index) => (
        <SideMenuItem
          key={`${variation.id}-${index}`}
          className="contribution-message"
          title={
            <>
              <Row gutters>
                <Col>
                  <BadgeGroup>
                    <Badge size="sm" color={BadgeStatus({ status: variation?.status })} className="fr-mr-1w fr-mb-1w">
                      {StatusLabel({ status: variation.status })}
                    </Badge>
                  </BadgeGroup>
                </Col>
              </Row>
              <div>
                <Text size="sm">
                  {variation.structure.name} {new Date(variation.created_at).toLocaleDateString()}
                </Text>
              </div>
            </>
          }
          defaultExpanded={false}
          onClick={() => handleClick(variation?.id)}
        />
      ))}
    </SideMenu>
  )
}

export default VariationsSummary
