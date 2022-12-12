import { Button, Card, FormLabel, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Chart } from "react-google-charts";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ShareIcon from "@mui/icons-material/Share";

// Slide ={
// 	id,
// 	type,
// 	content: {
// 		question:
// 		options:[
// 			option1,
// 			option2,
// 		]
// 	}
// }

const data = [
  ["Year", "Sales"],
  ["2014", 1000],
  ["2015", 1170],
  ["2016", 660],
  ["2017", 1030],
];

const PresentationDetailPage = () => {
  const router = useRouter();

  //get slide from store (tam thoi)
  const temp = localStorage.getItem("slides");

  const [slides, setSlides] = useState(
    temp
      ? JSON.parse(temp)
      : [
          {
            // id: 0,
            type: "Multiple Choice",
            content: {
              question: "Question",
              options: [
                {
                  label: "Option1",
                  data: 3,
                },
                {
                  label: "Option2",
                  data: 5,
                },
              ],
            },
          },
        ]
  );

  // tam thoi luu slides vao storage (that ra la luu vao database)
  useEffect(() => {
    localStorage.setItem("slides", JSON.stringify(slides));
  }, [slides]);

  const [selectedSlide, setSelectedSlide] = useState(0);
  const { id } = router.query;
  //  console.log(id);

  const renderData = () => {
    let res = [["Option", "Count"]];
    slides[selectedSlide].content.options.map((option) => {
      res.push([option.label, option.data]);
    });
    return res;
  };
  return (
    <div className={styles.wrapper}>
      <Grid container spacing={3}>
        <Grid container item xs={12}>
          <Grid item xs={9}>
            <h1>SELECTED SLIDE: {JSON.stringify(selectedSlide)}</h1>
            {JSON.stringify(slides[selectedSlide])}
          </Grid>
          <Grid item xs={3}>
            <Button sx={{ margin: "0 0 20px 20px" }} variant="contained">
              <ShareIcon />
              &nbsp;Share
            </Button>
            <Button
              sx={{ margin: "0 0 20px 20px" }}
              variant="contained"
              onClick={() =>
                (window.location.href = `/presentation/${id}/slideshow`)
              }
            >
              <SlideshowIcon />
              &nbsp;Present
            </Button>
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => {
                // const idx = slides[slides.length - 1].id + 1;
                const newSlides = [
                  ...slides,
                  {
                    // id: idx,
                    type: "Multiple Choice",
                    content: {
                      question: "Question",
                      options: [
                        {
                          label: "Option1",
                          data: 0,
                        },
                        {
                          label: "Option1",
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
                  <Card
                    onClick={() => setSelectedSlide(index)}
                    class={styles.previewSlideItem}
                  >
                    {index}
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

          <Grid item md={6}>
            <div className={styles.previewSlide}>
              {slides.length ? (
                <>
                  <h2>{slides[selectedSlide]?.content?.question}</h2>
                  <Chart
                    chartType="Bar"
                    width="400px"
                    height="300px"
                    data={renderData()}
                  />
                </>
              ) : (
                <h2>Empty slide</h2>
              )}
            </div>
          </Grid>
          {slides.length ? (
            <Grid item md={4} container>
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
    </div>
  );
};

export default PresentationDetailPage;
