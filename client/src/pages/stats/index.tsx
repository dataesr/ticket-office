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
import "./styles.scss";
import ContributionAllDatas from "../../api/contribution-api/getAllDatas";
import { apiUrl } from "../../api/utils/url";

const GetStats = () => {
  const [filter, setFilter] = useState("contact");
  const [url, setUrl] = useState(() => buildStatsURL(filter));

  useEffect(() => {
    if (filter !== "global") {
      setUrl(buildStatsURL(filter));
    }
  }, [filter]);

  const { data, isLoading, isError } = ContributionData(url);
  const {
    data: allData,
    isLoading: isLoadingAllData,
    isError: isErrorAllData,
  } = ContributionAllDatas(apiUrl);

  const isGlobal = filter === "global";
  const contributions = isGlobal
    ? allData?.flatMap((item) => item.data || [])
    : data?.data;
  const isLoadingGraphs = isGlobal ? isLoadingAllData : isLoading;
  const isErrorGraphs = isGlobal ? isErrorAllData : isError;

  if (isLoadingGraphs) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }
  if (isErrorGraphs) {
    return <div>Une erreur s'est produite</div>;
  }
  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  return (
    <Container className="fr-mt-5w">
      <Col md="12">
        <Title look="h5">Choisissez la table de données à afficher</Title>
        <i>
          Les boutons ci-dessous filtrent sur les différentes collections, par
          objet étant les contributions visant un objet de scanR.
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
          <button
            className={`filter-button ${filter === "global" ? "active" : ""}`}
            onClick={() => setFilter("global")}
          >
            Global
          </button>
        </div>
      </Col>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByTags
            contributions={contributions}
            isLoading={isLoadingGraphs}
            isError={isErrorGraphs}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByTeam
            contributions={contributions}
            isLoading={isLoadingGraphs}
            isError={isErrorGraphs}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByStatus
            contributions={contributions}
            isLoading={isLoadingGraphs}
            isError={isErrorGraphs}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByTopContributors
            contributions={contributions}
            isLoading={isLoadingGraphs}
            isError={isErrorGraphs}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col md="6">
          <ContributionsGraphByTime
            contributions={contributions}
            isLoading={isLoadingGraphs}
            isError={isErrorGraphs}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default GetStats;
