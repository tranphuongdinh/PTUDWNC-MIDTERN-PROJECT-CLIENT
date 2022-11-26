import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../../context/authContext";
import styles from "./styles.module.scss";

function Login() {
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters long"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const {
    user,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    signup,
    isLoadingAuth,
  } = useContext(AuthContext);

  return (
    <div className={styles.wrapper}>
    <div className={styles.loginwrapper}>
        <h1 className={styles.loginTitle}>Welcome back</h1>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(login)} className={styles.form}>
            <TextField
              {...register("email")}
              style={{ marginBottom: 20 }}
              placeholder="Email"
              label="Email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register("password")}
              style={{ marginBottom: 20 }}
              type="password"
              placeholder="Password"
              label="Password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <LoadingButton
              loading={isLoadingAuth}
              variant="contained"
              type="submit"
            >
              LOGIN
            </LoadingButton>
          </form>
          <GoogleLogin
            size="large"
            auto_select
            shape="circle"
            onSuccess={(credentialResponse) =>
              loginWithGoogle({ credential: credentialResponse.credential })
            }
            onError={() => {
              console.log("Login Failed");
            }}
            className={styles.googleLogin}
          />
          <p>
            Don&apos;t have an account?
            <Link href="/register" legacyBehavior>
              <a><b>&nbsp;REGISTER</b></a>
            </Link>
          </p>
        </div>
    </div>
    </div>
  );
}

export default Login;
