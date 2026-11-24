import HighlightedMessage from "../../../components/highlighted-message";
import { capitalizeFirstLetter } from "../../../utils/capitalize";
import InfoRow from "../../../components/info-row";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import { MessagePreviewProps } from "../../../types";

const SCANR_URL = "https://scanr.enseignementsup-recherche.gouv.fr";
const DATAESR_URL = "http://185.161.45.213/ui";

const OBJECT_LINKS: Record<string, { scanr: string; dataesr?: string }> = {
  structures: {
    scanr: `${SCANR_URL}/entite/`,
    dataesr: `${DATAESR_URL}/organizations/`,
  },
  publications: {
    scanr: `${SCANR_URL}/publications/`,
    dataesr: `${DATAESR_URL}/publications/`,
  },
  persons: {
    scanr: `${SCANR_URL}/authors/`,
    dataesr: `${DATAESR_URL}/persons/`,
  },
  network: { scanr: `${SCANR_URL}/networks?` },
};

const MessagePreview: React.FC<MessagePreviewProps> = ({
  data,
  highlightedQuery,
}) => {
  const copy = useCopyToClipboard();

  const extraEntries = data?.extra
    ? Object.entries(data.extra).filter(([, value]) => value !== "")
    : [];

  return (
    <>
      <div className="contribution-info fr-mb-2w">
        <InfoRow
          {...copy}
          icon="user-line"
          label="Nom"
          value={data?.name || "Non renseigné"}
          copyText={data?.name}
        />

        {data?.email && (
          <InfoRow
            {...copy}
            icon="mail-line"
            label="Email"
            value={data.email}
            copyText={data.email}
          />
        )}

        {data?.objectId && data?.objectType !== "network" && (
          <InfoRow
            {...copy}
            icon="links-line"
            label="ID de l'objet concerné"
            value={data.objectId}
            copyText={data.objectId}
          />
        )}

        {data?.team?.length > 0 && (
          <InfoRow
            {...copy}
            icon="team-line"
            label="Traité par"
            value={`${data.team[0]} le ${new Date(
              data.treated_at
            ).toLocaleDateString()} à ${new Date(
              data.treated_at
            ).toLocaleTimeString()}`}
          />
        )}

        {data?.comment && (
          <InfoRow
            {...copy}
            icon="message-2-line"
            label={`Commentaire${data.team?.[0] ? ` (${data.team[0]})` : ""}`}
            value={data.comment}
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

      {data?.objectType && OBJECT_LINKS[data.objectType] && (
        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left fr-mb-3w">
          {data.objectType === "structures" && (
            <>
              <li>
                <a
                  className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${OBJECT_LINKS.structures.scanr}${data.objectId}`}
                >
                  Sur scanR
                </a>
              </li>
              <li>
                <a
                  className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${OBJECT_LINKS.structures.dataesr}${data.objectId}`}
                >
                  Sur dataESR
                </a>
              </li>
            </>
          )}
          {(data.objectType === "publications" ||
            data.objectType === "persons") && (
            <>
              <li>
                <a
                  className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${OBJECT_LINKS[data.objectType].scanr}${encodeURIComponent(data.objectId)}`}
                >
                  Sur scanR
                </a>
              </li>
              <li>
                <a
                  className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${OBJECT_LINKS[data.objectType].dataesr}${data.objectId}`}
                >
                  Sur dataESR
                </a>
              </li>
            </>
          )}
          {data.objectType === "network" && (
            <li>
              <a
                className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
                target="_blank"
                rel="noopener noreferrer"
                href={`${OBJECT_LINKS.network.scanr}${data.objectId}`}
              >
                Sur scanR
              </a>
            </li>
          )}
        </ul>
      )}

      <div className="contributorSideMessage fr-mb-3w">
        <HighlightedMessage
          message={data?.message}
          highlightedQuery={highlightedQuery}
        />
      </div>
    </>
  );
};

export default MessagePreview;
