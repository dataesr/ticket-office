import { useState } from "react";
import Loader from "../loader";
import BottomPaginationButtons from "../pagination/bottom-buttons";
import TopPaginationButtons from "../pagination/top-buttons";
import ContributionDetail from "./contribution-detail";
import ContributionList from "./contribution-list";
import { PAGE_SIZE, useContributions } from "./useContributions";
import { useContributionFilters } from "./useContributionFilters";
import "./styles.scss";

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
    <div className="fr-container fr-py-6w">
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
        <div className="fr-alert fr-alert--error">
          <p className="fr-alert__title">Erreur</p>
          <p>Erreur lors du chargement des données.</p>
        </div>
      ) : (
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-4">
            <ContributionList
              contributions={contributions}
              selectedId={selectedId}
              onSelect={setSelectedContribution}
            />
          </div>
          <div className="fr-col-12 fr-col-md-8">
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
              <p>Aucune contribution trouvée.</p>
            )}
          </div>
        </div>
      )}
      <BottomPaginationButtons
        page={filters.page}
        maxPage={maxPage}
        setPage={filters.setPage}
      />
    </div>
  );
};

export default ContributionsBrowser;
