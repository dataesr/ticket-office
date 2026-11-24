import ContributionsBrowser from "../../../components/contributions/contributions-browser";
import { useContributionFilters } from "../../../components/contributions/useContributionFilters";
import { useContributions } from "../../../components/contributions/useContributions";
import PageBanner from "../../../components/page-banner";
import SearchSection from "../../../components/search-section";
import Selectors from "../../../components/selectors";

const ScanrObjectContributions = () => {
  const filters = useContributionFilters(true);
  const data = useContributions("contribute", filters);

  return (
    <main id="content">
      <PageBanner
        title="Contribution par objets"
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
          setObjectType={filters.setObjectType}
        />
      </PageBanner>
      <ContributionsBrowser {...data} filters={filters} />
    </main>
  );
};

export default ScanrObjectContributions;
