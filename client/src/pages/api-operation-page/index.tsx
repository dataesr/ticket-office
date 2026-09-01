import { useState } from "react";
import { Col, Container, Notice, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useLocation } from "react-router-dom";

import ExcelExportButton from "./export-to-xlsx";
import { ClipLoader } from "react-spinners";
import { useDataList } from "./data-list-context";
import { buildURL } from "../../api/utils/buildURL";
import { ContributionData } from "../../api/contributions";
import SearchSection from "../../components/search-section";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import Selectors from "../../components/selectors";
import ContributionProductionItem from "./contribution-production-card";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import { usePublicationsData } from "../../api/scanr";
import {
  Contribute_Production,
  ContributionProductionDataHookResponse,
} from "../../types";
import "./styles.scss";

const ContributionPage: React.FC = () => {
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const initialPage = parseInt(urlParams.get("page") || "1");
  const initialQuery = urlParams.get("query") || "";
  const initialStatus = urlParams.get("status") || "new";

  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState(initialStatus);
  const [query, setQuery] = useState<string[]>(
    initialQuery ? initialQuery.split(",") : []
  );
  const [page, setPage] = useState(initialPage);
  const { dataList } = useDataList();

  const updateUrlAndState = (params: {
    newStatus?: string;
    newQuery?: string[];
    newPage?: number;
    newSort?: string;
  }) => {
    if (params.newStatus !== undefined) setStatus(params.newStatus);
    if (params.newQuery !== undefined) setQuery(params.newQuery);
    if (params.newPage !== undefined) setPage(params.newPage);
    if (params.newSort !== undefined) setSort(params.newSort);

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", params.newPage?.toString() || page.toString());
    newSearchParams.set("query", params.newQuery?.join(",") || query.join(","));
    newSearchParams.set("status", params.newStatus || status);
    if (params.newSort) newSearchParams.set("sort", params.newSort);

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  const handleSetStatus = (newStatus: string) => {
    updateUrlAndState({ newStatus, newPage: 1 });
  };

  const handleSetPage = (newPage: number) => {
    updateUrlAndState({ newPage });
  };

  const handleSetSort = (newSort: string) => {
    updateUrlAndState({ newSort });
  };

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      const newQuery = [...query, trimmedValue];
      updateUrlAndState({ newQuery, newPage: 1 });
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    const newQuery = query.filter((q) => q !== item);
    updateUrlAndState({ newQuery, newPage: 1 });
  };

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

  const allProductionIds = filteredContributions
    .flatMap((contribution) => contribution.productions.map((prod) => prod.id))
    .filter(Boolean);

  const {
    authorsData,
    landingPages,
    isLoading: isLoadingPublications,
    isError: isErrorPublications,
  } = usePublicationsData(allProductionIds);

  const isPageLoading = isLoading || isLoadingPublications;

  if (isError || isErrorPublications) {
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
    <main id="content" className="contribution-top-page">
      <section className="contribution-top-page__banner">
        <div className="fr-container fr-py-8w">
          <h1 className="fr-mb-1w">Lier des publications</h1>
          <p className="fr-mb-3w fr-text--sm">
            Associez les publications proposées par les contributeurs aux
            profils correspondants.
          </p>
          <div className="page-header-row">
            <div className="page-header-row__search">
              <SearchSection
                query={query}
                handleSearch={handleSearch}
                handleRemoveQueryItem={handleRemoveQueryItem}
              />
            </div>
            <Selectors
              layout="inline"
              sort={sort}
              status={status}
              setSort={handleSetSort}
              setStatus={handleSetStatus}
              searchInMessage={true}
              objectType={undefined}
              setObjectType={undefined}
            />
          </div>
        </div>
      </section>

      <Container className="fr-py-6w">
        <TopPaginationButtons
          meta={meta}
          page={page}
          maxPage={maxPage}
          setPage={handleSetPage}
        />

        <div className="fr-mb-3w">
          {!isLoading &&
          filteredContributions.length === 0 &&
          status === "new" ? (
            <Notice type="success" closeMode="disallow" className="fr-mb-3w">
              <Text bold>Félicitations ! Vous êtes à jour !</Text>
              <Text>
                Il n'y a actuellement aucune nouvelle contribution à traiter.
              </Text>
            </Notice>
          ) : !isLoading && filteredContributions.length === 0 ? (
            <Notice type="info" closeMode="disallow" className="fr-mb-3w">
              Aucune contribution ne correspond à votre recherche.
            </Notice>
          ) : isPageLoading ? (
            <div className="fr-my-5w text-center">
              <ClipLoader color="#000091" size={50} />
            </div>
          ) : (
            filteredContributions.map((contribution) => (
              <ContributionProductionItem
                key={contribution.id}
                data={{ ...contribution, threads: contribution.threads || [] }}
                refetch={refetch}
                allTags={fetchedData?.tags || []}
                authorsData={authorsData}
                landingPages={landingPages}
              />
            ))
          )}
        </div>
        {dataList.some((item) => item.export === true) && (
          <ExcelExportButton refetch={refetch} />
        )}

        <BottomPaginationButtons
          page={page}
          maxPage={maxPage}
          setPage={handleSetPage}
        />
      </Container>
    </main>
  );
};

export default ContributionPage;
