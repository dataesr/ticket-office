import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Text,
  Title,
  SearchBar,
} from "@dataesr/dsfr-plus";
import ContributionData from "../../api/contribution-api/getData";
import { buildURL } from "../../api/utils/buildURL";
import { Contribution, ContributionPageProps } from "../../types";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import Selectors from "../../components/selectors";
import ContributionItem from "./contribution-item";
import ContributorSummary from "./contributor-summary";

const ContributionPage: React.FC<ContributionPageProps> = () => {
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("new");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [searchInMessage, setSearchInMessage] = useState(false);
  const [highlightedQuery, setHighlightedQuery] = useState("");
  const [selectedContribution, setSelectedContribution] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    setSearchInMessage(params.get("searchInMessage") === "true");
    setQuery(params.get("query") || "");
  }, [location.search]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", page.toString());
    newSearchParams.set("query", query);
    newSearchParams.set("searchInMessage", searchInMessage.toString());

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  }, [page, query, searchInMessage]);

  const url = buildURL(location, sort, status, query, page, searchInMessage);
  const { data, isLoading, isError, refetch } = ContributionData(url);

  const meta = (data as { meta: any })?.meta;
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1;
  const contributions: Contribution[] = (data as { data: Contribution[] })
    ?.data;

  useEffect(() => {
    if (contributions && contributions.length > 0) {
      setSelectedContribution(contributions[0]?._id);
    }
  }, [contributions]);

  const handleSearch = (value: string) => {
    setQuery(value.trim());
    setHighlightedQuery(value.trim());
  };

  const onSelectContribution = (id: string) => {
    setSelectedContribution(id);
  };

  const filteredContributions = contributions?.filter((contribution) => {
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

  if (isLoading)
    return (
      <Container className="fr-my-5w">
        <Text>Chargement...</Text>
      </Container>
    );

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des données.</Text>
      </Container>
    );

  return (
    <Container className="fr-my-5w">
      <Title as="h1">
        {location.pathname.includes("contributionpage")
          ? "Contribution par objets"
          : "Contribution via formulaire"}
      </Title>
      <Row gutters className="fr-mb-3w">
        <Col md="8" xs="12">
          <SearchBar
            className="fr-mb-1w"
            onSearch={(value) => handleSearch(value || "")}
            isLarge
            buttonLabel="Rechercher"
            placeholder="Rechercher par nom"
          />
          <TopPaginationButtons
            meta={meta}
            page={page}
            maxPage={maxPage}
            setPage={setPage}
          />
        </Col>
        <Col offsetLg="1">
          <Selectors
            setSort={setSort}
            setStatus={setStatus}
            searchInMessage={searchInMessage}
            setSearchInMessage={setSearchInMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <ContributorSummary
            contributions={filteredContributions}
            onSelectContribution={onSelectContribution}
          />
        </Col>
        <Col>
          {filteredContributions && filteredContributions.length > 0 && (
            <ContributionItem
              key={selectedContribution}
              data={filteredContributions.find(
                (contribution) => contribution?._id === selectedContribution
              )}
              refetch={refetch}
              highlightedQuery={highlightedQuery}
            />
          )}
        </Col>
      </Row>
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </Container>
  );
};

export default ContributionPage;
