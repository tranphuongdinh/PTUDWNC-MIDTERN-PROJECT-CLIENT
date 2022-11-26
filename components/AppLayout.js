import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = ({ children }) => {
  if (window.location.pathname === "/login") {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", width: "!00%" }}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
