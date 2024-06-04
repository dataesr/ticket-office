import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByStatus = ({
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

  const contributionsByStatus = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { status } = contribution;
      if (!acc[status]) {
        acc[status] = 1;
      } else {
        acc[status] += 1;
      }

      return acc;
    },
    {}
  );
  const chartData = Object.entries(contributionsByStatus).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Contributions par statut",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de contributions",
      },
    },
    series: [
      {
        name: "Statut",
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

export default ContributionsGraphByStatus;
