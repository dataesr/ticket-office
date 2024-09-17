import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByTags = ({
  contributions,
  isLoading,
  isError,
  filter,
  setFilter,
}) => {
  if (isLoading) {
    return (
      <Col className="comment">
        <ClipLoader color="#123abc" size={50} />
      </Col>
    );
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const contributionsByTag = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      const { tags } = contribution;
      if (tags) {
        tags.forEach((tag: string) => {
          if (!acc[tag]) {
            acc[tag] = 1;
          } else {
            acc[tag] += 1;
          }
        });
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(contributionsByTag).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Contributions par tag",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de contributions",
      },
    },
    series: [
      {
        name: "Tag",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <SegmentedControl name={""} className="fr-mb-5w">
        <SegmentedElement
          onClick={() => setFilter("object")}
          name="Par Objet"
          label={"Par Objet"}
          value={""}
          icon="fr-fi-eye-line"
          checked={filter === "object"}
        />
        <SegmentedElement
          onClick={() => setFilter("contact")}
          name="Par Objet"
          label={"Via formulaire contact"}
          value={""}
          checked={filter === "contact"}
        />
      </SegmentedControl>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default ContributionsGraphByTags;
