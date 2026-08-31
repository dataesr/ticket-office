import { useLocation } from "react-router-dom";
import "./styles.scss";

type SelectorsProps = {
  sort: string;
  status: string;
  setSort: (value: string) => void;
  setStatus: (value: string) => void;
  searchInMessage?: boolean;
  setSearchInMessage?: (value: boolean) => void;
  objectType?: string;
  setObjectType?: (value: string) => void;
  layout?: "stacked" | "inline";
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
  layout = "stacked",
}) => {
  const location = useLocation();
  const isScanrContributionPage = location.pathname.includes(
    "/scanr-contributionPage"
  );
  const isInline = layout === "inline";
  const groupClassName = isInline
    ? "fr-select-group fr-mb-0"
    : "fr-select-group fr-mb-2w";

  return (
    <div className={isInline ? "filter-bar" : undefined}>
      <div className={groupClassName}>
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
        <div className={groupClassName}>
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
      )}

      <div className={groupClassName}>
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

      {setSearchInMessage && (
        <div className="fr-toggle fr-mb-0 filter-bar__toggle">
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
            {isInline ? "Dans les messages" : "Rechercher dans les messages"}
          </label>
        </div>
      )}
    </div>
  );
};

export default Selectors;
