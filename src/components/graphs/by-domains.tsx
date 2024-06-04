import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByDomains = ({
  contributions,
  isLoading,
  isError,
  filter,
  setFilter,
}) => {
  if (isLoading) {
    return (
      <Col className="comment">
        <ClipLoader color="#123abc" size={50} />
      </Col>
    );
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const contributionsByEmailDomain = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { email } = contribution;
      if (email) {
        const domain = email.split("@")[1];
        if (!acc[domain]) {
          acc[domain] = 1;
        } else {
          acc[domain] += 1;
        }
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(contributionsByEmailDomain).map(
    ([name, y]) => ({
      name,
      y,
    })
  );

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Contributions par domaine de courrier électronique",
    },
    series: [
      {
        name: "Domaine de courrier électronique",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <SegmentedControl name={""} className="fr-mb-5w">
        <SegmentedElement
          onClick={() => setFilter("object")}
          name="Par Objet"
          label={"Par Objet"}
          value={""}
          icon="fr-fi-eye-line"
          checked={filter === "object"}
        />
        <SegmentedElement
          onClick={() => setFilter("contact")}
          name="Par Objet"
          label={"Via formulaire contact"}
          value={""}
          checked={filter === "contact"}
        />
      </SegmentedControl>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByDomains;
