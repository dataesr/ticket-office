import { Badge } from "@dataesr/dsfr-plus";
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
  <ul className="fr-badges-group">
    {contribution.objectType && (
      <li>
        <Badge
          size="sm"
          icon={typeIcon({ icon: contribution.objectType })}
          color={BadgeColor({ type: contribution.objectType })}
        >
          {TypeLabel({ type: contribution.objectType })}
        </Badge>
      </li>
    )}
    {isFromScanR(contribution) && (
      <li>
        <Badge size="sm" color="blue-ecume">
          scanR
        </Badge>
      </li>
    )}
    <li>
      <Badge size="sm" color="blue-ecume">
        {getContributionLabel(contribution)}
      </Badge>
    </li>
    {contribution.fromApplication &&
      contribution.fromApplication !== "scanr" && (
        <li>
          <Badge size="sm" color="blue-ecume">
            {contribution.fromApplication}
          </Badge>
        </li>
      )}
    {contribution.csv && (
      <li>
        <Badge size="sm" color="green-menthe">
          BSO
        </Badge>
      </li>
    )}
    <li>
      <Badge size="sm" color={BadgeStatus({ status: contribution.status })}>
        {StatusLabel({ status: contribution.status })}
      </Badge>
    </li>
  </ul>
);

export default ContributionBadges;
