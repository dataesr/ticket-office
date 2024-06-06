import { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import { Contribute_Production, ContributionPageProps } from "../../types";
import { useLocation } from "react-router-dom";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import Selectors from "../../components/selectors";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import ContributionProductionItem from "./contribution-production-card";
import ContributionData from "../../api/contribution-api/getData";
import { buildURL } from "../../api/utils/buildURL";
import ExcelExportButton from "./export-to-xlsx";

const ContributionPage: React.FC<ContributionPageProps> = () => {
  const [reload] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("new");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [, setData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    setQuery(params.get("query") || "");
  }, [location.search]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", page.toString());
    newSearchParams.set("query", query);

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  }, [page, query]);

  useEffect(() => {
    setPage(1);
  }, [reload, location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("apioperations")) {
    }
  }, [location.pathname]);

  const url = buildURL(location, sort, status, query, page);
  const {
    data: fetchedData,
    isLoading,
    isError,
    refetch,
  } = ContributionData(url);

  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);
  const [dataList, setDataList] = useState([]);
  console.log(dataList);
  const meta = (fetchedData as { meta: any })?.meta;
  const maxPage = meta ? Math.ceil(meta?.total / 10) : 1;
  const contrib: Contribute_Production[] = (
    fetchedData as { data: Contribute_Production[] }
  )?.data;

  const handleSearch = (value: string) => {
    setQuery(value.trim());
  };

  const filteredContributions = contrib?.filter((contribution) => {
    const nameMatches = contribution.name
      .toLowerCase()
      .includes(query.toLowerCase());
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
        <Col md="12">
          <Title as="h1">Opérations sur l'API</Title>
        </Col>
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
            searchInMessage={""}
            setSearchInMessage={""}
          />
        </Col>
      </Row>
      {filteredContributions?.map((contribution) => (
        <ContributionProductionItem
          data={contribution as Contribute_Production}
          refetch={refetch}
          setDataList={setDataList}
        />
      ))}
      <ExcelExportButton dataList={dataList} setDataList={setDataList} />
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </Container>
  );
};

export default ContributionPage;
