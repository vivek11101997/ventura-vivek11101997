import { useRouter } from "next/router";
import React from "react";
import ButtonUI from "../../Button.component";

const AccountUnblocked = () => {
  const router = useRouter();
  return (
    <>
      <div className={"container popupAccUnblocked"}>
        <span className="icon-unblocked"></span>
        <h1 className={"title"}>Account unblocked</h1>
        <p className={"subTitle"}>
          Your account has been unblocked, please <br />
          try signing in.
        </p>
        <div className="btnWrap">
          <ButtonUI
            btnType="btn"
            type={"submit"}
            ariaLabel="Enter PIN again"
            onClick={() => router.push("/sso/sign-in")}
          >
            Enter PIN again
          </ButtonUI>
        </div>
      </div>
    </>
  );
};

export default AccountUnblocked;
