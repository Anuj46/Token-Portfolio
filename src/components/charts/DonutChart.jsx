import React from "react";
import ReactApexChart from "react-apexcharts";
import "../../styles/components/chart.css";

const DonutChart = ({ series, labels, colors, width, height, responsive }) => {
 
  const options = {
    chart: {
      type: "donut",
    },
    labels: labels || [],
    colors: colors || undefined,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
      },
    },
    responsive: responsive || [],
  };
  return (
    <div id="donut-chart">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width={width || "100%"}
        height={height || "100%"}
      />
    </div>
  );
};

export default DonutChart;
