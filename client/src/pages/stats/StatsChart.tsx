import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

interface StatsChartProps {
  evolutionData: Record<
    string,
    {
      nb_visits: number;
      nb_uniq_visitors?: number;
      nb_actions: number;
    }
  >;
  referrersEvolutionData?: Record<
    string,
    Array<{
      label: string;
      nb_visits: number;
      nb_uniq_visitors?: number;
    }>
  >;
}

const StatsChart = ({ evolutionData }: StatsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !evolutionData) return;

    const dates = Object.keys(evolutionData).sort();

    if (dates.length === 0) {
      console.log("No dates found in evolution data");
      return;
    }

    const visitsData = dates.map((date) => {
      const value = evolutionData[date]?.nb_visits;
      return typeof value === "number" ? value : 0;
    });

    const uniqueVisitorsData = dates.map((date) => {
      const value = evolutionData[date]?.nb_uniq_visitors;
      return typeof value === "number" ? value : 0;
    });

    const formattedDates = dates.map((date) => {
      const parts = date.split("-");
      if (parts.length === 3) {
        const [, month, day] = parts;
        return `${day}/${month}`;
      }
      return date;
    });

    const chart = Highcharts.chart(chartRef.current, {
      chart: {
        type: "spline",
        height: 350,
        backgroundColor: "transparent",
      },
      title: {
        text: "Évolution des connexions (30 derniers jours)",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--text-title-grey"
          ),
        },
      },
      xAxis: {
        categories: formattedDates,
        crosshair: true,
        labels: {
          style: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--text-default-grey"
            ),
          },
          rotation: -45,
          step: Math.ceil(formattedDates.length / 10),
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Nombre de connexions",
          style: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--text-default-grey"
            ),
          },
        },
        labels: {
          style: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--text-default-grey"
            ),
          },
        },
        gridLineColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue("--text-default-grey"),
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue("--background-default-grey"),
        borderColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue("--border-default-grey"),
        style: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--text-default-grey"
          ),
        },
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 3,
            lineColor: null,
            lineWidth: 1,
          },
        },
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--text-default-grey"
          ),
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "spline",
          name: "Visites",
          data: visitsData,
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--blue-france-sun-113-625"
          ),
        },
        {
          type: "spline",
          name: "Visiteurs uniques",
          data: uniqueVisitorsData,
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--blue-france-marine-100-725"
          ),
        },
      ],
    });

    return () => {
      chart.destroy();
    };
  }, [evolutionData]);

  return <div ref={chartRef} className="stats-chart fr-mt-3w" />;
};

export default StatsChart;
