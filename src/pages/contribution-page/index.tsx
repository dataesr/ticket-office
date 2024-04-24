import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import ContributionItem from "./contribution-card";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { Contribution, ContributionPageProps } from "../../types";
import { useLocation } from "react-router-dom";
import { buildURL } from "../../api/utils/buildURL";

const ContributionPage: React.FC<ContributionPageProps> = () => {
  const [reload] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("new");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [searchInMessage, setSearchInMessage] = useState(false);
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const location = useLocation();

  const { data, isLoading, isError } = useGetContributionData(
    buildURL(sort, status, query, page, searchInMessage),
    reload
  );

  useEffect(() => {
    setPage(1);
  }, [reload, location.pathname]);

  const meta = (data as { meta: any }).meta;
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1;
  const contrib: Contribution[] = (data as { data: Contribution[] }).data;

  const handleSearch = (value: string) => {
    setQuery(value.trim());
    setHighlightedQuery(value.trim());
  };
  console.log(highlightedQuery);

  const filteredContributions = contrib?.filter((contribution) => {
    const nameMatches = contribution.name
      .toLowerCase()
      .includes(query.toLowerCase());
    if (searchInMessage) {
      const messageMatches = contribution.message
        .toLowerCase()
        .includes(query.toLowerCase());
      return nameMatches || messageMatches;
    }
    return nameMatches;
  });

  if (isLoading) return <Text>LOADING</Text>;
  if (isError) return <Text>ERROR</Text>;

  return (
    <Container className="fr-my-5w">
      <Row gutters className="fr-mb-3w">
        <Title as="h1">Contribution par objets</Title>
        <Col md="8" xs="12">
          <SearchBar
            className="fr-mb-1w"
            onSearch={(value) => handleSearch(value || "")}
            isLarge
            buttonLabel="Rechercher"
            placeholder="Rechercher par nom"
          />
          <Text size="sm" bold>
            Résultats: 1-20 de {meta.total}
          </Text>
          <Button
            onClick={() => setPage(1)}
            disabled={page === 1}
            title="Page 1"
            className="fr-mr-1w"
            variant="secondary"
            size="sm"
          >
            Retour à la page 1
          </Button>
          <Button
            onClick={() => setPage(maxPage)}
            disabled={page === maxPage}
            title={`Page ${maxPage}`}
            className="fr-mr-1w"
            variant="secondary"
            size="sm"
          >
            Dernière page
          </Button>
        </Col>
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
          <input
            type="checkbox"
            id="searchInMessage"
            checked={searchInMessage}
            onChange={(e) => setSearchInMessage(e.target.checked)}
          />
          <label htmlFor="searchInMessage">Rechercher dans les messages</label>
        </Col>
      </Row>
      {filteredContributions.map((contribution) => (
        <ContributionItem
          data={contribution}
          highlightedQuery={highlightedQuery}
        />
      ))}
      <Row className="fr-grid-row--center fr-mt-5w">
        <Button
          onClick={() => setPage(1)}
          disabled={page === 1}
          title="Page 1"
          className="fr-mr-2w"
          variant="secondary"
          size="sm"
        >
          Retour à la page 1
        </Button>
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          title="Page précédente"
          className="fr-mr-2w"
        >
          Précédente
        </Button>
        <span>{`${page} sur ${maxPage}`}</span>
        <Button
          disabled={page === maxPage}
          onClick={() => setPage(page + 1)}
          title="Page suivante"
          className="fr-ml-2w"
        >
          Suivante
        </Button>

        <Button
          onClick={() => setPage(maxPage)}
          disabled={page === maxPage}
          title={`Page ${maxPage}`}
          className="fr-ml-2w"
          variant="secondary"
          size="sm"
        >
          Dernière page
        </Button>
      </Row>
    </Container>
  );
};

export default ContributionPage;
