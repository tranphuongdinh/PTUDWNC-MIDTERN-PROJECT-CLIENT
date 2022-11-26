import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";

const AppLayout = ({ children }) => {
  if (window.location.pathname === "/login" || window.location.pathname === "/register") {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <div className={styles.appLayout}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
