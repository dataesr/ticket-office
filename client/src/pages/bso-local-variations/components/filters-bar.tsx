import { Col, Container, Row } from "@dataesr/dsfr-plus"
import useUrl from "../hooks/useUrl"
import SearchSection from "../../contact-contributionbyobject-page/components/search-section"
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
    <Container fluid className="fr-mt-5w">
      <Row>
        <Col className="fr-pr-1w fr-mb-5w">
          <SearchSection
            query={currentQuery}
            handleSearch={handleQueryChange}
            handleRemoveQueryItem={removeQueryItem}
            isLarge={false}
          />
        </Col>
        <Col className="fr-pr-1w">
          <select
            value={currentStatus || "choose"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Status ?</option>
            <option value={"new"}>Nouveau</option>
            <option value={"ongoing"}>En cours</option>
            <option value={"treated"}>Traité</option>
          </select>
        </Col>
        <Col className="fr-pr-1w">
          <select value={currentFile || "choose"} onChange={(e) => handleFileChange(e.target.value)} className="fr-select">
            <option value={"choose"}>Fichier ?</option>
            {Object.entries(VARIATION_TAGS.file).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </Col>
        <Col className="fr-pr-1w">
          <select value={currentCode || "choose"} onChange={(e) => handleCodeChange(e.target.value)} className="fr-select">
            <option value={"choose"}>Code ?</option>
            {Object.entries(VARIATION_TAGS.code).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </Col>
        <Col className="fr-pr-1w">
          <select value={currentIndex || "choose"} onChange={(e) => handleIndexChange(e.target.value)} className="fr-select">
            <option value={"choose"}>Index ?</option>
            {Object.entries(VARIATION_TAGS.index).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </Col>
        <Col>
          <select
            value={currentNotification || "choose"}
            onChange={(e) => handleNotificationChange(e.target.value)}
            className="fr-select"
          >
            <option value={"choose"}>Messages ?</option>
            {Object.entries(VARIATION_TAGS.notification).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
    </Container>
  )
}
