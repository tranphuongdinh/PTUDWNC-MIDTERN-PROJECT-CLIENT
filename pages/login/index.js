import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, TextField } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { loginViaGithub } from "../../client/auth";
import { AuthContext } from "../../context/authContext";

const responseGoogle = (response) => {
  console.log(response);
};

function Login() {
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().min(3, "Password must be at least 3 characters long"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const { user, isAuthenticated, login, logout, signup, isLoadingAuth } = useContext(AuthContext);

  return (
    <div className="infoBox">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit(login)}>
        <TextField {...register("email")} style={{ marginBottom: 20 }} placeholder="Email" label="Email" size="small" error={!!errors.email} helperText={errors.email?.message} />

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
        <LoadingButton loading={isLoadingAuth} variant="contained" type="submit">
          LOGIN
        </LoadingButton>
      </form>
      or login via
      <Button onClick={loginViaGithub}>GITHUB</Button>
      <GoogleLogin
        auto_select
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <p>
        Don&apos;t have an account?{" "}
        <Link href="/register" legacyBehavior>
          <a>REGISTER</a>
        </Link>
      </p>
    </div>
  );
}

export default Login;
