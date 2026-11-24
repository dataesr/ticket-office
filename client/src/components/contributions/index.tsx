import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../loader";
import PageBanner from "../page-banner";
import { ContributionData } from "../../api/contributions";
import { buildURL } from "../../api/utils/buildURL";
import Selectors from "../selectors";
import SearchSection from "../search-section";
import TopPaginationButtons from "../pagination/top-buttons";
import BottomPaginationButtons from "../pagination/bottom-buttons";
import { getApiRoute } from "../../config/api-routes";
import { Contribution } from "../../types";
import ContributionDetail from "./contribution-detail";
import ContributionList from "./contribution-list";
import { useContributionFilters } from "./useContributionFilters";
import { filterContributions } from "./utils";
import "./styles.scss";

const PAGE_SIZE = 20;

type ContributionsPageProps = {
  title: string;
  fromApplication?: string;
  withObjectType?: boolean;
};

const ContributionsPage = ({
  title,
  fromApplication,
  withObjectType = false,
}: ContributionsPageProps) => {
  const location = useLocation();
  const filters = useContributionFilters(withObjectType);
  const [selectedContribution, setSelectedContribution] = useState("");

  const url = buildURL(
    location,
    filters.sort,
    filters.status,
    filters.query.join(" "),
    filters.page,
    filters.searchInMessage,
    fromApplication?.toString(),
    PAGE_SIZE.toString(),
    undefined,
    filters.objectType
  );

  const { data, isLoading, isError, refetch } = ContributionData(url);
  const contributions: Contribution[] = useMemo(() => data?.data || [], [data]);
  const meta = data?.meta;
  const maxPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1;

  const { data: allTags } = ContributionData(
    `/api/tags/${getApiRoute(location.pathname)}`
  );

  const filteredContributions = useMemo(
    () =>
      filterContributions(
        contributions,
        filters.query,
        filters.searchInMessage
      ),
    [contributions, filters.query, filters.searchInMessage]
  );

  const selectedId =
    !selectedContribution && contributions.length > 0
      ? contributions[0].id
      : selectedContribution;

  return (
    <main id="content">
      <PageBanner
        title={title}
        description="Vous pouvez consulter les contributions des utilisateurs et les objets auxquels ils ont contribué."
      >
        <SearchSection
          query={filters.query}
          handleSearch={filters.addQuery}
          handleRemoveQueryItem={filters.removeQuery}
        />
        <Selectors
          sort={filters.sort}
          status={filters.status}
          setSort={filters.setSort}
          setStatus={filters.setStatus}
          searchInMessage={filters.searchInMessage}
          setSearchInMessage={filters.setSearchInMessage}
          objectType={filters.objectType}
          setObjectType={withObjectType ? filters.setObjectType : undefined}
        />
      </PageBanner>
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
                contributions={filteredContributions}
                selectedId={selectedId}
                onSelect={setSelectedContribution}
              />
            </div>
            <div className="fr-col-12 fr-col-md-8">
              {filteredContributions.length > 0 ? (
                <ContributionDetail
                  key={selectedId}
                  contribution={filteredContributions.find(
                    (contribution) => contribution?.id === selectedId
                  )}
                  refetch={refetch}
                  highlightedQuery={filters.highlightedQuery}
                  allTags={allTags}
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
    </main>
  );
};

export default ContributionsPage;
