import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { useState } from "react";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contactUrl, contributionUrl } from "../../config/api";
import { Button, Col } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";

const AdminResponseGraph = () => {
  const [filter, setFilter] = useState("contributions");
  const url = filter === "object" ? contributionUrl : contactUrl;
  const { data, isLoading, isError } = useGetContributionData(url, 0);

  const contributions = (data as { data: ContributionDataType[] })?.data;

  if (isLoading) {
    return <div>Chargement...</div>;
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
    series: [
      {
        name: "Mail de réponse depuis le guichet",
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
