import InfoRow from "../info-row";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { capitalizeFirstLetter } from "../../utils/capitalize";
import { Contribution } from "../../types";

type ContributionInfoProps = { contribution?: Contribution };

const ContributionInfo = ({ contribution }: ContributionInfoProps) => {
  const copy = useCopyToClipboard();

  const extraEntries = contribution?.extra
    ? Object.entries(contribution.extra).filter(([, value]) => value !== "")
    : [];

  return (
    <div className="contribution-info fr-mb-2w">
      <InfoRow
        {...copy}
        icon="user-line"
        label="Nom"
        value={contribution?.name || "Non renseigné"}
        copyText={contribution?.name}
      />

      {contribution?.email && (
        <InfoRow
          {...copy}
          icon="mail-line"
          label="Email"
          value={contribution.email}
          copyText={contribution.email}
        />
      )}

      {contribution?.objectId && contribution?.objectType !== "network" && (
        <InfoRow
          {...copy}
          icon="links-line"
          label="ID de l'objet concerné"
          value={contribution.objectId}
          copyText={contribution.objectId}
        />
      )}

      {contribution?.team?.length > 0 && (
        <InfoRow
          {...copy}
          icon="team-line"
          label="Traité par"
          value={`${contribution.team[0]} le ${new Date(
            contribution.treated_at
          ).toLocaleDateString()} à ${new Date(
            contribution.treated_at
          ).toLocaleTimeString()}`}
        />
      )}

      {contribution?.comment && (
        <InfoRow
          {...copy}
          icon="message-2-line"
          label={`Commentaire${contribution.team?.[0] ? ` (${contribution.team[0]})` : ""}`}
          value={contribution.comment}
        />
      )}

      {extraEntries.map(([key, value]) => {
        const displayKey =
          key === "subApplication" ? "Sujet" : capitalizeFirstLetter(key);
        const displayValue =
          typeof value === "string"
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : String(value);

        return (
          <InfoRow
            {...copy}
            key={key}
            icon="file-text-line"
            label={displayKey}
            value={displayValue}
            copyText={displayValue}
          />
        );
      })}
    </div>
  );
};

export default ContributionInfo;
