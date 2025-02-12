// import { useState } from "react";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { fakeContributions } from "./fake";
import BSOContributionItem from "./components/contribution-item";
// import TopPaginationButtons from "../../components/pagination/top-buttons";
// import Selectors from "../../components/selectors";
// import BottomPaginationButtons from "../../components/pagination/bottom-buttons";
// import ContributorSummary from "./components/bso-summary";
// import BSOContributionItem from "./components/contribution-item";
// import StaffActions from "./components/staff-actions";

const LocalBSO = () => {
  // const [selectedContributionId, setSelectedContributionId] = useState<
  //   string | null
  // >(null);

  // const handleSelectContribution = (id: string) => {
  //   setSelectedContributionId(id);
  // };

  return (
    <Container className="fr-my-5w">
      <Title>Demande de BSO Local</Title>
      <Row gutters className="fr-mb-3w">
        <Col md="8" xs="12">
          {/* <TopPaginationButtons
          meta={meta}
          page={page}
          maxPage={maxPage}
          setPage={setPage}
          /> */}
        </Col>
        <Col offsetLg="1">
          {/* <Selectors
          sort={sort}
          status={status}
          setSort={setSort}
          setStatus={setStatus}
          /> */}
        </Col>
      </Row>
      <Row>
        <Col md="4" xs="12">
          {/* <ContributorSummary
            contributions={fakeContributions}
            onSelectContribution={handleSelectContribution}
          /> */}
        </Col>
        <Col md="7" xs="12">
          <div>
            {fakeContributions.map((contribution) => (
              <BSOContributionItem
                key={contribution.id}
                contribution={contribution}
              />
            ))}
          </div>
          <div className="fr-mt-10w">
            {/* <StaffActions
              data={fakeContributions.find(
                (contribution) => contribution?.id === contribution?.id
              )}
            /> */}
          </div>
        </Col>
      </Row>

      {/* <BottomPaginationButtons
      page={page}
      maxPage={maxPage}
      setPage={setPage}
      /> */}
    </Container>
  );
};

export default LocalBSO;
