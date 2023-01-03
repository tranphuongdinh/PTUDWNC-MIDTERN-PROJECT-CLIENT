import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PeopleIcon from "@mui/icons-material/People";
import Person2Icon from "@mui/icons-material/Person2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
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
import {
  createInviteLinkGroup,
  getGroupDetail,
  removeFromGroup,
  sendInviteEmail,
  updateRoleInGroup,
  deleteGroupById,
} from "../../../client/group";
import {
  getPresentationDetail,
  addCollaborator,
  removeFromPresentation,
} from "../../../client/presentation";
import { getUserByIds } from "../../../client/user";
import Breadcrumb from "../../../components/Breadcrumb";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../context/authContext";
import { customToast } from "../../../utils";
import styles from "./styles.module.scss";

export default function GroupDetailPage() {
  const [presentation, setPresentation] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const router = useRouter();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
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
    console.log({
      collaboratorEmail: data.memberEmail,
      presentationId: presentation._id,
      userId: presentation.ownerId,
    });
    try {
      const res = await addCollaborator({
        collaboratorEmail: data.memberEmail,
        presentationId: presentation._id,
        userId: presentation.ownerId,
      });

      if (res?.status === "OK") {
        await customToast("SUCCESS", "Inviting collaborate has been sent!");
        setOpenInviteMemberForm(false);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
      setOpenInviteMemberForm(false);
    }
  };

  const getInviteLink = async (collaboratorId) => {
    try {
      const inviteLinkRes = await addCollaborator({
        collaboratorId: collaboratorId,
        presentationId: presentation._id,
        userId: presentation.ownerId,
      });
      if (inviteLinkRes?.status === "OK") {
        alert("invite success");
      }
    } catch (e) {
      return "";
    }
  };

  const getInfoOfGroup = async () => {
    try {
      const res = await getPresentationDetail(router.query.id);
      if (res.status === "OK") {
        console.log(res.data);
        let presentationInfo = res.data[0];

        // const inviteLink = await getInviteLink(presentationInfo?._id);
        // if (inviteLink) setInviteLink(inviteLink);

        const userListRes = await getUserByIds([
          presentationInfo.ownerId,
          ...presentationInfo.collaborators,
        ]);
        const userListMap = {};

        userListRes?.data?.forEach((user) => (userListMap[user?._id] = user));

        presentationInfo = {
          ...presentationInfo,
          owner: userListMap[presentationInfo.ownerId],
        };
        // presentationInfo.collaborators = presentationInfo.collaborators.map(
        //   (id) => userListMap[id]
        // );
        // presentationInfo.coOwners = presentationInfo.coOwnerIds.map((id) => userListMap[id]);
        // presentationInfo.total =
        //   presentationInfo.collaborators.length +  1;
        setPresentation(presentationInfo);
      } else {
        // router.push("/");
      }
    } catch (e) {
      // router.push("/");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInfoOfGroup();
  }, []);

  const handleUpgradeRole = async (member, isUpgrade) => {
    try {
      const data = {
        memberId: member?._id,
        groupId: presentation?._id,
        isUpgrade,
      };
      // await updateRoleInGroup(data);
      await customToast("SUCCESS", "Update role successfully!");
      router.reload();
    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
    }
  };

  const handleRemove = async (member) => {
    try {
      const data = {
        userId: presentation?.ownerId,
        presentationId: presentation?._id,
        collaboratorId: member?._id,
      };
      const res = await removeFromPresentation(data);
      if (res?.status === "OK") {
        await customToast(
          "SUCCESS",
          `Remove member ${member.name} successfully!`
        );
        router.reload();
      } else {
        await customToast("ERROR", e.response?.data?.message);
      }

    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
    }
  };


  return isLoading || isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <Grid container spacing={6} className={styles.wrapper}>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          {
            label: presentation?.name,
            href: `/presentation/${presentation?._id}`,
          },
        ]}
      />
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          ref={anchorElButton}
          onClick={handleClickButton}
          startIcon={<PersonAddIcon />}
        >
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
          <MenuItem
          // onClick={() => {
          //   toast.promise(
          //     async () => {
          //       const newInviteLink = await getInviteLink(presentation?._id);
          //       setInviteLink(newInviteLink);
          //     },
          //     {
          //       pending: "Getting invite link...",
          //       success: "Invite link copied!",
          //       error: "Unexpected error",
          //     }
          //   );
          //   setAnchorElButton(null);
          // }}
          >
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            Copy invite link
          </MenuItem>
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
        <h1 style={{ textAlign: "center" }}>{presentation?.name}</h1>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                {user?._id === presentation?.ownerId && (
                  <TableCell align="center">Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={presentation?.ownerId} className={styles.ownerRow}>
                <TableCell align="center">
                  {presentation?.owner?.name}
                </TableCell>
                <TableCell align="center">
                  {presentation?.owner?.email}
                </TableCell>
                <TableCell align="center">OWNER</TableCell>
               
              </TableRow>

              {presentation?.collaborators?.map((member) => (
                <TableRow key={member?._id} className={styles.memberRow}>
                  <TableCell align="center">{member?.name}</TableCell>
                  <TableCell align="center">{member?.email}</TableCell>
                  <TableCell align="center">COLLABORATOR</TableCell>
                  {user?._id === presentation?.ownerId && (
                    <TableCell align="center">
                      <Tooltip title="Kick this member out">
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(member)}
                        >
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

      <Dialog
        open={openInviteMemberForm}
        onClose={() => setOpenInviteMemberForm(false)}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(handleInviteMember)}>
          <DialogTitle id="alert-dialog-title">
            Invite a member by email
          </DialogTitle>
          <DialogContent style={{ overflowY: "initial" }}>
            <TextField
              label="Member's email"
              placeholder="Enter member's email"
              {...register("memberEmail")}
              type="email"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInviteMemberForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
      >
        <DialogTitle id="alert-dialog-title">
          Please confirm to delete this group
        </DialogTitle>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            // onClick={handleDeleteGroup}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenConfirmDelete(false)}
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
