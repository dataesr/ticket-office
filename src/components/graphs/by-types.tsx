import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { contributionUrl } from "../../config/api";
import { ContributionDataType } from "../../types";

const ContributionsGraphByTypes = () => {
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

  const contributionsByType = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { type } = contribution;
      if (type) {
        if (!acc[type]) {
          acc[type] = 1;
        } else {
          acc[type] += 1;
        }
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(contributionsByType).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Contributions par type d'objet",
    },
    series: [
      {
        name: "Type",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByTypes;
