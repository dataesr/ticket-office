import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { useState } from "react";
import { ContributionData } from "../../types";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contactUrl, contributionUrl } from "../../config/api";
import { Button, Col } from "@dataesr/dsfr-plus";

const AdminResponseGraph = () => {
  const [filter, setFilter] = useState("contributions");
  const url = filter === "object" ? contributionUrl : contactUrl;
  const { data, isLoading, isError } = useGetContributionData(url, 0);

  const contributions = (data as { data: ContributionData[] })?.data;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const responsesByAdmin = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionData) => {
      if (contribution.team) {
        contribution.team.forEach((admin: string) => {
          if (!acc[admin]) {
            acc[admin] = 1;
          } else {
            acc[admin] += 1;
          }
        });
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(responsesByAdmin)
    .map(([name, y]) => ({ name, y }))
    .sort((a, b) => b.y - a.y);

  const options = {
    chart: {
      type: "column",
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      text: "Réponses par admin",
    },
    plotOptions: {
      column: {
        depth: 25,
        dataLabels: {
          enabled: true,
          format: function () {
            if (this.point.index === 0) {
              return '<i class="fr-icon-building-line"></i>';
            }
            return "";
          },
          useHTML: true,
        },
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de réponses",
      },
    },
    series: [
      {
        name: "Traitements",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <Col className="fr-mb-3w">
        <Button
          className="fr-mr-1w"
          size="sm"
          variant={filter === "object" ? "primary" : "secondary"}
          onClick={() => setFilter("object")}
        >
          Par objet
        </Button>
        <Button
          size="sm"
          variant={filter === "contact" ? "primary" : "secondary"}
          onClick={() => setFilter("contact")}
        >
          Via formulaire contact
        </Button>
      </Col>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default AdminResponseGraph;
