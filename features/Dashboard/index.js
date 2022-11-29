import { Button, Grid, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createGroup } from "../../client/group";
import styles from "./styles.module.scss";

const Dashboard = ({ user, getUser }) => {
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });
  const [openCreateGroupForm, setOpenCreateGroupForm] = useState(false);
  const [openJoinGroupForm, setOpenJoinGroupForm] = useState(false);

  const handleCreateGroup = async (data) => {
    try {
      const res = await createGroup(data);
      if (res?.status === "OK") {
        toast.success("Create group successfully!");
        await getUser();
      } else {
        toast.error(res?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
    setOpenCreateGroupForm(false);
  };
  const handleJoinGroup = async (data) => {
    // const url = new URL(data.link);
    window.location.href = data.link;
    // await getUser();

    // try {
    //   const res = await createGroup(data);
    //   if (res?.status === "OK") {
    //     toast.success("Create group successfully!");
    //     user.myGroupIds.push(res.data[0]._id);
    //   } else {
    //     toast.error(res?.message);
    //   }
    // } catch (e) {
    //   toast.error(e?.response?.data[0]?.message);
    // }
    setOpenJoinGroupForm(false);
  };

  return (
    <Grid container spacing={6} className={styles.wrapper}>
      <Grid item xs={12} className={styles.actionButtonWrapper}>
        <Button onClick={() => setOpenCreateGroupForm(true)} variant="contained">
          Create new group
        </Button>

        <Button onClick={() => setOpenJoinGroupForm(true)} variant="contained">
          Join a group
        </Button>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>My Groups</h1>
        <div>
          {user?.myGroupIds.length > 0 ? (
            <Grid container spacing={3}>
              {user?.myGroupIds?.map((group) => (
                <>
                  <Grid item xs={12} md={6} lg={4} xl={3} key={group?._id}>
                    <div className={styles.card} onClick={() => (window.location.href = `/group/${group?._id}`)}>
                      <span>{group?.name}</span>
                    </div>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : (
            <p className={styles.emptyText}>
              You have not created any group.&nbsp;
              <a onClick={() => setOpenCreateGroupForm(true)} style={{ cursor: "pointer", color: "#1976d2" }}>
                Create now!
              </a>
            </p>
          )}
        </div>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>Joined Groups</h1>

        {user?.joinedGroupIds.length > 0 ? (
          <Grid container spacing={3}>
            {user?.joinedGroupIds?.map((group) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={group?._id}>
                <div className={styles.card} onClick={() => (window.location.href = `/group/${group?._id}`)}>
                  <span>{group?.name}</span>
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p className={styles.emptyText}>
            You have not joined any group.&nbsp;
            <a onClick={() => setOpenJoinGroupForm(true)} style={{ cursor: "pointer", color: "#1976d2" }}>
              Join now!
            </a>
          </p>
        )}
      </Grid>

      <Dialog open={openCreateGroupForm} onClose={() => setOpenCreateGroupForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <DialogTitle id="alert-dialog-title">Create new group</DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField label="Group's name" placeholder="Enter group's name" {...register("name")} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateGroupForm(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openJoinGroupForm} onClose={() => setOpenJoinGroupForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleJoinGroup)}>
          <DialogTitle id="alert-dialog-title">Enter invite link to join group</DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField label="Invite link" placeholder="Enter invite link" {...register("link")} />
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

export default Dashboard;
