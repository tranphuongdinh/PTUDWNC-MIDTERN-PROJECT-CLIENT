import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";
import { Container } from "@mui/system";
import { SocketContext } from "../context/socketContext";
import { customToast } from "../utils";
import { CustomNotifyComponent } from "./CustomNotify";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on('messageToNotify', data => {
      /* Checking if the user is the same as the data.name. If it is not, it will show a toast message. */
      if (user.name !== data.name) {
        customToast("INFO", <CustomNotifyComponent content={"You have a new messenger in presentation with ID " + data.room} />)
      }
    })
    return () => { socket.off('messageToNotify') }
  }, [socket])

  const checkNotLoggedIn = window.location.href === "/active";
  const isShowing = window.location.href.includes("slideshow");
  if (!isAuthenticated || checkNotLoggedIn || !user || isShowing) {
    return <>{children}</>;
  }

  return (
    <>
      <Header logout={logout} user={user} />
      <Container
        container
        maxWidth="xl"
      >
        <div className={styles.appLayout}>{children}</div>
      </Container>
      <Footer />
    </>
  );
};

export default AppLayout;
