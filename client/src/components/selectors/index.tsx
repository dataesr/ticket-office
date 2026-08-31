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
    <div>
      <div className="fr-select-group fr-mb-2w">
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

      {isScanrContributionPage && setObjectType && (
        <div className="fr-select-group fr-mb-2w">
          <label className="fr-label fr-sr-only" htmlFor="object-type-select">
            Type d'objet
          </label>
          <select
            id="object-type-select"
            className="fr-select"
            value={objectType || "all"}
            onChange={(e) => setObjectType(e.target.value)}
          >
            <option value="all">Tous les types d'objets</option>
            <option value="persons">Personnes</option>
            <option value="structures">Structures</option>
            <option value="publications">Publications</option>
            <option value="projects">Projets</option>
            <option value="network">Réseaux</option>
          </select>
        </div>
      )}

      <div className="fr-select-group fr-mb-2w">
        <label className="fr-label fr-sr-only" htmlFor="status-select">
          Filtrer par statut
        </label>
        <select
          id="status-select"
          className="fr-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="choose">Toutes les contributions</option>
          <option value="new">Nouvelles contributions</option>
          <option value="ongoing">Contribution en traitement</option>
          <option value="treated">Contributions traitées</option>
        </select>
      </div>

      {setSearchInMessage && (
        <div className="fr-toggle">
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
            Rechercher dans les messages
          </label>
        </div>
      )}
    </div>
  );
};

export default Selectors;
