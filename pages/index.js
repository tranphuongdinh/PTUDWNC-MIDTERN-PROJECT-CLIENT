import { Button, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Home = () => {
  const { user, isAuthenticated, login, logout, signup, isLoadingAuth } = useContext(AuthContext);

  const { register, handleSubmit } = useForm({ mode: "onChange", defaultValues: { name: "" } });

  const [openCreateGroupForm, setOpenCreateGroupForm] = useState(false);

  const createGroup = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <div className="infoBox">
        <h1>YOUR INFO</h1>
        <p>
          Name: <strong>{user?.name}</strong>
        </p>
        <p>
          Email: <strong>{user?.email}</strong>
        </p>

        <Button variant="contained" onClick={logout} style={{ margin: "20px auto", display: "block" }}>
          LOGOUT
        </Button>
      </div>

      <Button onClick={() => setOpenCreateGroupForm(true)} variant="contained">
        Create new group
      </Button>

      <Dialog open={openCreateGroupForm} onClose={() => setOpenCreateGroupForm(false)} style={{ width: "100%" }}>
        <DialogTitle id="alert-dialog-title">Create new group</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(createGroup)}>
            <TextField label="Group's name" placeholder="Enter group's name" {...register("name")} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateGroupForm(false)}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
