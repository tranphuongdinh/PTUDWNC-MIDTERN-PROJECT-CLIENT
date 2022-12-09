import { Button, Card, FormLabel, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";

const PresentationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
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
          <Button variant="contained">New Slide</Button>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={3}>
        <Grid item md={2} container spacing={2}>
          <Grid item xs={12}>
            <Card className={styles.slide}>Slide 1</Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={styles.slide}>Slide 2</Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={styles.slide}>Slide 3</Card>
          </Grid>
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
              <TextField label="Your question" placeholder="Type your question" fullWidth />
            </Grid>
          </Grid>

          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
              <FormLabel className={styles.formLabel}>Options</FormLabel>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Option 1" placeholder="Type option 1" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Option 2" placeholder="Type option 2" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Option 3" placeholder="Type option 3" fullWidth />
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
