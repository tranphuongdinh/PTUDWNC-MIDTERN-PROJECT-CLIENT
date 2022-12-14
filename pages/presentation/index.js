import React, { useContext } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { AuthContext } from "../../context/authContext";
import Presentation from "../../features/Presentation";
import Breadcrumb from "../../components/Breadcrumb";

const PresentationPage = () => {
  const { user, getUser, isLoadingAuth, isAuthenticated } =
    useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  return isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
        ]}
      />
      <Presentation user={user} getUser={getUser} />
    </>
  );
};

export default PresentationPage;
