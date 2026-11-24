const SCANR_URL = "https://scanr.enseignementsup-recherche.gouv.fr";
const DATAESR_URL = "http://185.161.45.213/ui";

const SCANR_LINKS: Record<string, (id: string) => string> = {
  structures: (id) => `${SCANR_URL}/entite/${id}`,
  publications: (id) => `${SCANR_URL}/publications/${encodeURIComponent(id)}`,
  persons: (id) => `${SCANR_URL}/authors/${encodeURIComponent(id)}`,
  network: (id) => `${SCANR_URL}/networks?${id}`,
};

const DATAESR_LINKS: Record<string, (id: string) => string> = {
  structures: (id) => `${DATAESR_URL}/organizations/${id}`,
  publications: (id) => `${DATAESR_URL}/publications/${id}`,
  persons: (id) => `${DATAESR_URL}/persons/${id}`,
};

type ObjectLinksProps = { objectType?: string; objectId?: string };

const ObjectLinks = ({ objectType, objectId }: ObjectLinksProps) => {
  const scanrLink = SCANR_LINKS[objectType];
  const dataesrLink = DATAESR_LINKS[objectType];

  if (!scanrLink) return null;

  return (
    <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left fr-mb-3w">
      <li>
        <a
          className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
          target="_blank"
          rel="noopener noreferrer"
          href={scanrLink(objectId)}
        >
          Sur scanR
        </a>
      </li>
      {dataesrLink && (
        <li>
          <a
            className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line"
            target="_blank"
            rel="noopener noreferrer"
            href={dataesrLink(objectId)}
          >
            Sur dataESR
          </a>
        </li>
      )}
    </ul>
  );
};

export default ObjectLinks;
