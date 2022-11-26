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
      {children}
      <Footer />
    </>
  );
};

export default AppLayout;
