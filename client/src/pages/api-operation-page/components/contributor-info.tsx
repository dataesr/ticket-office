import InfoRow from "../../../components/info-row";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import { Contribute_Production } from "../../../types";

type ContributorInfoProps = {
  contribution: Contribute_Production;
  idrefName: string;
};

const ContributorInfo = ({ contribution, idrefName }: ContributorInfoProps) => {
  const copy = useCopyToClipboard();

  return (
    <div className="contribution-info contribution-info--inline-copy fr-mb-2w">
      {contribution.objectId && (
        <InfoRow
          {...copy}
          icon="links-line"
          label="ID de la personne concernée"
          value={contribution.objectId}
          copyText={contribution.objectId}
        />
      )}

      <InfoRow
        {...copy}
        icon="user-star-line"
        label="Nom sur scanR (via IdRef)"
        value={idrefName || "Nom non existant sur scanR"}
        valueClassName={idrefName ? "" : "fr-text-default--error"}
        copyText={idrefName}
      />

      <InfoRow
        {...copy}
        icon="user-line"
        label="Nom renseigné dans la contribution"
        value={contribution.name}
      />

      {contribution.email && (
        <InfoRow
          {...copy}
          icon="mail-line"
          label="Email"
          value={contribution.email}
          copyText={contribution.email}
        />
      )}

      {contribution.comment && (
        <InfoRow
          {...copy}
          icon="message-2-line"
          label={`Commentaire${contribution.team?.[0] ? ` (${contribution.team[0]})` : ""}`}
          value={contribution.comment}
        />
      )}
    </div>
  );
};

export default ContributorInfo;
