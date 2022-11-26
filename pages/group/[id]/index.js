import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { createInviteLinkGroup, getGroupDetail, removeFromGroup, updateRoleInGroup } from "../../../client/group";
import { getUserByIds } from "../../../client/user";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../context/authContext";

export default function GroupDetailPage() {
  const [group, setGroup] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const getInviteLink = async (id) => {
    const inviteLinkRes = await createInviteLinkGroup({ groupId: id });
    if (inviteLinkRes?.status === "OK") {
      const { code = "", groupId = "" } = inviteLinkRes?.data[0];
      const inviteLink = window.location.origin + "/invite?" + "groupId=" + groupId + "&code=" + code;
      setInviteLink(inviteLink);
      toast.success("Invite link copied!");
    } else {
      toast.error("Unexpected error");
    }
  };

  const getInfoOfGroup = async () => {
    try {
      const res = await getGroupDetail(router.query.id);
      if (res.status === "OK") {
        const groupInfo = res.data[0];

        const userListRes = await getUserByIds([groupInfo.ownerId, ...groupInfo.memberIds, ...groupInfo.coOwnerIds]);
        const userListMap = {};

        userListRes?.data?.forEach((user) => (userListMap[user._id] = user));

        groupInfo.owner = userListMap[groupInfo.ownerId];
        groupInfo.members = groupInfo.memberIds.map((id) => userListMap[id]);
        groupInfo.coOwners = groupInfo.coOwnerIds.map((id) => userListMap[id]);
        groupInfo.total = groupInfo.memberIds.length + groupInfo.coOwnerIds.length + 1;
        setGroup(groupInfo);
      } else {
        router.push("/");
      }
    } catch (e) {
      router.push("/");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInfoOfGroup();
  }, []);

  const handleUpgradeRole = async (member, isUpgrade) => {
    try {
      const data = { memberId: member._id, groupId: group._id, isUpgrade };
      await updateRoleInGroup(data);
      toast.success("Update role successfully!");
      router.reload();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  const handleRemove = async (member) => {
    try {
      const data = { userId: member._id, groupId: group._id };
      await removeFromGroup(data);
      toast.success(`Remove member ${member.name} successfully!`);
      router.reload();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Paper>
      <CopyToClipboard text={inviteLink}>
        <Button variant="contained" onClick={() => getInviteLink(group?._id)}>
          Copy invite link
        </Button>
      </CopyToClipboard>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Role</TableCell>
              {user?._id === group?.ownerId && <TableCell align="center">Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={group?.ownerId}>
              <TableCell align="center">{group?.owner.name}</TableCell>
              <TableCell align="center">{group?.owner.email}</TableCell>
              <TableCell align="center">OWNER</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>

            {group?.coOwners?.map((coOwner) => (
              <TableRow key={coOwner._id}>
                <TableCell align="center">{coOwner.name}</TableCell>
                <TableCell align="center">{coOwner.email}</TableCell>
                <TableCell align="center">CO OWNER</TableCell>
                {user?._id === group?.ownerId && (
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => handleUpgradeRole(coOwner, false)}>
                      Become member
                    </Button>

                    <Button variant="contained" onClick={() => handleRemove(coOwner)}>
                      Remove from group
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {group?.members?.map((member) => (
              <TableRow key={member._id}>
                <TableCell align="center">{member.name}</TableCell>
                <TableCell align="center">{member.email}</TableCell>
                <TableCell align="center">MEMBER</TableCell>
                {user?._id === group?.ownerId && (
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => handleUpgradeRole(member, true)}>
                      Become Co-owner
                    </Button>

                    <Button variant="contained" onClick={() => handleRemove(member)}>
                      Remove from group
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
