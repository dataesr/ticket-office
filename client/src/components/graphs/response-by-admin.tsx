import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import "./styles.scss";

const ContributionsGraphByTeam = ({ contributions, isLoading, isError }) => {
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

  const responsesByTeamMember = {};

  contributions.forEach((contact) => {
    contact.threads?.forEach((thread) => {
      thread.responses?.forEach((response) => {
        if (response.team) {
          response.team.forEach((member) => {
            if (member !== "user") {
              if (!responsesByTeamMember[member]) {
                responsesByTeamMember[member] = 0;
              }
              responsesByTeamMember[member] += 1;
            }
          });
        }
      });
    });
  });

  const chartData = Object.entries(responsesByTeamMember).map(([name, y]) => ({
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
      text: "Réponses par membre de l'équipe",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      title: {
        text: "Membres de l'équipe",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de réponses",
      },
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.y}</b> réponses",
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
        name: "Réponses",
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

export default ContributionsGraphByTeam;
