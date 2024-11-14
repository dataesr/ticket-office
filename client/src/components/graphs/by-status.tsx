import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import { ContributionDataType } from "../../types";
import "./styles.scss";

const ContributionsGraphByStatus = ({ contributions, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
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
      if (status) {
        const normalizedStatus = status.toLowerCase();
        if (!acc[normalizedStatus]) {
          acc[normalizedStatus] = 1;
        } else {
          acc[normalizedStatus] += 1;
        }
      }
      return acc;
    },
    {}
  );

  const sortedStatuses = Object.entries(contributionsByStatus).sort(
    ([, a]: [string, number], [, b]: [string, number]) => b - a
  );

  const chartData = sortedStatuses.map(([name, y]) => {
    let color;
    switch (name) {
      case "new":
        color = "#a94645";
        break;
      case "treated":
        color = "#c9fcac";
        break;
      case "ongoing":
        color = "#D1B781";
        break;
      default:
        color = "#808080";
    }
    return {
      name,
      y,
      color,
    };
  });
  const options = {
    chart: {
      type: "column",
      backgroundColor: "#ffffff",
      borderWidth: 0,
      plotBackgroundColor: "#f5f5f5",
    },
    title: {
      text: "Status des Contributions",
      style: {
        fontSize: "24px",
        fontWeight: "600",
        color: "#333",
      },
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.y}</b> contributions",
      borderRadius: 5,
      backgroundColor: "#f8f8f8",
      style: {
        color: "#333",
        fontSize: "14px",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: "{point.y}",
          style: {
            color: "#333",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        data: chartData,
      },
    ],
    legend: {
      enabled: false,
    },
  };

  return (
    <div className="graph-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ContributionsGraphByStatus;
