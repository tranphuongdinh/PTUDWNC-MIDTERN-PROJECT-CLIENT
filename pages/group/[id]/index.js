import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import Person2Icon from "@mui/icons-material/Person2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import { Button, Grid, IconButton, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemIcon from "@mui/material/ListItemIcon";
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
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createInviteLinkGroup, getGroupDetail, removeFromGroup, sendInviteEmail, updateRoleInGroup } from "../../../client/group";
import { getUserByIds } from "../../../client/user";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../context/authContext";
import { sleep } from "../../../utils";
import styles from "./styles.module.scss";

export default function GroupDetailPage() {
  const [group, setGroup] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const router = useRouter();
  const { user, isLoadingAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const [anchorElButton, setAnchorElButton] = React.useState(null);
  const openMenu = Boolean(anchorElButton);
  const handleClickButton = (event) => {
    setAnchorElButton(event.currentTarget);
  };

  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
  });
  const [openInviteMemberForm, setOpenInviteMemberForm] = useState(false);

  const handleInviteMember = async (data) => {
    try {
      const inviteLink = await getInviteLink(group?._id);
      const submitData = {
        email: data.memberEmail,
        ownerName: group?.owner?.name,
        link: inviteLink,
      };

      const res = await sendInviteEmail(submitData);

      if (res?.status === "OK") {
        toast.success("Invite link has been sent!");
      }

      setOpenInviteMemberForm(false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      setOpenInviteMemberForm(false);
    }
  };

  const getInviteLink = async (id) => {
    try {
      const inviteLinkRes = await createInviteLinkGroup({ groupId: id });
      if (inviteLinkRes?.status === "OK") {
        const { code = "", groupId = "" } = inviteLinkRes?.data[0];
        const inviteLink = window.location.origin + "/invite?" + "groupId=" + groupId + "&code=" + code;
        return inviteLink;
      }
    } catch (e) {
      return "";
    }
  };

  const getInfoOfGroup = async () => {
    try {
      const res = await getGroupDetail(router.query.id);
      if (res.status === "OK") {
        const groupInfo = res.data[0];

        const inviteLink = await getInviteLink(groupInfo?._id);
        if (inviteLink) setInviteLink(inviteLink);

        const userListRes = await getUserByIds([groupInfo.ownerId, ...groupInfo.memberIds, ...groupInfo.coOwnerIds]);
        const userListMap = {};

        userListRes?.data?.forEach((user) => (userListMap[user?._id] = user));

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
      const data = { memberId: member?._id, groupId: group?._id, isUpgrade };
      await updateRoleInGroup(data);
      toast.success("Update role successfully!");
      await sleep(1500);
      router.reload();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  const handleRemove = async (member) => {
    try {
      const data = { userId: member?._id, groupId: group?._id };
      await removeFromGroup(data);
      toast.success(`Remove member ${member.name} successfully!`);
      await sleep(1500);
      router.reload();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  return isLoading || isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" ref={anchorElButton} onClick={handleClickButton} startIcon={<PersonAddIcon />}>
          Invite
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorElButton}
          open={openMenu}
          onClose={() => setAnchorElButton(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorPosition="left"
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <CopyToClipboard text={inviteLink}>
            <MenuItem
              onClick={() => {
                toast.promise(
                  async () => {
                    const newInviteLink = await getInviteLink(group?._id);
                    setInviteLink(newInviteLink);
                  },
                  {
                    pending: "Getting invite link...",
                    success: "Invite link copied!",
                    error: "Unexpected error",
                  }
                );
                setAnchorElButton(null);
              }}
            >
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              Copy invite link
            </MenuItem>
          </CopyToClipboard>
          <MenuItem
            onClick={() => {
              setOpenInviteMemberForm(true);
              setAnchorElButton(null);
            }}
          >
            <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            Invite a member
          </MenuItem>
        </Menu>
      </Grid>
      <Grid item xs={12}>
        <h1 style={{ textAlign: "center" }}>{group?.name}</h1>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                {user?._id === group?.ownerId && <TableCell align="center">Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={group?.ownerId} className={styles.ownerRow}>
                <TableCell align="center">{group?.owner?.name}</TableCell>
                <TableCell align="center">{group?.owner?.email}</TableCell>
                <TableCell align="center">OWNER</TableCell>
                {user?._id === group?.ownerId && (
                  <TableCell align="center">
                    <Tooltip title="Add new member">
                      <IconButton onClick={() => setOpenInviteMemberForm(true)}>
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>

              {group?.coOwners?.map((coOwner) => (
                <TableRow key={coOwner?._id} className={styles.coOwnerRow}>
                  <TableCell align="center">{coOwner?.name}</TableCell>
                  <TableCell align="center">{coOwner?.email}</TableCell>
                  <TableCell align="center">CO OWNER</TableCell>
                  {user?._id === group?.ownerId && (
                    <TableCell align="center">
                      <Tooltip title="Become member">
                        <IconButton color="secondary" onClick={() => handleUpgradeRole(coOwner, false)} style={{ marginRight: "10px" }}>
                          <Person2Icon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Kick this co-owner out">
                        <IconButton color="error" onClick={() => handleRemove(coOwner)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {group?.members?.map((member) => (
                <TableRow key={member?._id} className={styles.memberRow}>
                  <TableCell align="center">{member?.name}</TableCell>
                  <TableCell align="center">{member?.email}</TableCell>
                  <TableCell align="center">MEMBER</TableCell>
                  {user?._id === group?.ownerId && (
                    <TableCell align="center">
                      <Tooltip title="Become co-owner">
                        <IconButton color="primary" onClick={() => handleUpgradeRole(member, true)} style={{ marginRight: "10px" }}>
                          <PeopleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Kick this member out">
                        <IconButton color="error" onClick={() => handleRemove(member)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={openInviteMemberForm} onClose={() => setOpenInviteMemberForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleInviteMember)}>
          <DialogTitle id="alert-dialog-title">Invite a member by email</DialogTitle>
          <DialogContent style={{ overflowY: "initial" }}>
            <TextField label="Member's email" placeholder="Enter member's email" {...register("memberEmail")} type="email" required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInviteMemberForm(false)}>Cancel</Button>
            <Button type="submit">Invite</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}
