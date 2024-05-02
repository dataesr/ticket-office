import { Col, Toggle } from "@dataesr/dsfr-plus";

const Selectors = ({
  setSort,
  status,
  setStatus,
  searchInMessage,
  setSearchInMessage,
}) => {
  return (
    <Col offsetLg="1">
      <select
        className="fr-select"
        name="order"
        id="order"
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="DESC">Plus récentes </option>
        <option value="ASC">Plus anciennes</option>
      </select>
      <select
        className="fr-select"
        name="status"
        id="status"
        onChange={(e) => setStatus(e.target.value)}
        defaultValue={status}
      >
        <option value="choose">Toutes les contributions</option>
        <option value="new">Nouvelles contributions</option>
        <option value="ongoing">Contribution en traitement</option>
        <option value="treated">Contributions traités</option>
      </select>
      <Toggle
        checked={searchInMessage}
        id="searchInMessage"
        name={"Rechercher dans les messages"}
        onChange={(e) => setSearchInMessage(e.target.checked)}
        label="Rechercher dans les messages"
      />
    </Col>
  );
};

export default Selectors;
