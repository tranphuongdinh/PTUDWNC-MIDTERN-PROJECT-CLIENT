import CoPresentIcon from "@mui/icons-material/CoPresent";
import DeleteIcon from "@mui/icons-material/Delete";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createPresentation, deletePresentation } from "../../client/presentation";
import { customToast } from "../../utils";
import styles from "./styles.module.scss";

const Presentation = ({ user, getUser }) => {
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [openCreatePresentationForm, setOpenCreatePresentation] = useState(false);
  const [openJoinGroupForm, setOpenJoinGroupForm] = useState(false);

  const handleCreatePresentation = async (data) => {
    const { name = "", groupId = "" } = data;
    try {
      const res = await createPresentation({ name, groupId });
      if (res?.status === "OK") {
        await customToast("SUCCESS", "Create presentation successfully!");
        await getUser();
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
    setOpenCreatePresentation(false);
  };

  const handleRemovePresentation = async (id) => {
    try {
      const res = await deletePresentation(id);
      if (res?.status === "OK") {
        await customToast("SUCCESS", "Delete presentation successfully!");
        await getUser();
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
  };

  const handleJoinGroup = async (data) => {
    window.location.href = data.link;
    setOpenJoinGroupForm(false);
  };

  return (
    <Grid container spacing={6} className={styles.wrapper}>
      <Grid item xs={12} className={styles.actionButtonWrapper}>
        <Button onClick={() => setOpenCreatePresentation(true)} variant="contained" startIcon={<PresentToAllIcon />} sx={{ margin: "0 0 20px 20px" }}>
          Create new presentation
        </Button>

        <Button onClick={() => setOpenJoinGroupForm(true)} variant="contained" startIcon={<CoPresentIcon />} sx={{ margin: "0 0 20px 20px" }}>
          Join a presentation
        </Button>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>My Presentations</h1>
        <div>
          {user?.myGroupIds.length > 0 ? (
            <Grid container spacing={3}>
              {user?.presentationIds?.map((presentation) => (
                <>
                  <Grid item xs={12} md={6} lg={4} xl={3} key={presentation?._id}>
                    <Link href={`/presentation/${presentation?._id}`} legacyBehavior>
                      <a>
                        <div className={styles.card}>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemovePresentation(presentation?._id);
                            }}
                            className={styles.removeButton}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <span>{presentation?.name}</span>
                        </div>
                      </a>
                    </Link>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : (
            <p className={styles.emptyText}>
              You have not created any presentation.&nbsp;
              <a onClick={() => setOpenCreatePresentation(true)} style={{ cursor: "pointer", color: "#1976d2" }}>
                Create now!
              </a>
            </p>
          )}
        </div>
      </Grid>

      <Dialog open={openCreatePresentationForm} onClose={() => setOpenCreatePresentation(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleCreatePresentation)}>
          <DialogTitle id="alert-dialog-title">Create new presentation</DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField label="Presentation's name" placeholder="Enter presentation's name" {...register("name")} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreatePresentation(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openJoinGroupForm} onClose={() => setOpenJoinGroupForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleJoinGroup)}>
          <DialogTitle id="alert-dialog-title">Enter invite link to join presentation</DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField label="Invite link" placeholder="Enter invite link" {...register("link")} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenJoinGroupForm(false)}>Cancel</Button>
            <Button type="submit">Join</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
};

export default Presentation;
