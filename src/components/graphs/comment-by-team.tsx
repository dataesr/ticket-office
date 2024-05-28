import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { Contribution } from "../../types";
import { contactUrl, contributionUrl } from "../../config/api";
import { useState } from "react";
import { Button, Col } from "@dataesr/dsfr-plus";

const CommentsGraphByTeamMember = () => {
  const [filter, setFilter] = useState("contributions");
  const url = filter === "object" ? contributionUrl : contactUrl;
  const { data, isLoading, isError } = useGetContributionData(url, 0);

  const contributions = (data as { data: Contribution[] })?.data;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const counts = contributions.reduce((acc, curr) => {
    if (curr.comment && curr.team) {
      acc[curr.team] = (acc[curr.team] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(counts).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Nombre de commentaires par membre de l'équipe",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de commentaires",
      },
    },
    series: [
      {
        name: "Membre de l'équipe",
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

export default CommentsGraphByTeamMember;
