import ContributionsBrowser from "../../../components/contributions/contributions-browser";
import { useContributionFilters } from "../../../components/contributions/useContributionFilters";
import { useContributions } from "../../../components/contributions/useContributions";
import PageBanner from "../../../components/page-banner";
import SearchSection from "../../../components/search-section";
import Selectors from "../../../components/selectors";

const ScanrRemoveUser = () => {
  const filters = useContributionFilters();
  const data = useContributions("remove-user", filters);

  return (
    <main id="content">
      <PageBanner
        title="Demande de suppression"
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
        />
      </PageBanner>
      <ContributionsBrowser {...data} filters={filters} />
    </main>
  );
};

export default ScanrRemoveUser;
