import { Button, Grid, IconButton, Tooltip } from "@mui/material";
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
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { SocketContext } from "../../../context/socketContext";

const SlideShow = () => {
  const { socket } = useContext(SocketContext);

  const handle = useFullScreenHandle();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);

  const getPresentation = async () => {
    try {
      const { id } = router.query;
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

  const [index, setIndex] = useState(0);

  const [viewIndex, setViewIndex] = useState(0);

  const [isAnswered, setIsAnswered] = useState(false);

  const renderData = (isNext = false) => {
    let res = [["Options", "Count"]];
    slides[isNext ? index + 1 : index]?.content?.options.map((option) => {
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

  useEffect(() => {
    if (router.isReady) getPresentation();
  }, [router.isReady]);

  useEffect(() => {
    socket.on("voted", (data) => {
      if (data?._id === presentation?._id) {
        setSlides(JSON.parse(data.slides) || []);
      }
    });

    socket.on("changeSlideIndex", (data) => {
      if (data?.presentationId === presentation?._id) {
        setViewIndex(data.viewIndex);
        setIsAnswered(false);
      }
    });
  }, [presentation]);

  return (
    <>
      {user?._id && presentation?.ownerId === user?._id ? (
        <FullScreen handle={handle}>
          <PresentButton />
          <Grid
            container
            spacing={6}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100vw",
              height: "100vh",
            }}
          >
            <Grid item xl={8} md={7} xs={12} className={styles.presentationSlideCol}>
              <div className={styles.buttonWrapper}>
                {index > 0 && (
                  <Button
                    startIcon={<SkipPreviousIcon />}
                    variant="contained"
                    onClick={() => {
                      setIndex(index - 1);
                      socket.emit("clientChangeSlideIndex", { presentationId: presentation?._id, viewIndex: index - 1 });
                    }}
                  >
                    Previous Slide
                  </Button>
                )}
                {index < slides.length - 1 && (
                  <Button
                    startIcon={<SkipNextIcon />}
                    variant="contained"
                    onClick={() => {
                      setIndex(index + 1);
                      socket.emit("clientChangeSlideIndex", { presentationId: presentation?._id, viewIndex: index + 1 });
                    }}
                  >
                    Next Slide
                  </Button>
                )}
                <Button
                  startIcon={<CancelPresentationIcon />}
                  variant="contained"
                  onClick={async () => {
                    await updatePresentationDetail({ isPresent: false });
                    router.back();
                  }}
                  color="error"
                >
                  Stop Present
                </Button>
              </div>
              <h1>{slides[index]?.content?.question}</h1>
              <Chart chartType="Bar" width="90%" height="60vh" data={renderData()} />
            </Grid>
            <Grid item xs={12} md={5} xl={4} className={styles.previewPresentationSlideCol}>
              {index + 1 < slides.length && <h2 className={styles.previewTitle}>Preview next slide:</h2>}
              {index + 1 < slides.length ? (
                <>
                  <h1>{slides[index + 1]?.content?.question}</h1>
                  <Chart chartType="Bar" width="100%" height="60vh" data={renderData(true)} />
                </>
              ) : (
                <p style={{ textAlign: "center" }}>
                  <i>End of slideshow</i>
                </p>
              )}
            </Grid>
          </Grid>
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
                <h1>{slides[viewIndex]?.content?.question}</h1>
                {slides[viewIndex]?.content.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      option.data += 1;
                      const updatedPresentation = { ...presentation, slides: JSON.stringify(slides) };
                      socket.emit("vote", updatedPresentation);
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
