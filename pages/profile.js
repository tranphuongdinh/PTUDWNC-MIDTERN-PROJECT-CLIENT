import React, { useContext } from "react";
import UserProfile from "../components/UserProfile";
import { AuthContext } from "../context/authContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return <UserProfile user={user} />;
};

export default Profile;
