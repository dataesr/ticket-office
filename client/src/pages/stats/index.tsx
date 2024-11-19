import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useState, useEffect } from "react";
import ContributionsGraphByTags from "../../components/graphs/by-tags";
import { buildStatsURL } from "../../api/utils/buildURL";
import ContributionData from "../../api/contribution-api/getData";
import ContributionsGraphByTeam from "../../components/graphs/response-by-admin";
import ContributionsGraphByStatus from "../../components/graphs/by-status";
import ContributionsGraphByTopContributors from "../../components/graphs/contributions-by-name";
import ContributionsGraphByTime from "../../components/graphs/contributions-by-year";
import { ClipLoader } from "react-spinners";

const GetStats = () => {
  const [filter, setFilter] = useState("contacts");
  const [url, setUrl] = useState(() => buildStatsURL(filter));

  useEffect(() => {
    const newUrl = buildStatsURL(filter);
    setUrl(newUrl);
  }, [filter]);

  const { data, isLoading, isError } = ContributionData(url);

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }
  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(data?.data)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  return (
    <Container className="fr-mt-5w">
      <Col md="12">
        <Title look="h5">Choisissez la table de données à afficher</Title>
        <i>
          Les boutons si dessous filtrent sur les différentes collection, par
          objet étant les contributions visant un objet de scanR
        </i>
        <div className="filter-buttons-container fr-mt-5w">
          <button
            className={`filter-button ${filter === "object" ? "active" : ""}`}
            onClick={() => setFilter("object")}
          >
            Par Objet
          </button>
          <button
            className={`filter-button ${filter === "contact" ? "active" : ""}`}
            onClick={() => setFilter("contact")}
          >
            Via formulaire contact
          </button>
          <button
            className={`filter-button ${
              filter === "removeuser" ? "active" : ""
            }`}
            onClick={() => setFilter("removeuser")}
          >
            Demande de suppression
          </button>
          <button
            className={`filter-button ${
              filter === "namechange" ? "active" : ""
            }`}
            onClick={() => setFilter("namechange")}
          >
            Changement de nom
          </button>
        </div>
      </Col>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByTags
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByTeam
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByStatus
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByTopContributors
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByTime
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByTopContributors
            contributions={data?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default GetStats;
