import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import "./styles.scss";

const ContributionsGraphByTopContributors = ({
  contributions,
  isLoading,
  isError,
}) => {
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

  const contributionsByPerson = {};

  contributions.forEach((contact) => {
    const name = contact.name?.trim().toLowerCase();
    if (name) {
      if (!contributionsByPerson[name]) {
        contributionsByPerson[name] = 0;
      }
      contributionsByPerson[name] += 1;
    }
  });

  const topContributors = Object.entries(contributionsByPerson)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 15);

  const chartData = topContributors.map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "bar",
      plotBorderWidth: 1,
      plotBackgroundColor: "#f5f5f5",
    },
    title: {
      text: "Top 15 des contributeurs",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      title: {
        text: "Contributeurs",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de Contributions",
      },
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.y}</b> contributions",
      borderRadius: 5,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          style: {
            color: "#333",
            fontSize: "16px",
          },
        },
      },
    },
    series: [
      {
        name: "Contributions",
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

export default ContributionsGraphByTopContributors;
