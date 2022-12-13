import { Button, IconButton, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/router";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ZoomInMapRounded, ZoomOutMapRounded } from "@mui/icons-material";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useEffect } from "react";
import { getPresentationDetail, updatePresentation } from "../../../client/presentation";

const SlideShow = () => {
  const handle = useFullScreenHandle();
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);

  const getPresentation = async () => {
    try {
      const res = await getPresentationDetail(id);
      const presentation = res?.data?.[0];
      setPresentation(presentation);
      setSlides(JSON.parse(presentation?.slides) || []);
    } catch (e) {}
  };

  const updatePresentationDetail = async (config = {}) => {
    try {
      const newPresentation = {
        ...presentation,
        ...config,
      };
      const res = await updatePresentation(newPresentation);
    } catch (e) {}
  };

  useEffect(() => {
    getPresentation();
  }, []);

  const [index, setIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const renderData = () => {
    let res = [["Option", "Count"]];
    slides[index].content.options.map((option) => {
      res.push([option.label, option.data]);
    });
    return res;
  };

  const PresentButton = () => (
    <Tooltip title={handle.active ? "Exit full screen" : "Go to full screen"}>
      <IconButton onClick={handle.active ? handle.exit : handle.enter} className={styles.zoomButton} color="primary">
        {handle.active ? <ZoomInMapRounded /> : <ZoomOutMapRounded />}
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      {presentation?.ownerId === user?._id ? (
        <FullScreen handle={handle}>
          <PresentButton />
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
                {index > 0 && <Button onClick={() => setIndex(index - 1)}>Previous</Button>}
                {index < slides.length - 1 && <Button onClick={() => setIndex(index + 1)}>Next</Button>}
                <Button
                  onClick={async () => {
                    await updatePresentationDetail({ isPresent: false });
                    router.back();
                  }}
                >
                  Exit
                </Button>
              </div>
              <h1>{slides[index]?.content?.question}</h1>
              <Chart chartType="Bar" width="60vh" height="60vh" data={renderData()} />
            </div>
            <div style={{ width: "30vw", height: "30vh" }}>
              preview next slide
              {index + 1 < slides.length ? (
                <>
                  <h1>{slides[index + 1]?.content?.question}</h1>
                  <Chart chartType="Bar" width="60vh" height="60vh" data={renderData()} />
                </>
              ) : (
                <p>da toi cuoi slide</p>
              )}
            </div>
          </div>
        </FullScreen>
      ) : (
        <FullScreen handle={handle}>
          <PresentButton />
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
            {isAnswered ? (
              <div>Thank you for you answer</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                <h1>{slides[index]?.content?.question}</h1>
                {slides[index]?.content.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setIsAnswered(true);
                    }}
                    variant="contained"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </FullScreen>
      )}
    </>
  );
};

export default SlideShow;
