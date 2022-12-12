import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const checkNotLoggedIn = window.location.href === "/active";
  const isShowing = window.location.href.includes("slideshow");
  if (!isAuthenticated || checkNotLoggedIn || !user || isShowing) {
    return <>{children}</>;
  }

  return (
    <>
      <Header logout={logout} user={user} />
      <div className={styles.appLayout}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
