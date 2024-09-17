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

  const newContributionsByName = contributions.reduce(
    (acc: Record<string, number>, contribution: Contribution) => {
      if (contribution.status === "new") {
        const name = contribution.name;

        if (!acc[name]) {
          acc[name] = 0;
        }

        acc[name]++;
      }

      return acc;
    },
    {}
  );

  let names: string[] = Object.keys(contributionsByName);
  let contributionCounts: number[] = Object.values(contributionsByName);
  let newContributionCounts: number[] = names.map(
    (name) => newContributionsByName[name] || 0
  );

  let pairs: [string, number, number][] = names.map((name, index) => [
    name,
    contributionCounts[index],
    newContributionCounts[index],
  ]);

  pairs.sort((a, b) => b[1] - a[1]);
  pairs = pairs.slice(0, 15);

  names = pairs.map((pair) => pair[0]);
  contributionCounts = pairs.map((pair) => pair[1]);
  newContributionCounts = pairs.map((pair) => pair[2]);

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
      min: 0,
      title: {
        text: "Nombre de contributions",
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
        },
      },
    },
    legend: {
      align: "right",
      x: -30,
      verticalAlign: "middle",
      layout: "vertical",
      floating: false,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "white",
      borderColor: "#CCC",
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    plotOptions: {
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Toutes Contributions",
        data: contributionCounts,
        color: "#007bff",
      },
      {
        name: "Contributions non traitées",
        data: newContributionCounts,
        color: "#ff4d4d",
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
