import { useRouter } from "next/router";
import React from "react";
import ButtonUI from "../../Button.component";

const SetUpPIN = (props) => {
    const router = useRouter();
    const { redirectUrl } = props;
    return (
      <>
        <div className={"container popupSetPin"}>
          <h1 className={"title"}>Set your PIN </h1>
          <p className={"subTitle"}>Set a PIN to login to your account.</p>
        </div>
        <div className="btnWrap">
            <ButtonUI
            btnType="btn"
            type={"submit"}
            ariaLabel="Continue"
            onClick={() => router.push('/sso/forgot-pin')}
            >
            Continue
            </ButtonUI>
        </div>
      </>
    );
}

export default SetUpPIN