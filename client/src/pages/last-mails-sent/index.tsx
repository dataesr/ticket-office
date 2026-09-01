import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Text } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import SearchSection from "../../components/search-section";
import { useSentEmails } from "../../api/mails";
import MailFilters from "./components/selectors";
import LastMailsSentItem from "./components/item";
import {
  filterSentEmails,
  getApplications,
  getObjectTypeOptions,
} from "./utils";
import "./components/styles.scss";
import { EmailItem } from "../../types";

const PAGE_SIZE = 10;

const LastMailsSent: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [profile, setProfile] = useState("all");
  const [objectType, setObjectType] = useState("all");
  const [application, setApplication] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, isError } = useSentEmails();
  const sentEmails: EmailItem[] = data ? data.emails : [];

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
      (a: any, b: any) =>
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    )
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    const queryParam = params.get("query") || "";
    setQuery(queryParam ? queryParam.split(",") : []);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (query.length > 0) params.set("query", query.join(","));
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  }, [page, query]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !query.includes(trimmed)) {
      setQuery([...query, trimmed]);
      setPage(1);
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery(query.filter((q) => q !== item));
    setPage(1);
  };

  const withPageReset =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des emails envoyés.</Text>
      </Container>
    );

  return (
    <main id="content" className="mails-top-page">
      <section className="mails-top-page__banner">
        <div className="fr-container fr-py-8w">
          <h1 className="fr-mb-1w">Derniers mails envoyés</h1>
          <p className="fr-mb-3w fr-text--sm">
            Filtrez les réponses envoyées par type d'objet, application, profil,
            période ou mot-clé.
          </p>

          <div className="mails-header-row">
            <div className="mails-header-row__search">
              <SearchSection
                query={query}
                handleSearch={handleSearch}
                handleRemoveQueryItem={handleRemoveQueryItem}
              />
            </div>
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
          </div>
        </div>
      </section>

      <Container className="fr-py-6w">
        <TopPaginationButtons
          meta={{ total: filteredEmails.length }}
          page={safePage}
          maxPage={maxPage}
          setPage={setPage}
          pageSize={PAGE_SIZE}
        />

        <LastMailsSentItem
          data={{
            emails: pageEmails as any,
          }}
        />

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
