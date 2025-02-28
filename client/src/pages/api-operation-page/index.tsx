import { useState, useEffect, useMemo } from "react";
import {
  Col,
  Container,
  DismissibleTag,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import { useLocation } from "react-router-dom";

import ExcelExportButton from "./export-to-xlsx";
import { ClipLoader } from "react-spinners";
import { useDataList } from "./data-list-context";
import { buildURL } from "../../api/utils/buildURL";
import ContributionData from "../../api/contribution-api/getData";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import Selectors from "../../components/selectors";
import ContributionProductionItem from "./contribution-production-card";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import { useAllAuthorsData } from "../../api/contribution-api/getNames";
import useLandingPages from "../../api/contribution-api/getLandingPage";
import {
  Contribute_Production,
  ContributionProductionDataHookResponse,
} from "../../types";

const ContributionPage: React.FC = () => {
  const [reload] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("choose");
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
  }: ContributionProductionDataHookResponse = ContributionData(url);

  const contrib: Contribute_Production[] = fetchedData?.data || [];

  const meta: { total?: number } = fetchedData?.meta || {};
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

  const allProductionIds = useMemo(() => {
    return filteredContributions
      .flatMap((contribution) =>
        contribution.productions.map((prod) => prod.id)
      )
      .filter(Boolean);
  }, [filteredContributions]);

  const {
    authorsData,
    isLoading: isLoadingAuthors,
    isError: isErrorAuthors,
  } = useAllAuthorsData(allProductionIds);

  const {
    landingPages,
    isLoading: isLoadingLandingPages,
    isError: isErrorLandingPages,
  } = useLandingPages(allProductionIds);

  const isPageLoading = isLoading || isLoadingAuthors || isLoadingLandingPages;

  if (isPageLoading) {
    return (
      <Container className="fr-my-5w">
        <Row gutters>
          <Col md="12" xs="12">
            <Title as="h1">Lier des publications</Title>
            <div className="fr-my-5w text-center">
              <ClipLoader color="#000091" size={50} />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Mettre à jour pour inclure aussi isErrorLandingPages
  if (isError || isErrorAuthors || isErrorLandingPages) {
    return (
      <Container className="fr-my-5w">
        <Row gutters>
          <Col md="12" xs="12">
            <Title as="h1">Lier des publications</Title>
            <div className="fr-my-3w">
              <Text className="fr-error-text">
                Erreur lors du chargement des données.
              </Text>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="fr-my-5w">
      <Row gutters className="fr-mb-3w">
        <Col md="12" xs="12">
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
            searchInMessage={true}
            setSearchInMessage={""}
          />
        </Col>
      </Row>

      {filteredContributions.map((contribution) => (
        <ContributionProductionItem
          key={contribution.id}
          data={{ ...contribution, threads: contribution.threads || [] }}
          refetch={refetch}
          allTags={fetchedData?.tags || []}
          authorsData={authorsData}
          landingPages={landingPages}
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
