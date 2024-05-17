import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contributionUrl } from "../../config/api";

const ContributionsGraphByYear = () => {
  const { data, isLoading, isError } = useGetContributionData(
    contributionUrl,
    0
  );
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
      text: "Nombre de contributions par mois via formulaire de contribution par objet",
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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ContributionsGraphByYear;
