import { useState, useEffect } from "react";
import {
  Col,
  Container,
  DismissibleTag,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import { Contribute_Production, ContributionPageProps } from "../../../types";
import { useLocation } from "react-router-dom";
import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import Selectors from "../../../components/selectors";
import TopPaginationButtons from "../../../components/pagination/top-buttons";
import ContributionProductionItem from "./contribution-production-card";
import ContributionData from "../../../api/contribution-api/getData";
import { buildURL } from "../../../api/utils/buildURL";
import ExcelExportButton from "./export-to-xlsx";
import { useDataList } from "./data-list-context";

const ContributionPage: React.FC<ContributionPageProps> = () => {
  const [reload] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("new");
  const [query, setQuery] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { dataList } = useDataList();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    const queryParam = params.get("query") || "";
    setQuery(queryParam ? queryParam.split(",") : []);
  }, [location.search]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", page.toString());
    newSearchParams.set("query", query.join(","));

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  }, [page, query]);

  useEffect(() => {
    setPage(1);
  }, [reload, location.pathname]);

  const url = buildURL(location, sort, status, query.join(" "), page);

  const {
    data: fetchedData,
    isLoading,
    isError,
    refetch,
  } = ContributionData(url);

  const contrib: Contribute_Production[] = fetchedData?.data || [];

  const meta = fetchedData?.meta || {};
  const maxPage = meta.total ? Math.ceil(meta.total / 10) : 1;

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      setQuery([...query, trimmedValue]);
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery(query.filter((q) => q !== item));
  };

  const filteredContributions = contrib.filter((contribution) => {
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
    return nameMatches || idMatches;
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
        <Text>Erreur lors du chargement des données.</Text>
      </Container>
    );

  return (
    <Container className="fr-my-5w">
      <Row gutters className="fr-mb-3w">
        <Col md="12">
          <Title as="h1">Lier des publications</Title>
        </Col>
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
            searchInMessage={""}
            setSearchInMessage={""}
          />
        </Col>
      </Row>
      {filteredContributions.map((contribution) => (
        <ContributionProductionItem
          key={contribution.id}
          data={contribution}
          refetch={refetch}
          allTags={fetchedData?.tags || []}
        />
      ))}
      {dataList.some((item) => item.export === true) && (
        <ExcelExportButton refetch={refetch} />
      )}
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </Container>
  );
};

export default ContributionPage;
