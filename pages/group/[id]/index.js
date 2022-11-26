import { Button, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createInviteLinkGroup, getGroupDetail } from "../../../client/group";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function GroupDetailPage() {
  const [group, setGroup] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const router = useRouter();

  const getInviteLink = async (id) => {
    const inviteLinkRes = await createInviteLinkGroup({ groupId: id });
    const { code = "", groupId = "" } = inviteLinkRes?.data[0];
    const inviteLink = window.location.origin + "/invite?" + "groupId=" + groupId + "&code=" + code;
    setInviteLink(inviteLink);
  };

  const getInfoOfGroup = async () => {
    try {
      const res = await getGroupDetail(router.query.id);
      if (res.status === "OK") {
        const groupInfo = res.data[0];
        setGroup(groupInfo);
      } else {
        router.push("/");
      }
    } catch (e) {
      router.push("/");
    }
  };

  useEffect(() => {
    getInfoOfGroup();
  }, []);

  return (
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
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        //rowsPerPage={rowsPerPage}
        //page={page}
        //onPageChange={handleChangePage}
        //onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
