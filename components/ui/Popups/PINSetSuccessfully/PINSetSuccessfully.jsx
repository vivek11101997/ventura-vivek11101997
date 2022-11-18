import { useRouter } from "next/router";
import React from "react";

const PINSetSuccessfully = () => {
  const router = useRouter();
  return (
    <>
      <div className={"container popupSetPin"}>
        <span className="icon-successfully"></span>
        <h1 className={"title"}>PIN set successfully </h1>
        <p className={"subTitle"}>Redirecting to dashboard...</p>
      </div>
    </>
  );
};

export default PINSetSuccessfully;
