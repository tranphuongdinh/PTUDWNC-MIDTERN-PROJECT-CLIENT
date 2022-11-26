import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", minHeight: "100vh" }}>{children}</div>
      <Footer />
    </div>
  );
};

export default AppLayout;
