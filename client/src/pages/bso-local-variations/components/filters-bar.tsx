import useUrl from "../hooks/useUrl"
import SearchSection from "../../../components/search-section"
import { VARIATION_TAGS } from "../config/tags"

export default function FiltersBar() {
  const {
    currentQuery,
    currentStatus,
    currentFile,
    currentCode,
    currentIndex,
    currentNotification,
    handleQueryChange,
    handleStatusChange,
    handleFileChange,
    handleCodeChange,
    handleIndexChange,
    handleNotificationChange,
    removeQueryItem,
  } = useUrl()

  return (
    <div className="bso-header-row">
      <div className="bso-header-row__search">
        <SearchSection
          query={currentQuery}
          handleSearch={handleQueryChange}
          handleRemoveQueryItem={removeQueryItem}
        />
      </div>

      <div className="bso-filter-bar">
        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="bso-status">
            Statut
          </label>
          <select
            id="bso-status"
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Tous les status</option>
            <option value={"new"}>Nouveau</option>
            <option value={"ongoing"}>En cours</option>
            <option value={"treated"}>Traité</option>
            <option value={"question"}>Question</option>
            <option value={"ko"}>KO</option>
          </select>
        </div>

        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="bso-file">
            Fichier
          </label>
          <select
            id="bso-file"
            value={currentFile}
            onChange={(e) => handleFileChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Tous les fichiers</option>
            {Object.entries(VARIATION_TAGS.file).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="bso-code">
            Configuration
          </label>
          <select
            id="bso-code"
            value={currentCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Toutes les config</option>
            {Object.entries(VARIATION_TAGS.code).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="bso-index">
            Index
          </label>
          <select
            id="bso-index"
            value={currentIndex}
            disabled
            onChange={(e) => handleIndexChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Tous les index</option>
            {Object.entries(VARIATION_TAGS.index).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="fr-select-group fr-mb-0">
          <label className="fr-label fr-sr-only" htmlFor="bso-notification">
            Message
          </label>
          <select
            id="bso-notification"
            value={currentNotification}
            onChange={(e) => handleNotificationChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Tous les messages</option>
            {Object.entries(VARIATION_TAGS.notification).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
