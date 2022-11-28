import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { activeAccount } from "../../client/auth";

const ActivePage = () => {
  const router = useRouter();
  const { userId = "", activeCode = "" } = router.query;

  const handleActiveAccount = async () => {
    if (userId && activeCode) {
      try {
        const data = { userId, activeCode };
        const res = await activeAccount(data);
        if (res?.status === "OK") {
          toast.success(res?.message);
        }
      } catch (e) {
        toast.error(e?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    handleActiveAccount();
  }, []);

  return <div>Vui lòng kích hoạt tài khoản để sử dụng</div>;
};

export default ActivePage;
