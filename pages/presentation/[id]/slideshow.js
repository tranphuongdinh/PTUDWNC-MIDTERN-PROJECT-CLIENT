import {
  Button,
  Grid,
  IconButton,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/router";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ZoomInMapRounded, ZoomOutMapRounded } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";

import styles from "./styles.module.scss";
import { useContext } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../../../context/authContext";
import { useEffect } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  getPresentationDetail,
  getQuestionList,
  updatePresentation,
} from "../../../client/presentation";
import SendIcon from "@mui/icons-material/Send";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { SocketContext } from "../../../context/socketContext";
import LoadingScreen from "../../../components/LoadingScreen";
import Drawer from "@mui/material/Drawer";
import MultipleChoicePresentation from "../../../components/Presentation/MultipleChoice";
import ParagraphPresentation from "../../../components/Presentation/Paragraph";
import HeadingPresentation from "../../../components/Presentation/Heading";
import { io } from "socket.io-client";

const SlideShow = () => {
  const { socket } = useContext(SocketContext);
  const [openQuestion, setOpenQuestion] = useState(false);
  const handle = useFullScreenHandle();
  const router = useRouter();
  const { user, isLoadingAuth } = useContext(AuthContext);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [renderQuestionList, setRenderQuestionList] = useState([
    ...questionList,
  ]);

  const getPresentation = async () => {
    setIsLoading(true);
    try {
      const { id } = router.query;
      const res = await getPresentationDetail(id);
      const presentation = res?.data?.[0];
      const questionRes = await getQuestionList(id);
      const lst = questionRes?.data;
      setQuestionList(lst || []);
      setPresentation(presentation);
      setSlides(JSON.parse(presentation?.slides) || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
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
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const PresentButton = () => (
    <Tooltip title={handle.active ? "Exit full screen" : "Go to full screen"}>
      <IconButton
        onClick={handle.active ? handle.exit : handle.enter}
        className={styles.zoomButton}
        color="primary"
      >
        {handle.active ? <ZoomInMapRounded /> : <ZoomOutMapRounded />}
      </IconButton>
    </Tooltip>
  );

  useEffect(() => {
    if (router.isReady) {
      getPresentation();
    }
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

    socket.on("startPresent", (data) => {
      if (!presentation?.isPresent && data === presentation?._id)
        router.reload();
    });

    socket.on("stopPresent", (data) => {
      if (presentation?.isPresent && data === presentation?._id)
        router.reload();
    });
  }, [presentation]);

  useEffect(() => {
    socket.on("sendQuestion", (data) => {
      if (data) {
        sortQuestionList([...questionList, data]);
        // setQuestionList([...questionList, data]);
      }
    });
    socket.on("updateQuestion", (data) => {
      if (data) {
        const idx = questionList.findIndex(
          (question) => question._id === data._id
        );
        if (idx !== -1) {
          const tmp = [...questionList];
          tmp.splice(idx, 1, data);
          // setQuestionList([...tmp]);
          sortQuestionList(tmp);
        }
      }
    });
  });

  const sortQuestionList = (updatedQuestionList) => {
     const tmp = [...updatedQuestionList];
     tmp.sort((a, b) => a.answered - b.answered || b.vote - a.vote);
    setQuestionList([...tmp]);
  }

  // useEffect(() => {
  //   const tmp = [...questionList];
  //   tmp.sort((a, b) => a.answered - b.answered || a.vote - b.vote);

  //   setRenderQuestionList([...tmp]);


  //   console.log('update list', tmp);
  // }, [questionList]);

  return isLoading || isLoadingAuth ? (
    <LoadingScreen />
  ) : (
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
            <Grid
              item
              xl={8}
              md={7}
              xs={12}
              className={styles.presentationSlideCol}
            >
              <div className={styles.buttonWrapper}>
                {index > 0 && (
                  <Button
                    startIcon={<SkipPreviousIcon />}
                    variant="contained"
                    onClick={() => {
                      setIndex(index - 1);
                      socket.emit("clientChangeSlideIndex", {
                        presentationId: presentation?._id,
                        viewIndex: index - 1,
                      });
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
                      socket.emit("clientChangeSlideIndex", {
                        presentationId: presentation?._id,
                        viewIndex: index + 1,
                      });
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
                    socket.emit("clientStopPresent", presentation?._id);
                    router.back();
                  }}
                  color="error"
                >
                  Stop Present
                </Button>
                <Button onClick={() => setOpenQuestion(true)}>
                  Open Question
                </Button>
              </div>
              {slides[index].type === "Multiple Choice" && (
                <MultipleChoicePresentation
                  width="90%"
                  height="60vh"
                  options={slides[index].content.options}
                  question={slides[index].content.question}
                />
              )}
              {slides[index].type === "Heading" && (
                <HeadingPresentation
                  heading={slides[index].content.heading}
                  subHeading={slides[index].content.subHeading}
                />
              )}
              {slides[index].type === "Paragraph" && (
                <ParagraphPresentation
                  heading={slides[index].content.heading}
                  paragraph={slides[index].content.paragraph}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              xl={4}
              className={styles.previewPresentationSlideCol}
            >
              {index + 1 < slides.length && (
                <h2 className={styles.previewTitle}>Preview next slide:</h2>
              )}
              {index + 1 < slides.length ? (
                <>
                  {slides[index + 1].type === "Multiple Choice" && (
                    <MultipleChoicePresentation
                      width="90%"
                      height="60vh"
                      options={slides[index + 1].content.options}
                      question={slides[index + 1].content.question}
                    />
                  )}
                  {slides[index + 1].type === "Heading" && (
                    <HeadingPresentation
                      heading={slides[index + 1].content.heading}
                      subHeading={slides[index + 1].content.subHeading}
                    />
                  )}
                  {slides[index + 1].type === "Paragraph" && (
                    <ParagraphPresentation
                      heading={slides[index + 1].content.heading}
                      paragraph={slides[index + 1].content.paragraph}
                    />
                  )}
                </>
              ) : (
                <p style={{ textAlign: "center" }}>
                  <i>End of slideshow</i>
                </p>
              )}
            </Grid>
          </Grid>
        </FullScreen>
      ) : presentation?.isPresent ? (
        <FullScreen handle={handle}>
          <PresentButton />
          <Button
            sx={{
              position: "absolute",
              right: "10px",
              bottom: "10px",
            }}
            onClick={() => setOpenQuestion(true)}
          >
            Open Question
          </Button>
          <div className={styles.userVoteViewWrapper}>
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
                {slides[viewIndex].type === "Heading" && (
                  <HeadingPresentation
                    heading={slides[viewIndex].content.heading}
                    subHeading={slides[viewIndex].content.subHeading}
                  />
                )}
                {slides[viewIndex].type === "Paragraph" && (
                  <HeadingPresentation
                    heading={slides[viewIndex].content.heading}
                    paragraph={slides[viewIndex].content.paragraph}
                  />
                )}
                {slides[viewIndex].type === "Multiple Choice" && (
                  <>
                    <h1>{slides[viewIndex]?.content?.question}</h1>
                    {slides[viewIndex]?.content.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => {
                          option.data += 1;
                          const updatedPresentation = {
                            ...presentation,
                            slides: JSON.stringify(slides),
                          };
                          socket.emit("vote", updatedPresentation);
                          setIsAnswered(true);
                        }}
                        variant="contained"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </FullScreen>
      ) : (
        <div className={styles.userVoteViewWrapper}>
          <span>This presentation has not been started yet.</span>
        </div>
      )}
      <Drawer
        anchor="right"
        open={openQuestion}
        onClose={() => setOpenQuestion(false)}
      >
        <div
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            marginTop: "50px",
            padding: "20px",
          }}
        >
          <h3 style={{ textAlign: "left", width: "100%" }}>
            Questions from viewers:
          </h3>

          {Array.isArray(questionList) &&
            questionList.length > 0 &&
            questionList.map((question, index) => (
              <div key={question._id} className={styles.fullWidth}>
                {user?._id && presentation?.ownerId && (
                  <Tooltip title="Check this question answered">
                    <Checkbox
                      checked={question.answered}
                      onChange={() => {
                        const updatedQuestionList = [...questionList];
                        const res = !question.answered;
                        updatedQuestionList.splice(index, 1, {
                          ...question,
                          answered: res,
                        });
                        // setQuestionList([...updatedQuestionList]);
                        socket.emit("clientUpdateQuestion", {
                          ...question,
                          answered: res,
                        });
                        // sortQuestionList(updatedQuestionList);
                      }}
                    />
                  </Tooltip>
                )}

                <TextField
                  disabled
                  id="outlined-disabled"
                  label={question?.userName || "Username"}
                  defaultValue={question?.content || "question"}
                />
                <IconButton
                  onClick={() => {
                    const updatedQuestionList = [...questionList];
                    const res = question.vote + 1;
                    updatedQuestionList.splice(index, 1, {
                      ...question,
                      vote: res,
                    });

                    socket.emit("clientUpdateQuestion", {
                      ...question,
                      vote: res,
                    });
                    // sortQuestionList(updatedQuestionList);
                  }}
                >
                  <ThumbUpIcon />
                </IconButton>
                {question?.vote || 0}
              </div>
            ))}

          {presentation?.ownerId !== user?._id && (
            <div style={{ width: "100%", textAlign: "left" }}>
              <h3>Send your question:</h3>
              <div className={styles.fullWidth}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  multiline
                  maxRows={5}
                  minRows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <IconButton
                  onClick={() => {
                    socket.emit("clientSendQuestion", {
                      presentationId: presentation?._id,
                      userName: user?.name,
                      content: question,
                    });
                  }}
                >
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default SlideShow;
