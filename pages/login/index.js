import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import * as yup from "yup";
import { loginFunc } from "../../client/auth";

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

  const { mutate, isLoading } = useMutation(loginFunc, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.user || "");
      toast.success("Login successful!");
      router.push("/");
    },
    onError: () => toast.error("Invalid email or password!"),
  });

  return (
    <div className="infoBox">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit(mutate)}>
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
        <LoadingButton loading={isLoading} variant="contained" type="submit">
          LOGIN
        </LoadingButton>
      </form>

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
