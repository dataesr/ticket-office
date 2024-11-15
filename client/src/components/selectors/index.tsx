import { Col, Toggle } from "@dataesr/dsfr-plus";

const Selectors = ({
  sort,
  status,
  setSort,
  setStatus,
  searchInMessage,
  setSearchInMessage,
}) => {
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Col offsetLg="1">
      <Col className="fr-mb-1w">
        <select value={sort} onChange={handleSortChange} className="fr-select">
          <option value="DESC">Plus récentes</option>
          <option value="ASC">Plus anciennes</option>
        </select>
      </Col>
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
      {location.pathname !== "/scanr-apioperations" && (
        <Toggle
          checked={searchInMessage}
          id="searchInMessage"
          name={"Rechercher dans les messages"}
          onChange={(e) => setSearchInMessage(e.target.checked)}
          label="Rechercher dans les messages"
        />
      )}
    </Col>
  );
};

export default Selectors;
