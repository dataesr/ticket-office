import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import "./styles.scss";
import { ContributionDataType } from "../../types";

const ContributionsGraphByTags = ({ contributions, isLoading, isError }) => {
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

  const contributionsByTag = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { tags } = contribution;
      if (tags) {
        tags.forEach((tag: string) => {
          const normalizedTag = tag.toUpperCase();
          if (!acc[normalizedTag]) {
            acc[normalizedTag] = 1;
          } else {
            acc[normalizedTag] += 1;
          }
        });
      }
      return acc;
    },
    {}
  );

  const sortedTags = Object.entries(contributionsByTag)
    .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
    .slice(0, 10);

  const otherTagsCount =
    Object.entries(contributionsByTag).length - sortedTags.length;
  if (otherTagsCount > 0) {
    const otherTagSum = Object.entries(contributionsByTag)
      .slice(10)
      .reduce((acc, [, count]: [string, number]) => acc + count, 0);

    sortedTags.push(["Autres", otherTagSum]);
  }

  const chartData = sortedTags.map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "column",
      backgroundColor: "#ffffff",
      borderWidth: 0,
      plotBackgroundColor: "#f5f5f5",
    },
    title: {
      text: "Contributions par tag",
      style: {
        fontSize: "24px",
        fontWeight: "600",
        color: "#333",
      },
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      title: {
        style: {
          fontSize: "14px",
          color: "#666",
        },
      },
      labels: {
        style: {
          color: "#888",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de contributions",
        style: {
          color: "#666",
        },
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
      column: {
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
        colorByPoint: true,
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

export default ContributionsGraphByTags;
