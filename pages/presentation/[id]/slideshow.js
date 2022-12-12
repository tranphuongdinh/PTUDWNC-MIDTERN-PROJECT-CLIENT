import { Button } from "@mui/material";
import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/router";

const SlideShow = () => {
  const router = useRouter();

  // lay slides tu database (xai tam thoi storage)
  const slides = JSON.parse(localStorage.getItem("slides"));
  const [index, setIndex] = useState(0);
  const renderData = () => {
    let res = [["Option", "Count"]];
    slides[index].content.options.map((option) => {
      res.push([option.label, option.data]);
    });
    return res;
  };
  const { id } = router.query;

  if (!slides.length) {
    return <div>EMPTY SLIDE, CANNOT PRESENT</div>;
  }
  // if (ownerToken === accessToken) { // cho host va co-host
  if (false) {
  } else {
    {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
            width: "100vw",
            height: "100vh",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {index > 0 && (
              <Button onClick={() => setIndex(index - 1)}>Previous</Button>
            )}
            {index < slides.length - 1 && (
              <Button onClick={() => setIndex(index + 1)}>Next</Button>
            )}
            <Button
              onClick={() => (window.location.href = `/presentation/${id}`)}
            >
              Exit
            </Button>
          </div>

          <h1>{slides[index]?.content?.question}</h1>
          <Chart
            chartType="Bar"
            width="60vh"
            height="60vh"
            data={renderData()}
          />
        </div>
      );
    }
    // cho nguoi xem bth
  }
  return <div>{slides}</div>;
};

export default SlideShow;
