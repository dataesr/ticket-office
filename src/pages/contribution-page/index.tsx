import { useState, useEffect } from "react";

import { Contribution, ContributionPageProps } from "../../types";
import { useLocation } from "react-router-dom";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import Selectors from "../../components/selectors";

import TopPaginationButtons from "../../components/pagination/top-buttons";
import {
  Col,
  Container,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import ContributionItem from "./contribution-card";
import ContributionData from "../../api/contribution-api/getData";
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

  useEffect(() => {
    setPage(1);
  }, [reload, location.pathname]);

  useEffect(() => {
    if (
      location.pathname.includes("contributionPage") ||
      location.pathname.includes("contact")
    ) {
      setSearchInMessage(false);
    }
  }, [location.pathname]);
  const url = buildURL(location, sort, status, query, page, searchInMessage);
  const { data, isLoading, isError, refetch } = ContributionData(url);

  const meta = (data as { meta: any })?.meta;
  const maxPage = meta ? Math.ceil(meta?.total / 10) : 1;
  const contrib: Contribution[] = (data as { data: Contribution[] })?.data;

  const handleSearch = (value: string) => {
    setQuery(value.trim());
    setHighlightedQuery(value.trim());
  };

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

  if (isLoading)
    return (
      <Container className="fr-my-5w">
        <Text>Chargement</Text>
      </Container>
    );
  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur</Text>
      </Container>
    );

  return (
    <Container className="fr-my-5w">
      <Row gutters className="fr-mb-3w">
        {location.pathname.includes("contributionpage") ? (
          <Title as="h1">Contribution par objets</Title>
        ) : (
          <Title as="h1">Contribution via formulaire</Title>
        )}
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
      {filteredContributions?.map((contribution) => (
        <ContributionItem
          data={contribution}
          refetch={refetch}
          highlightedQuery={highlightedQuery}
        />
      ))}
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </Container>
  );
};

export default ContributionPage;
