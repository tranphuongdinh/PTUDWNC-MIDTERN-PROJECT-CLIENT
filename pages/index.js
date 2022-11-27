import React from 'react';
import Dashboard from '../features/Dashboard';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    window.location.href = "/login";
    return;
  }
  return (
    <Dashboard />
  )
}

export default Home;