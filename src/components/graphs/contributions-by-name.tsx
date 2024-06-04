import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Contribution } from "../../types";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByName = ({
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
      text: `Top 15 des contributeurs ${
        filter === "object" ? "par objet" : "via formulaire contact"
      }`,
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

export default ContributionsGraphByName;
