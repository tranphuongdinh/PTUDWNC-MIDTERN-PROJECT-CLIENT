import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { inviteToGroup } from "../client/group";
import { AuthContext } from "../context/authContext";

const InvitePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const handleInvite = async (groupId, code) => {
    const res = await inviteToGroup({ groupId, code, userId: user._id });
    if (res?.status === "OK") {
      router.push("/");
    }
  };

  useEffect(() => {
    const { groupId = "", code = "" } = router.query;
    handleInvite(groupId, code);
  }, []);

  return <></>;
};

export default InvitePage;
