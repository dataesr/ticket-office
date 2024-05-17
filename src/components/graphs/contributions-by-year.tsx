import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contributionUrl, contactUrl } from "../../config/api";
import { useState } from "react";
import { Button } from "@dataesr/dsfr-plus";

const ContributionsGraphByYear = () => {
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

  const contributionsByMonth = (
    contributions as { created_at: string }[]
  ).reduce((acc, contribution) => {
    const date = new Date(contribution.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (!acc[year]) {
      acc[year] = Array(12).fill(0);
    }

    acc[year][month - 1]++;

    return acc;
  }, {});

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: `Nombre de contributions ${
        filter === "object" ? "par objet" : "via formulaire contact"
      } par mois et par année`,
    },
    xAxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    series: Object.entries(contributionsByMonth).map(
      ([year, contributions]) => ({
        name: year,
        data: contributions,
      })
    ),
  };

  return (
    <>
      <Button
        className="fr-mr-1w"
        variant={filter === "object" ? "primary" : "secondary"}
        onClick={() => setFilter("object")}
      >
        Par objet
      </Button>
      <Button
        variant={filter === "contact" ? "primary" : "secondary"}
        onClick={() => setFilter("contact")}
      >
        Via formulaire contact
      </Button>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByYear;
