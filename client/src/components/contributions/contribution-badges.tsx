import { Badge } from "@dataesr/dsfr-plus";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../utils";
import { Contribution } from "../../types";

type ContributionBadgesProps = { contribution?: Contribution };

const ContributionBadges = ({ contribution }: ContributionBadgesProps) => {
  const firstResponse = contribution?.threads?.[0]?.responses?.[0];

  return (
    <ul className="fr-badges-group fr-mb-1w">
      {contribution?.tags?.length > 0 && (
        <li>
          <Badge size="sm" color="green-menthe">
            {contribution.tags.join(", ")}
          </Badge>
        </li>
      )}
      {contribution?.status && (
        <li>
          <Badge size="sm" color={BadgeStatus({ status: contribution.status })}>
            {StatusLabel({ status: contribution.status })}
          </Badge>
        </li>
      )}
      {firstResponse?.team && (
        <li>
          <Badge size="sm" color="blue-ecume">
            {`Réponse : ${firstResponse.team}`}
          </Badge>
        </li>
      )}
      {contribution?.comment && contribution?.team?.length > 0 && (
        <li>
          <Badge size="sm" color="green-emeraude">
            {`Commenté par ${contribution.team[0]}`}
          </Badge>
        </li>
      )}
      {contribution?.objectType && (
        <li>
          <Badge
            size="sm"
            color={BadgeColor({ type: contribution.objectType })}
            icon={typeIcon({ icon: contribution.objectType })}
          >
            {TypeLabel({ type: contribution.objectType })}
          </Badge>
        </li>
      )}
    </ul>
  );
};

export default ContributionBadges;
