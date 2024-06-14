import React from "react";
import { Badge, SideMenu, SideMenuItem, Text } from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";

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
      {contributions.map((contribution) => (
        <SideMenuItem
          key={contribution.id}
          title={
            <div>
              {contribution?.status && (
                <Badge
                  size="sm"
                  color="purple-glycine"
                  className="fr-mr-1w fr-mb-1w"
                >
                  {contribution.status}
                </Badge>
              )}
              {contribution?.tags?.length > 0 && (
                <Badge
                  size="sm"
                  color="purple-glycine"
                  className="fr-mr-1w fr-mb-1w"
                >
                  {contribution.tags.join(", ")}
                </Badge>
              )}
              <Text size="sm">{contribution.name}</Text>
              <Text size="sm" className="fr-text--italic">
                {new Date(contribution.created_at).toLocaleDateString()}
              </Text>
            </div>
          }
          defaultExpanded={false}
          onClick={() => handleClick(contribution._id)}
        />
      ))}
    </SideMenu>
  );
};

export default ContributorSummary;
