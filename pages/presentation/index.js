import React, { useContext } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { AuthContext } from "../../context/authContext";
import Presentation from "../../features/Presentation";

const PresentationPage = () => {
  const { user, getUser, isLoadingAuth, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  return isLoadingAuth || !user ? <LoadingScreen /> : <Presentation user={user} getUser={getUser} />;
};

export default PresentationPage;
