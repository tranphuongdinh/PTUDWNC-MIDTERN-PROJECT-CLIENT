import { Button, Grid, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createGroup } from "../../client/group";
import { AuthContext } from "../../context/authContext";
import styles from "./styles.module.scss";

const Dashboard = () => {
  const { user, getUser } = useContext(AuthContext);

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
    <div className={styles.wrapper}>
      <div className={styles.actionButtonWrapper}>
        <Button onClick={() => setOpenCreateGroupForm(true)} variant="contained">
          Create new group
        </Button>

        <Button onClick={() => setOpenJoinGroupForm(true)} variant="contained">
          Join a group
        </Button>
      </div>

      <div className={styles.groupWrapper}>
        <div className={styles.myGroupWrapper}>
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
        </div>

        <div className={styles.joinedGroupWrapepr}>
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
        </div>
      </div>

      <Dialog open={openCreateGroupForm} onClose={() => setOpenCreateGroupForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <DialogTitle id="alert-dialog-title">Create new group</DialogTitle>
          <DialogContent>
            <TextField label="Group's name" placeholder="Enter group's name" {...register("name")} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateGroupForm(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openJoinGroupForm} onClose={() => setOpenJoinGroupForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleJoinGroup)}>
          <DialogTitle id="alert-dialog-title">Enter invite link to join group</DialogTitle>
          <DialogContent>
            <TextField label="Invite link" placeholder="Enter invite link" {...register("link")} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenJoinGroupForm(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Dashboard;
