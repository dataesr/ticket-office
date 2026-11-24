import { Col, Row } from "@dataesr/dsfr-plus";
import { useLocation } from "react-router-dom";

type SelectorsProps = {
  sort: string;
  status: string;
  setSort: (value: string) => void;
  setStatus: (value: string) => void;
  searchInMessage?: boolean;
  setSearchInMessage?: (value: boolean) => void;
  objectType?: string;
  setObjectType?: (value: string) => void;
};
const Selectors: React.FC<SelectorsProps> = ({
  sort,
  status,
  setSort,
  setStatus,
  searchInMessage,
  setSearchInMessage,
  objectType,
  setObjectType,
}) => {
  const location = useLocation();
  const isScanrContributionPage = location.pathname.includes(
    "/scanr-contributionPage"
  );

  return (
    <Row gutters verticalAlign="middle" className="fr-mt-2w">
      <Col xs={12} md={3}>
        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="sort-select">
            Trier par date
          </label>
          <select
            id="sort-select"
            className="fr-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="DESC">Plus récentes</option>
            <option value="ASC">Plus anciennes</option>
          </select>
        </div>
      </Col>

      {isScanrContributionPage && setObjectType && (
        <Col xs={12} md={3}>
          <div className="fr-select-group fr-mb-0">
            <label className="fr-label fr-sr-only" htmlFor="object-type-select">
              Type d'objet
            </label>
            <select
              id="object-type-select"
              className="fr-select"
              value={objectType || "all"}
              onChange={(e) => setObjectType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="persons">Personnes</option>
              <option value="structures">Structures</option>
              <option value="publications">Publications</option>
              <option value="projects">Projets</option>
              <option value="network">Réseaux</option>
            </select>
          </div>
        </Col>
      )}

      <Col xs={12} md={3}>
        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="status-select">
            Filtrer par statut
          </label>
          <select
            id="status-select"
            className="fr-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="choose">Tous les statuts</option>
            <option value="new">Nouvelles</option>
            <option value="ongoing">En traitement</option>
            <option value="treated">Traitées</option>
          </select>
        </div>
      </Col>

      {setSearchInMessage && (
        <Col xs={12} md={3}>
          <div className="fr-toggle fr-mb-0">
            <input
              type="checkbox"
              className="fr-toggle__input"
              id="search-in-message-toggle"
              checked={searchInMessage}
              onChange={(e) => setSearchInMessage(e.target.checked)}
            />
            <label
              className="fr-toggle__label"
              htmlFor="search-in-message-toggle"
            >
              Dans les messages
            </label>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default Selectors;
