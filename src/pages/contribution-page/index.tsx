import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Text,
  Title,
  SearchBar,
  DismissibleTag,
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
  const [status, setStatus] = useState("choose");
  const [query, setQuery] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchInMessage, setSearchInMessage] = useState(false);
  const [highlightedQuery, setHighlightedQuery] = useState("");
  const [selectedContribution, setSelectedContribution] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    setSearchInMessage(params.get("searchInMessage") === "true");
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
    searchInMessage
  );
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
      contribution._id.toLowerCase().includes(q)
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
            placeholder="Rechercher par nom ou ID"
          />
          <div className="fr-mb-1w">
            {query
              .filter((item) => item.trim() !== "")
              .map((item, index) => (
                <DismissibleTag
                  key={index}
                  color="purple-glycine"
                  className="fr-mr-1w"
                  onClick={() => handleRemoveQueryItem(item)}
                >
                  {item}
                </DismissibleTag>
              ))}
          </div>
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
        <Col md="3">
          <ContributorSummary
            contributions={filteredContributions}
            onSelectContribution={onSelectContribution}
          />
        </Col>
        <Col md="9">
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
