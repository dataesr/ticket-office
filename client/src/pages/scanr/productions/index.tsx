import { Col, Container, Notice, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useLocation } from "react-router-dom";

import ExportBasket from "./components/export-basket";
import Loader from "../../../components/loader";
import PageBanner from "../../../components/page-banner";
import { useDataList } from "./data-list-context";
import { buildURL } from "../../../api/utils/buildURL";
import { ContributionData } from "../../../api/contributions";
import SearchSection from "../../../components/search-section";
import TopPaginationButtons from "../../../components/pagination/top-buttons";
import Selectors from "../../../components/selectors";
import ProductionCard from "./components/production-card";
import { useProductionFilters } from "./hooks/useProductionFilters";
import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import { useIdrefNames, usePublicationsData } from "../../../api/scanr";
import {
  Contribute_Production,
  ContributionProductionDataHookResponse,
} from "../../../types";
import "./styles.scss";

const PAGE_SIZE = 20;

const ProductionsPage = () => {
  const location = useLocation();
  const {
    sort,
    setSort,
    status,
    setStatus,
    query,
    addQuery,
    removeQuery,
    page,
    setPage,
  } = useProductionFilters();
  const { dataList } = useDataList();

  const url = buildURL(
    location,
    sort,
    status,
    query.join(" "),
    page,
    true,
    undefined,
    PAGE_SIZE.toString()
  );

  const {
    data: fetchedData,
    isLoading,
    isError,
    refetch,
  }: ContributionProductionDataHookResponse = ContributionData(url);

  const contrib: Contribute_Production[] = fetchedData?.data || [];

  const meta: { total?: number } = fetchedData?.meta || {};
  const maxPage = meta.total ? Math.ceil(meta.total / PAGE_SIZE) : 1;

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

  const { idrefNames } = useIdrefNames(
    filteredContributions.map((contribution) => contribution.objectId)
  );

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
    <main id="content">
      <PageBanner
        title="Lier des publications"
        description="Associez les publications proposées par les contributeurs aux profils correspondants."
      >
        <SearchSection
          query={query}
          handleSearch={addQuery}
          handleRemoveQueryItem={removeQuery}
        />
        <Selectors
          sort={sort}
          status={status}
          setSort={setSort}
          setStatus={setStatus}
        />
      </PageBanner>

      <Container className="fr-py-6w">
        <TopPaginationButtons
          meta={meta}
          page={page}
          maxPage={maxPage}
          setPage={setPage}
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
            <Loader />
          ) : (
            filteredContributions.map((contribution) => (
              <ProductionCard
                key={contribution.id}
                contribution={contribution}
                refetch={refetch}
                allTags={fetchedData?.tags || []}
                authorsData={authorsData}
                landingPages={landingPages}
                idrefNames={idrefNames}
              />
            ))
          )}
        </div>
        {dataList.some((item) => item.export === true) && (
          <ExportBasket refetch={refetch} />
        )}

        <BottomPaginationButtons
          page={page}
          maxPage={maxPage}
          setPage={setPage}
        />
      </Container>
    </main>
  );
};

export default ProductionsPage;
