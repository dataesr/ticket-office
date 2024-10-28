import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../components/pagination/top-buttons";
import useSentEmails from "../../api/contribution-api/getSentMails";
import LastMailsSentItem from "./components/item";
import Selectors from "./components/selectors";

const LastMailsSent: React.FC = () => {
  const location = useLocation();
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("choose");
  const [query, setQuery] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchInMessage, setSearchInMessage] = useState(false);

  const { data, isLoading, isError } = useSentEmails();
  const sentEmails: Contribution[] = data ? data.emails : [];
  const maxPage = Math.ceil((data?.emails.length || 0) / 10);

  const uniqueProfiles = Array.from(
    new Set(sentEmails.map((email) => email.selectedProfile))
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(parseInt(params.get("page") || "1"));
    setSearchInMessage(params.get("searchInMessage") === "true");
    const queryParam = params.get("query") || "";
    setQuery(queryParam ? queryParam.split(",") : []);
    setSort(params.get("sort") || "DESC");
  }, [location.search]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", page.toString());
    newSearchParams.set("query", query.join(","));
    newSearchParams.set("searchInMessage", searchInMessage.toString());
    newSearchParams.set("sort", sort);
    if (status !== "choose") {
      newSearchParams.set("status", status);
    }
    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  }, [page, query, searchInMessage, sort, status]);

  if (isLoading)
    return (
      <Container className="fr-my-5w">
        <Text>Chargement...</Text>
      </Container>
    );

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des emails envoyés.</Text>
      </Container>
    );

  return (
    <Container className="fr-my-5w">
      <Title as="h1">Derniers mails envoyés</Title>
      <Row gutters className="fr-mb-3w">
        <Col>
          <TopPaginationButtons
            meta={{ total: sentEmails.length }}
            page={page}
            maxPage={maxPage}
            setPage={setPage}
          />
        </Col>
        <Col offsetLg="6">
          <Selectors setStatus={setStatus} uniqueProfiles={uniqueProfiles} />
        </Col>
      </Row>
      <Row>
        <Col>
          <LastMailsSentItem data={data} />
        </Col>
      </Row>
      <BottomPaginationButtons
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </Container>
  );
};

export default LastMailsSent;
