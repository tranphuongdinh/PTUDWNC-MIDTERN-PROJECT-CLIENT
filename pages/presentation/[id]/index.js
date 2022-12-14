import {
  Button,
  Card,
  Container,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Chart } from "react-google-charts";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ShareIcon from "@mui/icons-material/Share";
import {
  getPresentationDetail,
  updatePresentation,
} from "../../../client/presentation";

const PresentationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

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
        slides: JSON.stringify(slides),
        ...config,
      };
      const res = await updatePresentation(newPresentation);
    } catch (e) {}
  };

  useEffect(() => {
    updatePresentationDetail();
  }, [slides]);

  useEffect(() => {
    getPresentation();
  }, []);

  const [selectedSlide, setSelectedSlide] = useState(0);

  const renderData = (selectedSlide) => {
    let res = [["Option", "Count"]];
    slides[selectedSlide].content.options.map((option) => {
      res.push([option.label, option.data]);
    });
    return res;
  };

  return (
    <Container className={styles.wrapper}>
      <Grid container spacing={3}>
        <Grid container item xs={12}>
          <Grid item xs={12} md={6}>
            <h1>{presentation?.name}</h1>
          </Grid>
          <Grid item xs={12} md={6} className={styles.buttonGroup}>
            <Button sx={{ margin: "10px 0 10px 20px" }} variant="contained">
              <ShareIcon />
              &nbsp;Share
            </Button>
            <Button
              sx={{ margin: "10px 0 10px 20px" }}
              variant="contained"
              onClick={async () => {
                await updatePresentationDetail({ isPresent: true });
                router.push(`/presentation/${id}/slideshow`);
              }}
            >
              <SlideshowIcon />
              &nbsp;Present
            </Button>
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Button
            style={{ marginLeft: "20px" }}
            onClick={() => {
              const newSlides = [
                ...slides,
                {
                  type: "Multiple Choice",
                  content: {
                    question: "Your question",
                    options: [
                      {
                        label: "Option 1",
                        data: 0,
                      },
                      {
                        label: "Option 2",
                        data: 0,
                      },
                    ],
                  },
                },
              ];
              setSlides(newSlides);
            }}
            variant="contained"
          >
            <AddIcon />
            &nbsp;New Slide
          </Button>
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item md={2} container spacing={2}>
            <div className={styles.slidesList}>
              {slides.map((slide, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  className={clsx(
                    styles.slideItem,
                    index === selectedSlide && styles.selected
                  )}
                >
                  <span className={styles.index}>{index}</span>

                  <Card
                    onClick={() => setSelectedSlide(index)}
                    class={styles.previewSlideItem}
                  >
                    <p>{slides[index]?.content?.question}</p>

                    <Chart
                      chartType="Bar"
                      width="70%"
                      height="70%"
                      data={renderData(index)}
                    />
                  </Card>
                  <Button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (index === selectedSlide) {
                        const idx = index > 0 ? index - 1 : 0;
                        setSelectedSlide(idx);
                      }
                      const tmp = [...slides];
                      tmp.splice(index, 1);
                      setSlides([...tmp]);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Grid>
              ))}
            </div>
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <div className={styles.previewSlide}>
              {slides.length ? (
                <>
                  <h2>{slides[selectedSlide]?.content?.question}</h2>
                  <Chart
                    chartType="Bar"
                    width="90%"
                    height="90%"
                    data={renderData(selectedSlide)}
                  />
                </>
              ) : (
                <h2>Empty slide</h2>
              )}
            </div>
          </Grid>
          {slides.length ? (
            <Grid item md={4} sm={12} container className={styles.content}>
              <Grid item container xs={12}>
                <Grid item xs={12}>
                  <FormLabel className={styles.formLabel}>
                    Your Question
                  </FormLabel>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Your question"
                    placeholder="Type your question"
                    fullWidth
                    value={slides[selectedSlide].content.question}
                    onChange={(e) => {
                      const replaceSlide = {
                        ...slides[selectedSlide],
                        content: {
                          ...slides[selectedSlide].content,
                          question: e.target.value,
                        },
                      };
                      const tmp = [...slides];
                      tmp.splice(selectedSlide, 1, replaceSlide);
                      setSlides([...tmp]);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} spacing={2}>
                <Grid item xs={12}>
                  <FormLabel className={styles.formLabel}>Options</FormLabel>
                </Grid>
                {slides[selectedSlide].content.options.length > 0 &&
                  slides[selectedSlide].content.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                      <TextField
                        label="Option 1"
                        placeholder="Type option 1"
                        fullWidth
                        value={
                          slides[selectedSlide].content.options[index].label
                        }
                        onChange={(e) => {
                          // full code to control option in slides state
                          const newOptions = [
                            ...slides[selectedSlide].content.options,
                          ];
                          newOptions.splice(index, 1, {
                            ...newOptions[index],
                            label: e.target.value,
                          });
                          const replaceSlide = {
                            ...slides[selectedSlide],
                            content: {
                              ...slides[selectedSlide].content,
                              options: [...newOptions],
                            },
                          };
                          const tmp = [...slides];
                          tmp.splice(selectedSlide, 1, replaceSlide);
                          setSlides([...tmp]);
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          const newOptions = [
                            ...slides[selectedSlide].content.options,
                          ];
                          newOptions.splice(index, 1);
                          const replaceSlide = {
                            ...slides[selectedSlide],
                            content: {
                              ...slides[selectedSlide].content,
                              options: [...newOptions],
                            },
                          };
                          const tmp = [...slides];
                          tmp.splice(selectedSlide, 1, replaceSlide);
                          setSlides([...tmp]);
                        }}
                      >
                        <DeleteIcon style={{ fontSize: "18px" }} />
                        &nbsp;Delete option {index + 1}
                      </Button>
                    </Grid>
                  ))}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const newOptions = [
                        ...slides[selectedSlide].content.options,
                      ];
                      newOptions.push({
                        label: `Option ${newOptions.length + 1}`,
                        data: 0,
                      });
                      const replaceSlide = {
                        ...slides[selectedSlide],
                        content: {
                          ...slides[selectedSlide].content,
                          options: [...newOptions],
                        },
                      };
                      const tmp = [...slides];
                      tmp.splice(selectedSlide, 1, replaceSlide);
                      setSlides([...tmp]);
                    }}
                  >
                    Add option
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PresentationDetailPage;
