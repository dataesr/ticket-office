import {
  Badge,
  Col,
  Row,
  SideMenu,
  SideMenuItem,
  Text,
} from "@dataesr/dsfr-plus";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { ContributorSummaryProps } from "../../../types";

const ContributorSummary: React.FC<ContributorSummaryProps> = ({
  contributions,
  onSelectContribution,
}) => {
  const handleClick = (id: string) => {
    onSelectContribution(id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <SideMenu title="Contributeurs" sticky fullHeight>
      {contributions.map((contribution, index) => (
        <SideMenuItem
          key={`${contribution.id}-${index}`}
          className="contribution-message"
          title={
            <>
              <Row>
                <Col>
                  {contribution?.type && (
                    <Badge
                      size="sm"
                      icon={typeIcon({ icon: contribution.type })}
                      color={BadgeColor({ type: contribution.type })}
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {TypeLabel({ type: contribution.type })}
                    </Badge>
                  )}
                  {contribution?.status && (
                    <Badge
                      size="sm"
                      color={BadgeStatus({ status: contribution?.status })}
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {StatusLabel({ status: contribution.status })}
                    </Badge>
                  )}
                  {contribution?.tags?.length > 0 &&
                    contribution.tags
                      .filter((tag) => tag !== "")
                      .map((tag, key) => (
                        <Badge
                          key={key}
                          size="sm"
                          color="green-menthe"
                          className="fr-mr-1w fr-mb-1w"
                        >
                          {tag}
                        </Badge>
                      ))}
                </Col>
              </Row>
              <div>
                <Text size="sm">
                  {contribution.name}{" "}
                  {new Date(contribution.created_at).toLocaleDateString()}
                </Text>
                <p className="contribution-message">{contribution.message}</p>
              </div>
            </>
          }
          defaultExpanded={false}
          onClick={() => handleClick(contribution?.id)}
        />
      ))}
    </SideMenu>
  );
};

export default ContributorSummary;
