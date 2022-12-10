import { Button, Card, FormLabel, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

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

const PresentationDetailPage = () => {
  const router = useRouter();
  const [slides, setSlides] = useState([
    {
      // id: 0,
      type: "Multiple Choice",
      content: {
        question: "",
        options: ["option1", "option2"],
      },
    },
  ]);

  const [selectedSlide, setSelectedSlide] = useState({
    ...slides[0],
    id: 0,
  });
  const { id } = router.query;
  //  console.log(id);
  return (
    <Grid container spacing={3}>
      <Grid container item xs={12}>
        <Grid item xs={10}>
          {JSON.stringify(selectedSlide)}
        </Grid>
        <Grid item xs={2}>
          <Button sx={{ margin: "0 0 20px 20px" }} variant="contained">
            Share
          </Button>
          <Button sx={{ margin: "0 0 20px 20px" }} variant="contained">
            Present
          </Button>
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={12}>
          <Button
            onClick={() => {
              // const idx = slides[slides.length - 1].id + 1;
              const newSlides = [
                ...slides,
                {
                  // id: idx,
                  type: "Multiple Choice",
                  content: {
                    question: "",
                    options: [
                      { title: "option1", value: 2 },
                      { title: "option2", value: 5 },
                    ],
                  },
                },
              ];
              setSlides(newSlides);
            }}
            variant="contained"
          >
            New Slide
          </Button>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={3}>
        <Grid item md={2} container spacing={2}>
          {slides.map((slide, index) => (
            <Grid item xs={12} key={index}>
              <Card
                className={clsx(
                  styles.slide,
                  index === selectedSlide.id && styles.selected
                )}
                onClick={() =>
                  setSelectedSlide({
                    ...selectedSlide,
                    id: index,
                  })
                }
              >
                {index}
              </Card>
              <Button
                onClick={() => {
                  console.log("before", [...slides]);
                  if (index === selectedSlide.id) {
                    const idx = index > 0 ? index - 1 : 0;
                    setSelectedSlide({ ...selectedSlide, id: idx });
                  }
                  const tmp = slides;
                  tmp.splice(index, 1);
                  console.log("after", tmp);
                  setSlides([...tmp]);

                  // setSlides(filterdSlides);
                }}
              >
                Delete slide {index}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid item md={6}>
          Preview slide
        </Grid>
        <Grid item md={4} container>
          <Grid item container xs={12}>
            <Grid item xs={12}>
              <FormLabel className={styles.formLabel}>Your Question</FormLabel>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your question"
                placeholder="Type your question"
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
              <FormLabel className={styles.formLabel}>Options</FormLabel>
            </Grid>
            {selectedSlide?.content?.options?.length > 0 &&
              selectedSlide?.content?.options.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label="Option 1"
                    placeholder="Type option 1"
                    fullWidth
                    value={selectedSlide.content.options[index].title}
                    onChange={(e) => {
                      const tmp = [...selectedSlide.content.options];
                      tmp.splice(index, 1, {
                        title: e.target.value,
                        value: 0,
                      });
                      setSelectedSlide({
                        ...selectedSlide,
                        content: {
                          ...selectedSlide.content,
                          options: [...tmp],
                        },
                      });
                    }}
                  />
                  <Button
                    onClick={() => {
                      const tmp = [...selectedSlide.content.options];
                      tmp.splice(index, 1);
                      setSelectedSlide({
                        ...selectedSlide,
                        content: {
                          ...selectedSlide.content,
                          options: [...tmp],
                        },
                      });
                    }}
                  >
                    Delete option {index + 1}
                  </Button>
                </Grid>
              ))}

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  const tmp = [
                    ...selectedSlide.content.options,
                    {
                      value: 0,
                      title: `Option ${
                        selectedSlide.content.options.length + 1
                      }`,
                    },
                  ];
                  setSelectedSlide({
                    ...selectedSlide,
                    content: {
                      ...selectedSlide.content,
                      options: [...tmp],
                    },
                  });
                }}
              >
                Add option
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PresentationDetailPage;
