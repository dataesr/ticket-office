import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../../components/loader";
import PageBanner from "../../components/page-banner";
import { ContributionData } from "../../api/contributions";
import { buildURL } from "../../api/utils/buildURL";
import Selectors from "../../components/selectors";
import ContributorSummary from "./components/contributor-summary";
import SearchSection from "../../components/search-section";
import ContributionDetails from "./components/contribution-details";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import { getApiRoute } from "../../config/api-routes";
import { Contribution, ContributionPageProps } from "../../types";
import { filterContributions, getPageTitle, updateUrlParams } from "./utils";

const PAGE_SIZE = 20;

const ContactAndContributionPage: React.FC<ContributionPageProps> = ({
  fromApplication,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isScanrPage = location.pathname.includes("/scanr-contributionPage");

  const [sort, setSort] = useState(params.get("sort") || "DESC");
  const [status, setStatus] = useState(params.get("status") || "choose");
  const [query, setQuery] = useState(
    params.get("query")?.split(",").filter(Boolean) || []
  );
  const [page, setPage] = useState(parseInt(params.get("page") || "1", 10));
  const [searchInMessage, setSearchInMessage] = useState(
    params.get("searchInMessage") !== "false"
  );
  const [highlightedQuery, setHighlightedQuery] = useState("");
  const [objectType, setObjectType] = useState(
    isScanrPage ? params.get("objectType") || "all" : undefined
  );

  const updateURL = (updates: Record<string, string>) =>
    updateUrlParams(location.search, updates);

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage.toString() });
  };

  const handleSetSort = (newSort: string) => {
    setSort(newSort);
    updateURL({ sort: newSort });
  };

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus);
    updateURL({ status: newStatus });
  };

  const handleSetSearchInMessage = (value: boolean) => {
    setSearchInMessage(value);
    updateURL({ searchInMessage: value.toString() });
  };
  const handleSetObjectType = (newObjectType: string) => {
    setObjectType(newObjectType);
    updateURL({ objectType: newObjectType });
  };

  const url = buildURL(
    location,
    sort,
    status,
    query.join(" "),
    page,
    searchInMessage,
    fromApplication?.toString(),
    PAGE_SIZE.toString(),
    undefined,
    objectType
  );

  const { data, isLoading, isError, refetch } = ContributionData(url);
  const contributions: Contribution[] = data?.data || [];
  const meta = data?.meta;
  const maxPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1;

  const { data: allTags } = ContributionData(
    `/api/tags/${getApiRoute(location.pathname)}`
  );

  const [selectedContribution, setSelectedContribution] = useState("");

  const effectiveSelectedContribution =
    !selectedContribution && contributions.length > 0
      ? contributions[0].id
      : selectedContribution;

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      const newQuery = [...query, trimmedValue];
      setQuery(newQuery);
      setHighlightedQuery(trimmedValue);
      updateURL({ query: newQuery.join(",") });
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    const newQuery = query.filter((q) => q !== item);
    setQuery(newQuery);
    updateURL({ query: newQuery.join(",") });
  };

  const filteredContributions = useMemo(
    () => filterContributions(contributions, query, searchInMessage),
    [contributions, query, searchInMessage]
  );

  const pageTitle = getPageTitle(location.pathname);

  return (
    <main id="content">
      <PageBanner
        title={pageTitle}
        description="Vous pouvez consulter les contributions des utilisateurs et les objets auxquels ils ont contribué."
      >
        <SearchSection
          query={query}
          handleSearch={handleSearch}
          handleRemoveQueryItem={handleRemoveQueryItem}
        />
        <Selectors
          sort={sort}
          status={status}
          setSort={handleSetSort}
          setStatus={handleSetStatus}
          searchInMessage={searchInMessage}
          setSearchInMessage={handleSetSearchInMessage}
          objectType={objectType}
          setObjectType={handleSetObjectType}
        />
      </PageBanner>
      <div className="fr-container fr-py-6w">
        <TopPaginationButtons
          meta={meta}
          page={page}
          maxPage={maxPage}
          setPage={handleSetPage}
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
              <ContributorSummary
                contributions={filteredContributions}
                selectedContribution={effectiveSelectedContribution}
                onSelectContribution={setSelectedContribution}
              />
            </div>
            <div className="fr-col-12 fr-col-md-8">
              <ContributionDetails
                filteredContributions={filteredContributions}
                selectedContribution={effectiveSelectedContribution}
                refetch={refetch}
                highlightedQuery={highlightedQuery}
                allTags={allTags}
                url={url}
              />
            </div>
          </div>
        )}

        <BottomPaginationButtons
          page={page}
          maxPage={maxPage}
          setPage={handleSetPage}
        />
      </div>
    </main>
  );
};

export default ContactAndContributionPage;
