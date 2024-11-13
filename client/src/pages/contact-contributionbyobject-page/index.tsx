import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row, Text } from "@dataesr/dsfr-plus";
import ContributionData from "../../api/contribution-api/getData";
import { buildURL } from "../../api/utils/buildURL";
import { Contribution, ContributionPageProps } from "../../types";
import Selectors from "../../components/selectors";
import ContributorSummary from "./components/contributor-summary";
import PageTitle from "./components/page-title";
import SearchSection from "./components/search-section";
import ContributionDetails from "./components/contribution-details";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import { getUrlToSend } from "../../config/urlHelper";

const ContactAndContributionPage: React.FC<ContributionPageProps> = ({
  fromApplication,
}) => {
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("choose");
  const [query, setQuery] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchInMessage, setSearchInMessage] = useState(true);
  const [highlightedQuery, setHighlightedQuery] = useState("");
  const [selectedContribution, setSelectedContribution] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    const queryParam = params.get("query") || "";
    setQuery(queryParam ? queryParam.split(",") : []);
    setSort(params.get("sort") || "DESC");
    setStatus(params.get("status") || "choose");
  }, [location.search]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", page.toString());
    newSearchParams.set("query", query.join(","));
    newSearchParams.set("searchInMessage", searchInMessage.toString());
    newSearchParams.set("sort", sort);
    newSearchParams.set("status", status);
    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  }, [page, query, searchInMessage, sort, status]);

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

  const contributions: Contribution[] = data ? data.data : [];
  const meta = data?.meta;
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1;

  const getTags = ContributionData(urlToSend);
  const allTags = getTags?.data?.data?.map((tag) => tag?.tags);

  useEffect(() => {
    if (contributions && contributions.length > 0) {
      setSelectedContribution((prevSelectedContribution) => {
        const isValid = contributions.some(
          (contribution) => contribution.id === prevSelectedContribution
        );
        return isValid ? prevSelectedContribution : contributions[0]?.id;
      });
    }
  }, [contributions]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      setQuery([...query, trimmedValue]);
      setHighlightedQuery(trimmedValue);
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery(query.filter((q) => q !== item));
  };

  const onSelectContribution = (id: string) => {
    setSelectedContribution(id);
  };
  const filteredContributions = contributions?.filter((contribution) => {
    if (query.length === 0) {
      return true;
    }
    const queryLower = query.map((q) => q.toLowerCase());
    const nameMatches = queryLower.some((q) =>
      contribution.name.toLowerCase().includes(q)
    );
    const idMatches = queryLower.some((q) =>
      contribution.id.toLowerCase().includes(q)
    );
    if (searchInMessage) {
      const messageMatches = queryLower.some((q) =>
        contribution.message.toLowerCase().includes(q)
      );
      return nameMatches || idMatches || messageMatches;
    }
    return nameMatches || idMatches;
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
            setPage={setPage}
          />
        </Col>
        <Col offsetLg="1">
          <Selectors
            sort={sort}
            status={status}
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
        <Col md="7">
          <ContributionDetails
            filteredContributions={filteredContributions}
            selectedContribution={selectedContribution}
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
        setPage={setPage}
      />
    </Container>
  );
};

export default ContactAndContributionPage;
