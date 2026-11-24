import { useState } from "react";
import { Alert, Col, Container, Row, Text } from "@dataesr/dsfr-plus";
import Loader from "../loader";
import BottomPaginationButtons from "../pagination/bottom-buttons";
import TopPaginationButtons from "../pagination/top-buttons";
import ContributionDetail from "./contribution-detail";
import ContributionsSideMenu from "./contributions-side-menu";
import { PAGE_SIZE, useContributions } from "./useContributions";
import { useContributionFilters } from "./useContributionFilters";

type ContributionsBrowserProps = ReturnType<typeof useContributions> & {
  filters: ReturnType<typeof useContributionFilters>;
};

const ContributionsBrowser = ({
  apiRoute,
  contributions,
  meta,
  allTags,
  isLoading,
  isError,
  refetch,
  filters,
}: ContributionsBrowserProps) => {
  const [selectedContribution, setSelectedContribution] = useState("");
  const selectedId = selectedContribution || contributions[0]?.id || "";
  const maxPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1;

  return (
    <Container className="fr-py-6w">
      <TopPaginationButtons
        meta={meta}
        page={filters.page}
        maxPage={maxPage}
        setPage={filters.setPage}
        pageSize={PAGE_SIZE}
      />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert
          variant="error"
          title="Erreur"
          titleAs="p"
          description="Erreur lors du chargement des données."
        />
      ) : (
        <Row gutters>
          <Col xs={12} md={4}>
            <ContributionsSideMenu
              contributions={contributions}
              selectedId={selectedId}
              onSelect={setSelectedContribution}
            />
          </Col>
          <Col xs={12} md={8}>
            {contributions.length > 0 ? (
              <ContributionDetail
                key={selectedId}
                contribution={contributions.find(
                  (contribution) => contribution?.id === selectedId
                )}
                refetch={refetch}
                highlightedQuery={filters.highlightedQuery}
                allTags={allTags}
                apiRoute={apiRoute}
              />
            ) : (
              <Text>Aucune contribution trouvée.</Text>
            )}
          </Col>
        </Row>
      )}
      <BottomPaginationButtons
        page={filters.page}
        maxPage={maxPage}
        setPage={filters.setPage}
      />
    </Container>
  );
};

export default ContributionsBrowser;
