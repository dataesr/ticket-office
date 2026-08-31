import { useLocation } from "react-router-dom";
import { useState } from "react";
import HighlightedMessage from "../../../components/highlighted-message";
import EditModal from "../../../components/edit-modal";
import { capitalizeFirstLetter } from "../../../utils/capitalize";
import { CopyButton } from "../../../utils/copy-button";
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
    scanr: `${SCANR_URL}/publication/`,
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
  refetch,
  allTags,
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { copiedText, copyToClipboard } = useCopyToClipboard();

  const contributorMessageClassName = location.pathname.includes(
    "contributionpage"
  )
    ? "contributorSideMessage"
    : "contributorSideContactMessage";

  return (
    <>
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div className="fr-col-12 fr-col-md-6">
          {data?.objectId && data?.objectType !== "network" && (
            <p className="fr-text--sm">
              ID de l'objet concerné :{" "}
              <strong>
                {data.objectId?.length > 50
                  ? data.objectId.slice(0, 47) + "..."
                  : data.objectId}
              </strong>
              <CopyButton
                text={data.objectId}
                copiedText={copiedText}
                onCopy={copyToClipboard}
              />
            </p>
          )}
          <p className="fr-text--sm">
            Nom :{" "}
            {data?.name ? <strong>{data.name}</strong> : "non renseigné"}
            {data?.name && (
              <CopyButton
                text={data.name}
                copiedText={copiedText}
                onCopy={copyToClipboard}
              />
            )}
          </p>
          {data?.email && (
            <p className="fr-text--sm">
              Email : <strong>{data?.email}</strong>
              <CopyButton
                text={data.email}
                copiedText={copiedText}
                onCopy={copyToClipboard}
              />
            </p>
          )}
        </div>
        <div className="fr-col-12 fr-col-md-6">
          {data?.extra && (
            <ul className="fr-raw-list">
              {Object.entries(data.extra).map(([key, value]) => {
                if (value === "") return null;

                const displayKey =
                  key === "subApplication"
                    ? "Sujet"
                    : capitalizeFirstLetter(key);

                const capitalizedValue =
                  typeof value === "string"
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : String(value);

                return (
                  <li key={key}>
                    <p className="fr-text--sm">
                      {displayKey} : <strong>{capitalizedValue}</strong>
                      <CopyButton
                        text={capitalizedValue}
                        copiedText={copiedText}
                        onCopy={copyToClipboard}
                      />
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {data?.team?.length > 0 && (
        <p className="fr-text--sm">
          Traité par :{" "}
          <strong>
            {data.team[0]} le{" "}
            {new Date(data.treated_at).toLocaleDateString()} à{" "}
            {new Date(data.treated_at).toLocaleTimeString()}
          </strong>
        </p>
      )}

      {data?.comment && (
        <p className="fr-text--sm">
          Commentaire ({data.team ? data.team[0] : ""})
          {" "}: <strong>{data.comment}</strong>
        </p>
      )}

      {data?.objectType && OBJECT_LINKS[data.objectType] && (
        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left fr-mb-2w">
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
                  href={`${OBJECT_LINKS[data.objectType].scanr}${data.objectId}`}
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

      <div className={`${contributorMessageClassName} fr-mt-3w fr-mb-3w`}>
        <HighlightedMessage
          message={data?.message}
          highlightedQuery={highlightedQuery}
        />
      </div>

      <button
        type="button"
        className="fr-btn fr-mb-5w"
        onClick={() => setShowModal(true)}
      >
        Éditer la contribution
      </button>

      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
        allTags={allTags}
        dataProduction={[]}
      />
    </>
  );
};

export default MessagePreview;
