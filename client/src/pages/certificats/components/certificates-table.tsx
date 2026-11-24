import { Badge, Text } from "@dataesr/dsfr-plus";
import { Certificate } from "../api";
import { CERTIFICATE_OWNERS, Organisme } from "../certificate-owners";

const URGENCE_COLORS = {
  Critique: "error",
  Élevée: "warning",
  Moyenne: "info",
  Faible: "success",
} as const;

const ORGANISME_COLORS = {
  DISD: "blue-ecume",
  DNE: "purple-glycine",
  HuWise: "orange-terre-battue",
} as const;

const getRemainingDaysClassName = (days: number) => {
  if (days <= 5) return "fr-text-default--error";
  if (days <= 30) return "fr-text-default--warning";
  return "";
};

const OrganismeBadge = ({ organisme }: { organisme?: Organisme }) =>
  organisme ? (
    <Badge color={ORGANISME_COLORS[organisme]} size="sm" noIcon>
      {organisme}
    </Badge>
  ) : (
    "Non renseigné"
  );

type CertificatesTableProps = { certificates: Certificate[] };

const CertificatesTable = ({ certificates }: CertificatesTableProps) => (
  <div className="fr-table fr-table--no-caption fr-table--layout-fixed">
    <table>
      <caption>Certificats SSL surveillés</caption>
      <thead>
        <tr>
          <th scope="col">Site</th>
          <th scope="col">Date d'expiration</th>
          <th scope="col">Jours restants</th>
          <th scope="col">Statut</th>
          <th scope="col">Urgence</th>
          <th scope="col">Gestion</th>
          <th scope="col">Hébergement</th>
        </tr>
      </thead>
      <tbody>
        {certificates.map((certificate) => {
          const owner = CERTIFICATE_OWNERS[certificate.site];

          return (
            <tr key={certificate.site}>
              <td>
                <strong>{certificate.site}</strong>
                {certificate.error && (
                  <Text size="xs" className="fr-text-default--error fr-mb-0">
                    {certificate.error}
                  </Text>
                )}
              </td>
              <td>{certificate.expiration}</td>
              <td>
                <Text
                  as="span"
                  className={getRemainingDaysClassName(
                    certificate.joursRestants
                  )}
                >
                  {certificate.joursRestants < 0
                    ? "Expiré"
                    : certificate.joursRestants}
                </Text>
              </td>
              <td>{certificate.statut}</td>
              <td>
                <Badge
                  color={URGENCE_COLORS[certificate.urgence] ?? "info"}
                  size="sm"
                >
                  {certificate.urgence}
                </Badge>
              </td>
              <td>
                <OrganismeBadge organisme={owner?.gestion} />
              </td>
              <td>
                <OrganismeBadge organisme={owner?.hebergement} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default CertificatesTable;
