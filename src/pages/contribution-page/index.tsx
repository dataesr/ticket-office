import { useState, useEffect, Key } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  SearchBar,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import ContributionItem from "./contribution-card";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";

type ContributionPageProps = {
  url: string;
};
const ContributionPage: React.FC<ContributionPageProps> = () => {
  const [reload] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [status, setStatus] = useState("new");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const buildURL = () => {
    const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";
    const where: any = {};
    if (query) {
      where.data = { $text: { $search: query } };
    }
    if (["new", "ongoing", "treated"].includes(status)) {
      where.status = status;
    }

    return `https://scanr-api.dataesr.ovh/contribute?${sorted}&page=${page}&max_results=20&where=${JSON.stringify(
      where
    )}`;
  };

  const { data, isLoading, isError } = useGetContributionData(
    buildURL(),
    reload
  );
  useEffect(() => {
    setPage(1);
  }, [reload]);

  const meta = (data as { meta: any }).meta;
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1;
  const contrib = (data as { data: any }).data;

  if (isLoading) return <span>LOADING</span>;
  if (isError) return <span>ERROR</span>;

  return (
    <Container className="fr-my-5w">
      <Row gutters className="fr-mb-3w">
        <Title as="h1">Contribution par objets</Title>
        <Col md="8" xs="12">
          <SearchBar
            className="fr-mb-1w"
            onSearch={(e: any) => setQuery(e.target.value)}
            isLarge
            buttonLabel="Rechercher"
            placeholder="Rechercher par nom"
          />
          <Text size="sm" bold>
            Résultats: 1-20 de {meta.total}
          </Text>
          <Button
            onClick={() => setPage(1)}
            disabled={page === 1}
            title="Page 1"
            className="fr-mr-1w"
            variant="secondary"
            size="sm"
          >
            Retour à la page 1
          </Button>
          <Button
            onClick={() => setPage(maxPage)}
            disabled={page === maxPage}
            title={`Page ${maxPage}`}
            className="fr-mr-1w"
            variant="secondary"
            size="sm"
          >
            Dernière page
          </Button>
        </Col>
        <Col>
          <select
            name="order"
            id="order"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="DESC">Plus récentes</option>
            <option value="ASC">Plus anciennes</option>
          </select>
          <select
            name="status"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
            defaultValue={status}
          >
            <option value="choose">Toutes les contributions</option>
            <option value="new">Nouvelles contributions</option>
            <option value="ongoing">Contribution en traitement</option>
            <option value="treated">Contributions traités</option>
          </select>
        </Col>
      </Row>
      {contrib.map((contribution: { _id: Key | null | undefined }) => (
        <ContributionItem key={contribution._id} data={contribution} />
      ))}
      <Row className="fr-grid-row--center fr-mt-5w">
        <Button
          onClick={() => setPage(1)}
          disabled={page === 1}
          title="Page 1"
          className="fr-mr-2w"
          variant="secondary"
          size="sm"
        >
          Retour à la page 1
        </Button>
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          title="Page précédente"
          className="fr-mr-2w"
        >
          Précédente
        </Button>
        <span>{`${page} sur ${maxPage}`}</span>
        <Button
          disabled={page === maxPage}
          onClick={() => setPage(page + 1)}
          title="Page suivante"
          className="fr-ml-2w"
        >
          Suivante
        </Button>

        <Button
          onClick={() => setPage(maxPage)}
          disabled={page === maxPage}
          title={`Page ${maxPage}`}
          className="fr-ml-2w"
          variant="secondary"
          size="sm"
        >
          Dernière page
        </Button>
      </Row>
    </Container>
  );
};

export default ContributionPage;
