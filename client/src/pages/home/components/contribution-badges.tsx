import { Badge, BadgeGroup } from "@dataesr/dsfr-plus";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  typeIcon,
  TypeLabel,
} from "../../../utils";
import { UnifiedContribution } from "../../../types";
import { getContributionLabel, isFromScanR } from "../utils";

type ContributionBadgesProps = { contribution: UnifiedContribution };

const ContributionBadges = ({ contribution }: ContributionBadgesProps) => (
  <BadgeGroup>
    {contribution.objectType && (
      <Badge
        size="sm"
        icon={typeIcon({ icon: contribution.objectType })}
        color={BadgeColor({ type: contribution.objectType })}
      >
        {TypeLabel({ type: contribution.objectType })}
      </Badge>
    )}
    {isFromScanR(contribution) && (
      <Badge size="sm" color="blue-ecume">
        scanR
      </Badge>
    )}
    <Badge size="sm" color="blue-ecume">
      {getContributionLabel(contribution)}
    </Badge>
    {contribution.fromApplication &&
      contribution.fromApplication !== "scanr" && (
        <Badge size="sm" color="blue-ecume">
          {contribution.fromApplication}
        </Badge>
      )}
    {contribution.csv && (
      <Badge size="sm" color="green-menthe">
        BSO
      </Badge>
    )}
    <Badge size="sm" color={BadgeStatus({ status: contribution.status })}>
      {StatusLabel({ status: contribution.status })}
    </Badge>
  </BadgeGroup>
);

export default ContributionBadges;
