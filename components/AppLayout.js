import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = ({ children }) => {
  if (window.location.pathname === "/login") {
    return <div>{children}</div>;
  }
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
