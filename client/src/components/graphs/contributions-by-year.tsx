import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import "./styles.scss";

const ContributionsGraphByTime = ({ contributions, isLoading, isError }) => {
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

  const months = [
    "Janv",
    "Févr",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sept",
    "Oct",
    "Nov",
    "Déc",
  ];

  const contributionsByMonth = {};

  contributions.forEach((contact) => {
    const createdAt = contact.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const yearMonth = `${year}-${(month + 1).toString().padStart(2, "0")}`;

      if (!contributionsByMonth[yearMonth]) {
        contributionsByMonth[yearMonth] = 0;
      }
      contributionsByMonth[yearMonth] += 1;
    }
  });

  const chartData = Object.entries(contributionsByMonth)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([yearMonth, y]) => {
      const [year, month] = yearMonth.split("-");
      const formattedMonth = months[parseInt(month, 10) - 1];
      const formattedDate = `${formattedMonth} ${year}`;
      return { name: formattedDate, y };
    });

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "#fff",
      borderWidth: 0,
      plotBackgroundColor: "#f5f5f5",
    },
    title: {
      text: "Évolution des Contributions par Mois",
      style: {
        fontSize: "20px",
        fontWeight: "300",
        color: "#333",
      },
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      title: {
        text: "Mois",
        style: {
          fontSize: "14px",
          color: "#333",
        },
      },
      tickLength: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de Contributions",
        style: {
          fontSize: "14px",
          color: "#333",
        },
      },
      gridLineWidth: 0,
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
      spline: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Contributions",
        data: chartData,
        color: "#a94645",
        lineWidth: 7,
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

export default ContributionsGraphByTime;
