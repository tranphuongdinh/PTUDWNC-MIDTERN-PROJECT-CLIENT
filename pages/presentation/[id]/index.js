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
    id: 0,
    type: "Multiple Choice",
    content: {
      question: "",
      options: ["option1", "option2"],
    },
  });
  const { id } = router.query;
  //  console.log(id);
  return (
    <Grid container spacing={3}>
      <Grid container item xs={12}>
        <Grid item xs={10}>
          Presentation name
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
                    options: ["option1", "option2"],
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

            <Grid item xs={12}>
              <TextField
                label="Option 1"
                placeholder="Type option 1"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Option 2"
                placeholder="Type option 2"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Option 3"
                placeholder="Type option 3"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained">Add option</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PresentationDetailPage;
