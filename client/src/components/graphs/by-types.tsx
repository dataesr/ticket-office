import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";
import { Col } from "@dataesr/dsfr-plus";

const ContributionsGraphByTypes = ({ contributions, isLoading, isError }) => {
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

  const contributionsByType = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { type } = contribution;
      if (type) {
        if (!acc[type]) {
          acc[type] = 1;
        } else {
          acc[type] += 1;
        }
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(contributionsByType).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Contributions par type d'objet",
    },
    series: [
      {
        name: "Type",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByTypes;
