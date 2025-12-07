import React, { useEffect, useMemo, useState } from "react";
import "../styles/components/hero.css";
import DonutChart from "./charts/DonutChart";


const colors = [
  "#10b981",
  "#a78bfa",
  "#18c9dd",
  "#fb923c",
  "#fb7185",
  "#32ca5b",
  "#fb7185",
  "#a1a1aa",
  "#a3b18a",
  "#e0aaff",
];

const Hero = ({ total, time, percentages }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const series = percentages.map((item) => Number(item.percentage));
    const labels = percentages.map((item) => item.name);
    setSeries(series);
    setLabels(labels);
  }, [percentages]);

  return (
    <div className="hero_wrapper">
      <div className="hero_price_wrapper">
        <div>
          <span className="hero_sub_text">Portfolio Total</span>
          <p className="hero_total">${total.toFixed(2)}</p>
        </div>
        <span className="hero_sub_text">Last updated: {time}</span>
      </div>

      {percentages.length === 0 ? (
        <div className="no_data">No data</div>
      ) : (
        <div className="hero_chart_wrapper">
          <p className="hero_sub_text hero_chart_heading">Portfolio Coins</p>

          <div className="hero_chart_container">
            <div className="hero_chart">
              <DonutChart series={series} labels={labels} colors={colors} />
            </div>
            <div className="hero_chart_legends">
              {percentages.map((item, index) => (
                <div key={item.name} className="hero_chart_legend">
                  <span
                    className="hero_label"
                    style={{
                      color: colors[index],
                    }}
                  >
                    {item.name}
                  </span>
                  <span className="hero_label">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
