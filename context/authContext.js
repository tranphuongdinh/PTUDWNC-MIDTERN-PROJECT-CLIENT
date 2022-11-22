import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginFunc, loginGoogleFunc, registerFunc } from "../client/auth";
import { getUserInfo } from "../client/user";
import LoadingScreen from "../components/loadingScreen";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const router = useRouter();

  const getUser = async () => {
    setIsLoadingAuth(true);
    const res = await getUserInfo();
    if (res?.code === "OK") {
      setUser(res?.data?.[0]);
      setIsAuthenticated(true);
      localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
    }
    setIsLoadingAuth(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginFunc(data);
      setIsLoadingAuth(false);
      if (res?.code === "OK") {
        setUser(res?.data?.[0]);
        setIsAuthenticated(true);
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Login failed!");
      setIsLoadingAuth(false);
    }
  };

  const loginWithGoogle = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginGoogleFunc(data);
      setIsLoadingAuth(false);
      if (res?.code === "OK") {
        setUser(res?.data?.[0]);
        setIsAuthenticated(true);
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Login failed!");
      setIsLoadingAuth(false);
    }
  };

  const signup = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await registerFunc(data);
      setIsLoadingAuth(false);
      if (res?.code === "OK") {
        toast.success("Register successful!");
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Register failed!");
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        signup,
        isLoadingAuth,
      }}
    >
      {isLoadingAuth ? <LoadingScreen /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
