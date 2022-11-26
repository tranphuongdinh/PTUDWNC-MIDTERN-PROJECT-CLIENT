import { Button, Card, Grid, Link, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createGroup } from "../../client/group";
import { AuthContext } from "../../context/authContext";
import { getGroupDetail } from "../../client/group";
import styles from "./styles.module.scss";

const Dashboard = () => {
  const { user, isAuthenticated, login, logout, signup, isLoadingAuth } =
    useContext(AuthContext);
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });
  const [openCreateGroupForm, setOpenCreateGroupForm] = useState(false);
  const handleCreateGroup = async (data) => {
    try {
      const res = await createGroup(data);
      if (res?.status === "OK") {
        toast.success("Create group successfully!");
        user.myGroupIds.push(res.data[0]._id);
      } else {
        toast.error(res?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data[0]?.message);
    }
    setOpenCreateGroupForm(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionButtonWrapper}>
        <Button
          onClick={() => setOpenCreateGroupForm(true)}
          variant="contained"
        >
          Create new group
        </Button>

        <Button
          onClick={() => setOpenCreateGroupForm(true)}
          variant="contained"
        >
          Join a group
        </Button>
      </div>

      <div className={styles.groupWrapper}>
        <div className={styles.myGroupWrapper}>
          <h1>My Groups</h1>
          <div>
            <Grid container spacing={3}>
              {user?.myGroupIds?.map((group) => (
                <>
                  <Grid item xs={12} md={6} lg={4} xl={3} key={group._id}>
                    <div
                      className={styles.card}
                      onClick={() =>
                        (window.location.href = `/group/${group._id}`)
                      }
                    >
                      <span>{group.name}</span>
                    </div>
                  </Grid>
                </>
              ))}
            </Grid>
          </div>
        </div>

        <div className={styles.joinedGroupWrapepr}>
          <h1>Joined Groups</h1>

          <Grid container spacing={3}>
            {user?.joinedGroupIds?.map((group) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={group._id}>
                <div
                  className={styles.card}
                  onClick={() => (window.location.href = `/group/${group._id}`)}
                >
                  <span>{group.name}</span>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

      <Dialog
        open={openCreateGroupForm}
        onClose={() => setOpenCreateGroupForm(false)}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <DialogTitle id="alert-dialog-title">Create new group</DialogTitle>
          <DialogContent>
            <TextField
              label="Group's name"
              placeholder="Enter group's name"
              {...register("name")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateGroupForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Dashboard;
