import { Col, Row, Text } from "@dataesr/dsfr-plus";
import { TopPaginationProps } from "../../types";
import BottomPaginationButtons from "./bottom-buttons";

const ResultsBar = ({
  meta,
  page,
  maxPage,
  setPage,
  pageSize = 20,
}: TopPaginationProps & { pageSize?: number }) => {
  const total = meta?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Row verticalAlign="middle">
      <Col xs={12} lg={3}>
        <Text size="sm" className="fr-text--bold fr-mb-2w">
          Résultats : {from}-{to} sur {total}
        </Text>
      </Col>
      <Col xs={12} lg={9}>
        <Row horizontalAlign="right">
          <BottomPaginationButtons
            className="fr-mb-2w"
            page={page}
            maxPage={maxPage}
            setPage={setPage}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default ResultsBar;
