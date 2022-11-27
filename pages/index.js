import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Dashboard from "../features/Dashboard";

const Home = () => {
  const { isAuthenticated, user, getUser } = useContext(AuthContext);
  if (!isAuthenticated) {
    window.location.href = "/login";
    return;
  }
  return <Dashboard user={user} getUser={getUser} />;
};

export default Home;
