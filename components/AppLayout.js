import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
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
