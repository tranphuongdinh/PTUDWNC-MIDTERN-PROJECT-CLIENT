import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { activeAccount } from "../../client/auth";

const ActivePage = () => {
  const router = useRouter();
  const { userId = "", activeCode = "" } = router.query;

  const [isVerifying, setIsVerifying] = useState(false);

  const handleActiveAccount = async () => {
    if (userId && activeCode) {
      try {
        setIsVerifying(true);
        const data = { userId, activeCode };
        const res = await activeAccount(data);
        if (res?.status === "OK") {
          toast.success(res?.message);
          window.location.href = "/";
        }
        setIsVerifying(false);
      } catch (e) {
        toast.error(e?.response?.data?.message);
        setIsVerifying(false);
      }
    }
  };

  useEffect(() => {
    handleActiveAccount();
  }, []);

  return <div>{isVerifying ? "Please wait while we verify your account..." : "We sent a verification link to your email to verify your email address and activate your account."}</div>;
};

export default ActivePage;
