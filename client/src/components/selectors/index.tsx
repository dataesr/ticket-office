import { Col, Toggle } from "@dataesr/dsfr-plus";
import { useLocation } from "react-router-dom";

const Selectors = ({
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

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleObjectTypeChange = (event) => {
    setObjectType(event.target.value);
  };

  return (
    <Col xs="12" offsetLg="1">
      <Col className="fr-mb-1w">
        <select value={sort} onChange={handleSortChange} className="fr-select">
          <option value="DESC">Plus récentes</option>
          <option value="ASC">Plus anciennes</option>
        </select>
      </Col>

      {isScanrContributionPage && setObjectType && (
        <Col className="fr-mb-1w">
          <select
            value={objectType || "all"}
            onChange={handleObjectTypeChange}
            className="fr-select"
            aria-label="Type d'objet"
          >
            <option value="all">Tous les types d'objets</option>
            <option value="persons">Personnes</option>
            <option value="structures">Structures</option>
            <option value="publications">Publications</option>
            <option value="projects">Projets</option>
            <option value="network">Réseaux</option>
          </select>
        </Col>
      )}

      <select
        value={status}
        onChange={handleStatusChange}
        className="fr-select"
      >
        <option value="choose">Toutes les contributions</option>
        <option value="new">Nouvelles contributions</option>
        <option value="ongoing">Contribution en traitement</option>
        <option value="treated">Contributions traitées</option>
      </select>

      {setSearchInMessage && (
        <Toggle
          checked={searchInMessage}
          id="searchInMessage"
          name="Rechercher dans les messages"
          onChange={(e) => setSearchInMessage(e.target.checked)}
          label="Rechercher dans les messages"
        />
      )}
    </Col>
  );
};

export default Selectors;
