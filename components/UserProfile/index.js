import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthContext from "../../context/authContext";
import * as yup from "yup";
import styles from "./styles.module.scss";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import {getUserInfo, updateUserInfo} from "../../client/user";

const UserProfile = ({ user }) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [name, setName] = useState(user?.name || "default-name");
  // useEffect(() => {
  //     const getUser = async () => {
  //         try {
  //             const res = await getUserClient().getUserInfo();
  //             const tmp = await getCharactersClient().getMyChars();

  //             if (tmp?.success) {
  //                 const newRw = mapListToRows(tmp.characters);
  //                 setRows(newRw);
  //             }

  //             setname(res.data.name);
  //         } catch (error) {}
  //     };
  //     getUser();
  // }, []);

  const schema = yup
    .object({
      password: yup.string().required("Mật khẩu không được để trống"),
      newPassword: yup.string().required("Mật khẩu không được để trống"),
      confirmedNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Xác nhận mật khẩu không đúng"),
    })
    .required();
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const handleUpdateUserInfo = async (data) => {
    if (!updateMode) {
        setUpdateMode(true);
    } else {
        const formData = {
            name: data.name,
            password: data.password,
            newPassword: data.newPassword,
        };
        try {
          const res = await updateUserInfo(formData);
          if (res.status === 'OK') {
            toast.success("Update information successfully!");
          }
          else {
            toast.error(res.message);
          }
          setUpdateMode(false);

        }
        catch(error) {
          toast.error(error.response.data.message);
          setUpdateMode(false);

        }
        
    }
  };

  const handleChangeMode = (mode) => {
    setUpdateMode(mode);
  };

  return (
    <div className={styles.wapper}>
      <div className={styles.profile}>
        <Avatar
          className={styles.avatar}
          src="https://th.bing.com/th/id/OIP.JxYNIqDBP3gtzKsxaSHTsgHaHa?pid=ImgDet&rs=1"
          alt=""
        />
        <Box
          className={styles.info}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit((data) =>
              handleUpdateUserInfo(data)
          )}
        >
          <Box>
          <Controller
              name="name"
              defaultValue={name}
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  label="Name"
                  variant="outlined"
                  type="name"
                  disabled={!updateMode}
                  style={{display: "inline-flex" }}
                  {...field}
                />
              )}
            />
              <TextField
              className={styles.infoField}
              id="email"
              label="Email"
              variant="outlined"
              value={user?.email}
              disabled
            />
            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors?.password}
                  helperText={errors?.password?.message}
                  className={styles.infoField}
                  label="Current password"
                  variant="outlined"
                  type="password"
                  autoComplete="current-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="newPassword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  error={!!errors?.newPassword}
                  helperText={errors?.newPassword?.message}
                  label="New password"
                  variant="outlined"
                  type="password"
                  autoComplete="new-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmedNewPassword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  error={!!errors?.confirmedNewPassword}
                  helperText={errors?.confirmedNewPassword?.message}
                  label="Confirm new password"
                  variant="outlined"
                  type="password"
                  autoComplete="confirm-new-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {!updateMode && (
              <Button
                variant="contained"
                className="btnPrimary"
                type="button"
                sx={{ marginRight: "20px" }}
                onClick={() => {
                  handleChangeMode(true);
                }}
              >
                <ModeEditIcon />&nbsp;Edit 
              </Button>
            )}
            {updateMode && (
              <Button
                variant="contained"
                className="btnPrimary"
                type="submit"
                sx={{ marginRight: "20px" }}
              >
                <SaveIcon />&nbsp;Save
              </Button>
            )}
            {updateMode && (
              <Button
                variant="contained"
                className="btnLightPrimiary"
                type="button"
                onClick={() => {
                  handleChangeMode(false);
                }}
              >
               <DisabledByDefaultIcon />&nbsp;Hủy
              </Button>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default UserProfile;
