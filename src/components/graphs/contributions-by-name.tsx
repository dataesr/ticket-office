import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { Contribution } from "../../types";
import { contactUrl, contributionUrl } from "../../config/api";
import { Button } from "@dataesr/dsfr-plus";
import { useState } from "react";

const ContributionsGraphByName = () => {
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

  const contributionsByName = contributions.reduce(
    (acc: Record<string, number>, contribution: Contribution) => {
      const name = contribution.name;

      if (!acc[name]) {
        acc[name] = 0;
      }

      acc[name]++;

      return acc;
    },
    {}
  );

  let names: string[] = Object.keys(contributionsByName);
  let contributionCounts: number[] = Object.values(contributionsByName);

  let pairs: [string, number][] = names.map((name, index) => [
    name,
    contributionCounts[index],
  ]);

  pairs.sort((a, b) => b[1] - a[1]);
  pairs = pairs.slice(0, 15);

  names = pairs.map((pair) => pair[0]);
  contributionCounts = pairs.map((pair) => pair[1]);

  const options = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Top 15 des contributeurs",
    },
    xAxis: {
      categories: names,
      title: {
        text: "Noms",
      },
    },
    yAxis: {
      title: {
        text: "Nombre de contributions",
      },
    },
    series: [
      {
        name: "Contributions",
        data: contributionCounts,
      },
    ],
  };

  return (
    <>
      <Button
        className="fr-mr-1w"
        variant="secondary"
        onClick={() => setFilter("object")}
      >
        Par objet
      </Button>
      <Button variant="secondary" onClick={() => setFilter("contact")}>
        Via formulaire contact
      </Button>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByName;
