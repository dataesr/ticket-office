import {
  Badge,
  Col,
  Row,
  SideMenu,
  SideMenuItem,
  Text,
} from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "./utils";

interface ContributorSummaryProps {
  contributions: Contribution[];
  onSelectContribution: (id: string) => void;
}

const ContributorSummary: React.FC<ContributorSummaryProps> = ({
  contributions,
  onSelectContribution,
}) => {
  const handleClick = (id: string) => {
    onSelectContribution(id);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };
  return (
    <SideMenu title="Contributeurs" sticky fullHeight>
      {contributions?.map((contribution) => (
        <SideMenuItem
          key={contribution._id}
          className="contribution-message"
          title={
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
                    .map((tag) => (
                      <Badge
                        key={tag}
                        size="sm"
                        color="purple-glycine"
                        className="fr-mr-1w fr-mb-1w"
                      >
                        {tag}
                      </Badge>
                    ))}
              </Col>
              <div>
                <Text size="sm">
                  {contribution.name}{" "}
                  {new Date(contribution.created_at).toLocaleDateString()}
                </Text>
                <p className="contribution-message">{contribution.message}</p>
              </div>
            </Row>
          }
          defaultExpanded={false}
          onClick={() => handleClick(contribution._id)}
        />
      ))}
    </SideMenu>
  );
};

export default ContributorSummary;
