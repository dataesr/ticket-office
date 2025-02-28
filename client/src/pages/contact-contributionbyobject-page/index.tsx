import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row, Text } from "@dataesr/dsfr-plus";
import ContributionData from "../../api/contribution-api/getData";
import { buildURL } from "../../api/utils/buildURL";
import Selectors from "../../components/selectors";
import ContributorSummary from "./components/contributor-summary";
import PageTitle from "./components/page-title";
import SearchSection from "./components/search-section";
import ContributionDetails from "./components/contribution-details";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import { getUrlToSend } from "../../config/urlHelper";
import { ClipLoader } from "react-spinners";
import { Contribution, ContributionPageProps } from "./types";

const ContactAndContributionPage: React.FC<ContributionPageProps> = ({
  fromApplication,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [sort, setSort] = useState(params.get("sort") || "DESC");
  const [status, setStatus] = useState(params.get("status") || "choose");
  const [query, setQuery] = useState(
    params.get("query")?.split(",").filter(Boolean) || []
  );
  const [page, setPage] = useState(parseInt(params.get("page") || "1", 10));
  const [searchInMessage, setSearchInMessage] = useState(
    params.get("searchInMessage") !== "false"
  );
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const updateURL = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, value);
    });

    const newURL = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage.toString() });
  };

  const handleSetSort = (newSort: string) => {
    setSort(newSort);
    updateURL({ sort: newSort });
  };

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus);
    updateURL({ status: newStatus });
  };

  const handleSetSearchInMessage = (value: boolean) => {
    setSearchInMessage(value);
    updateURL({ searchInMessage: value.toString() });
  };

  const url = buildURL(
    location,
    sort,
    status,
    query.join(" "),
    page,
    searchInMessage,
    fromApplication
  );

  const urlToSend = getUrlToSend(window.location.pathname);

  const { data, isLoading, isError, refetch } = ContributionData(url);
  const contributions: Contribution[] = data?.data || [];
  const meta = data?.meta;
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1;

  const tagsData = ContributionData(urlToSend);
  const allTags = tagsData?.data?.data?.map((tag) => tag?.tags);

  const [selectedContribution, setSelectedContribution] = useState("");

  const effectiveSelectedContribution =
    !selectedContribution && contributions.length > 0
      ? contributions[0].id
      : selectedContribution;

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      const newQuery = [...query, trimmedValue];
      setQuery(newQuery);
      setHighlightedQuery(trimmedValue);
      updateURL({ query: newQuery.join(",") });
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    const newQuery = query.filter((q) => q !== item);
    setQuery(newQuery);
    updateURL({ query: newQuery.join(",") });
  };

  const filteredContributions = contributions.filter((contribution) => {
    if (query.length === 0) return true;

    const queryLower = query.map((q) => q.toLowerCase());
    const nameMatches = queryLower.some((q) =>
      contribution.name?.toLowerCase().includes(q)
    );
    const idMatches = queryLower.some((q) =>
      contribution.id.toLowerCase().includes(q)
    );

    if (searchInMessage) {
      const messageMatches = queryLower.some((q) =>
        contribution.message?.toLowerCase().includes(q)
      );
      return nameMatches || idMatches || messageMatches;
    }
    return nameMatches || idMatches;
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des données.</Text>
      </Container>
    );
  }

  return (
    <Container className="fr-my-5w">
      <PageTitle pathname={location.pathname} />
      <Row gutters className="fr-mb-3w">
        <Col md="8" xs="12">
          <SearchSection
            query={query}
            handleSearch={handleSearch}
            handleRemoveQueryItem={handleRemoveQueryItem}
          />
          <TopPaginationButtons
            meta={meta}
            page={page}
            maxPage={maxPage}
            setPage={handleSetPage}
          />
        </Col>
        <Col offsetLg="1">
          <Selectors
            sort={sort}
            status={status}
            setSort={handleSetSort}
            setStatus={handleSetStatus}
            searchInMessage={searchInMessage}
            setSearchInMessage={handleSetSearchInMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col md="4" xs="12">
          <ContributorSummary
            contributions={filteredContributions}
            onSelectContribution={setSelectedContribution}
          />
        </Col>
        <Col md="7" xs="12">
          <ContributionDetails
            filteredContributions={filteredContributions}
            selectedContribution={effectiveSelectedContribution}
            refetch={refetch}
            highlightedQuery={highlightedQuery}
            allTags={allTags}
            url={url}
          />
        </Col>
      </Row>
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={handleSetPage}
      />
    </Container>
  );
};

export default ContactAndContributionPage;
