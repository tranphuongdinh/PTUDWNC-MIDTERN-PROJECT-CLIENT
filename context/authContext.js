import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginFunc, loginGoogleFunc, registerFunc } from "../client/auth";
import { getGroupByIds } from "../client/group";
import { getUserInfo } from "../client/user";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const router = useRouter();

  const getUser = async () => {
    try {
      if (localStorage?.getItem("access_token")) {
        setIsLoadingAuth(true);
        const res = await getUserInfo();

        if (res?.status === "OK") {
          const userInfo = res?.data?.[0];

          const groupListRes = await getGroupByIds([...userInfo.myGroupIds, ...userInfo.joinedGroupIds]);

          const groupListMap = {};

          groupListRes.data.forEach((group) => (groupListMap[group?._id] = group));

          userInfo.myGroupIds = userInfo.myGroupIds.map((code) => groupListMap[code]);

          userInfo.joinedGroupIds = userInfo.joinedGroupIds.map((code) => groupListMap[code]);

          setUser({ ...user, ...userInfo });
          setIsAuthenticated(true);
          localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        } else {
          router.push("/login");
        }
      }
      setIsLoadingAuth(false);
    } catch (e) {
      if (e.code === "ERR_BAD_REQUEST") {
        router.push("/active");
      } else {
        router.push("/login");
      }
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    if (!["/login", "/register"].includes(window.location.pathname)) {
      getUser();
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  const login = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginFunc(data);
      if (res?.status === "OK") {
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        window.location.href = "/";
      } else {
        toast.error(res?.message);
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
      if (res?.status === "OK") {
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
      toast.success("Register successful!");
      router.push("/login");
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
        getUser,
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
