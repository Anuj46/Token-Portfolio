import React from "react";
import ReactApexChart from "react-apexcharts";

const Linechart = ({ series, color = "#4ADE80" }) => {
  const options = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: [color],
    },
    tooltip: { enabled: false },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ data: series }]}
      type="line"
      height={40}
      width={120}
    />
  );
};

export default Linechart;
