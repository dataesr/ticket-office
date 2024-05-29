import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { contributionUrl } from "../../config/api";
import { Contribution } from "../../types";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";

const ContributionsGraphByYearAndType = () => {
  const url = contributionUrl;
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

  const contributionsByYearAndType = contributions.reduce(
    (acc, contribution) => {
      const date = new Date(contribution.created_at);
      const year = date.getFullYear();
      const type = contribution.type;

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][type]) {
        acc[year][type] = 0;
      }

      acc[year][type]++;

      return acc;
    },
    {}
  );

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: `Nombre de contributions par année et par type`,
    },
    xAxis: {
      categories: Object.keys(contributionsByYearAndType),
    },
    series: Object.entries(contributionsByYearAndType).reduce(
      (acc, [, contributions]) => {
        Object.entries(contributions).forEach(([type, count]) => {
          const series = acc.find((series) => series.name === type);

          if (series) {
            series.data.push(count);
          } else {
            acc.push({
              name: type,
              data: [count],
            });
          }
        });

        return acc;
      },
      []
    ),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ContributionsGraphByYearAndType;
