import { useRouter } from "next/router";
import React from "react";
import ButtonUI from "../../Button.component";

const SetPin = (props) => {
  const router = useRouter();
  const { redirectUrl } = props;
  // commented this code for redirection purpose
  // setTimeout(() => {
  //   void router.push(redirectUrl);
  // }, 3000);
  return (
    <>
      <div className={"container"}>
        <span className="icon-successfully"></span>
        <h1 className={"title"}>PIN set successfully </h1>
        <p className={"subTitle"}>Redirecting to dashboard...</p>
      </div>
    </>
  );
};

export default SetPin;
