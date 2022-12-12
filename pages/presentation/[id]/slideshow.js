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
  const isOwner = true;

  if (!slides.length) {
    return <div>EMPTY SLIDE, CANNOT PRESENT</div>;
  }
  // if (ownerToken === accessToken) { // cho host va co-host
  if (isOwner) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div style={{ width: "70vw", height: "70vh" }}>
          current slide show
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
        <div style={{ width: "30vw", height: "30vh" }}>
          preview next slide
          {index + 1 < slides.length ? (
            <>
              <h1>{slides[index + 1]?.content?.question}</h1>
              <Chart
                chartType="Bar"
                width="60vh"
                height="60vh"
                data={renderData()}
              />
            </>
          ) : (
            <p>da toi cuoi slide</p>
          )}
        </div>
      </div>
    );
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
