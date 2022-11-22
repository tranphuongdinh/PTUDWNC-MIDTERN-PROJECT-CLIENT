import { Button } from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Home = () => {
  const { user, isAuthenticated, login, logout, signup, isLoadingAuth } =
    useContext(AuthContext);

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

        <Button
          variant="contained"
          onClick={logout}
          style={{ margin: "20px auto", display: "block" }}
        >
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default Home;
