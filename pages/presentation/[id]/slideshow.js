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
import {
  CheckBox,
  ZoomInMapRounded,
  ZoomOutMapRounded,
} from "@mui/icons-material";
import styles from "./styles.module.scss";
import { useContext } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../../../context/authContext";
import { useEffect } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  getPresentationDetail,
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

  const getPresentation = async () => {
    setIsLoading(true);
    try {
      const { id } = router.query;
      const res = await getPresentationDetail(id);
      const presentation = res?.data?.[0];
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
        setQuestionList([...questionList, data]);
      }
    });
    socket.on("updateQuestion", (data) => {
      if (data) {
        const idx = questionList.find((question) => question._id === data._id);
        if (idx !== -1) {
          const tmp = [...questionList];
          tmp.splice(idx, 1, data);
          setQuestionList(tmp);
        }
      }
    });
  }, [question]);

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
            width: "20vw",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <h4>Questions from viewers:</h4>

          {questionList.map((question, index) => (
            <div key={index}>
              <Tooltip title="Check this question answered">
                <CheckBox
                  checked={false}
                  onChange={() => {}}
                  color="success"
                  value={true}
                />
              </Tooltip>
              <TextField
                disabled
                id="outlined-disabled"
                label={question?._id || "Username"}
                defaultValue={question?.content || "question"}
              />
              <IconButton
                onClick={() => {
                  const numVote = question.vote + 1;
                  const updatedQuestion = {
                    ...question,
                    vote: numVote,
                  };

                  socket.emit("clientUpdateQuestion", updatedQuestion);
                }}
              >
                <ThumbUpIcon />
              </IconButton>
              {question?.vote || 0}
            </div>
          ))}

          {presentation?.ownerId === user?._id && (
            <div>
              <h3>Send your question:</h3>
              <TextareaAutosize
                sx={{ width: "100%" }}
                minRows={5}
                id="outlined-basic"
                variant="outlined"
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
          )}
        </div>
      </Drawer>
    </>
  );
};

export default SlideShow;
