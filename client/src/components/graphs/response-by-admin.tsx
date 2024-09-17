import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";

const AdminResponseGraph = ({
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

  const occurrencesByUser = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { responseFrom } = contribution;
      if (responseFrom) {
        if (!acc[responseFrom]) {
          acc[responseFrom] = 1;
        } else {
          acc[responseFrom] += 1;
        }
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(occurrencesByUser).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Nombre de mail envoyé",
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
        },
      },
    },
    series: [
      {
        name: "Mail de réponse depuis le guichet",
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

export default AdminResponseGraph;
