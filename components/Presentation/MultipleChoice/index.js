import React from "react";
import { Chart } from "react-google-charts";

const renderChartData = (options) => {
  let res = [["Option", "Count"]];
  options.forEach((option) => res.push([option.label, option.data]));
  return res;
};

const MultipleChoicePresentation = ({
  options = [],
  question = "",
  type = "default",
  width = "100%",
  height = "100%",
}) => {
  return (
    <>
      {type === "preview" ? <p>{question}</p> : <h2>{question}</h2>}
      <Chart
        chartType="Bar"
        width={width}
        height={height}
        data={renderChartData(options)}
      />
    </>
  );
};

export default MultipleChoicePresentation;
