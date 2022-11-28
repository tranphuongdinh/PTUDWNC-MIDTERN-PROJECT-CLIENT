import { useRouter } from "next/router";
import React from "react";

const ActiveCodePage = () => {
  const router = useRouter();
  const { code = "" } = router.query;
  return <div>{code}</div>;
};

export default ActiveCodePage;
