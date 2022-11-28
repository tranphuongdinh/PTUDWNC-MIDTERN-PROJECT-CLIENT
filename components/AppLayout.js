import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  // hard code 
  const checkNotLoggedIn = window.location.href === "/active";
  if (!isAuthenticated || checkNotLoggedIn) {
    return <>{children}</>;
  }
  return (
    <>
      <Header logout={logout} />
      <div className={styles.appLayout}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
