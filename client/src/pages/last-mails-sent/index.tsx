import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Text } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import SearchSection from "../../components/search-section";
import PageBanner from "../../components/page-banner";
import { useSentEmails } from "../../api/mails";
import MailFilters from "./components/selectors";
import LastMailsSentItem from "./components/item";
import {
  filterSentEmails,
  getApplications,
  getObjectTypeOptions,
  SentEmail,
} from "./utils";
import "./components/styles.scss";

const PAGE_SIZE = 10;

const LastMailsSent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const queryParam = searchParams.get("query");
  const query = queryParam ? queryParam.split(",") : [];
  const [profile, setProfile] = useState("all");
  const [objectType, setObjectType] = useState("all");
  const [application, setApplication] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, isError } = useSentEmails();
  const sentEmails: SentEmail[] = data ? data.emails : [];

  const uniqueProfiles = Array.from(
    new Set(sentEmails.map((email) => email.selectedProfile))
  );
  const objectTypeOptions = getObjectTypeOptions(sentEmails);
  const applications = getApplications(sentEmails);

  const filteredEmails = filterSentEmails(sentEmails, {
    profile,
    objectType,
    application,
    query,
    dateFrom,
    dateTo,
  });

  const maxPage = Math.max(1, Math.ceil(filteredEmails.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);

  const pageEmails = [...filteredEmails]
    .sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    )
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateUrl = (newPage: number, newQuery = query) => {
    const params = new URLSearchParams({ page: newPage.toString() });
    if (newQuery.length > 0) params.set("query", newQuery.join(","));
    setSearchParams(params);
  };

  const setPage = (newPage: number) => updateUrl(newPage);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !query.includes(trimmed)) updateUrl(1, [...query, trimmed]);
  };

  const handleRemoveQueryItem = (item: string) =>
    updateUrl(
      1,
      query.filter((q) => q !== item)
    );

  const withPageReset =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      if (page !== 1) setPage(1);
    };

  if (isLoading) {
    return <Loader />;
  }

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des emails envoyés.</Text>
      </Container>
    );

  return (
    <main id="content">
      <PageBanner
        title="Derniers mails envoyés"
        description="Filtrez les réponses envoyées par type d'objet, application, profil, période ou mot-clé."
      >
        <SearchSection
          query={query}
          handleSearch={handleSearch}
          handleRemoveQueryItem={handleRemoveQueryItem}
        />
        <MailFilters
          profile={profile}
          profiles={uniqueProfiles}
          onProfile={withPageReset(setProfile)}
          objectType={objectType}
          objectTypes={objectTypeOptions}
          onObjectType={withPageReset(setObjectType)}
          application={application}
          applications={applications}
          onApplication={withPageReset(setApplication)}
          dateFrom={dateFrom}
          onDateFrom={withPageReset(setDateFrom)}
          dateTo={dateTo}
          onDateTo={withPageReset(setDateTo)}
        />
      </PageBanner>

      <Container className="fr-py-6w">
        <TopPaginationButtons
          meta={{ total: filteredEmails.length }}
          page={safePage}
          maxPage={maxPage}
          setPage={setPage}
          pageSize={PAGE_SIZE}
        />

        <LastMailsSentItem data={{ emails: pageEmails }} />

        <BottomPaginationButtons
          page={safePage}
          maxPage={maxPage}
          setPage={setPage}
        />
      </Container>
    </main>
  );
};

export default LastMailsSent;
