import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contactUrl, contributionUrl } from "../../config/api";
import { Button, Col } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { ContributionDataType } from "../../types";

const ContributionsGraphByDomains = () => {
  const [filter, setFilter] = useState("contributions");
  const url = filter === "object" ? contributionUrl : contactUrl;
  const { data, isLoading, isError } = useGetContributionData(url, 0);
  const contributions = (data as { data: [] })?.data;
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const contributionsByEmailDomain = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { email } = contribution;
      if (email) {
        const domain = email.split("@")[1];
        if (!acc[domain]) {
          acc[domain] = 1;
        } else {
          acc[domain] += 1;
        }
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(contributionsByEmailDomain).map(
    ([name, y]) => ({
      name,
      y,
    })
  );

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Contributions par domaine de courrier électronique",
    },
    series: [
      {
        name: "Domaine de courrier électronique",
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

export default ContributionsGraphByDomains;
