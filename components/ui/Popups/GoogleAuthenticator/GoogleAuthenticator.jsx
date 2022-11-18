import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ButtonUI from "../../Button.component";

const GoogleAuthenticator = () => {
  const router = useRouter();
  return (
    <>
      <div className={"container popupGoogleAuth"}>
        <h1 className={"title"}>What is an authenticator app?</h1>
        <p className={"subTitle"}>
        Typically used on a smartphone, an authenticator app adds Two-Factor Authentication to the accounts you want to protect. 
        </p>
        
        <p className={"subTitle"}>
        Your authenticator app will generate a 6 digit code that changes every 30 seconds. You can use it to sign in, trade, deposit or withdraw money from your account securely. 
        </p>
        
        <p className={"subTitle"}>
        Authenticator apps are not linked to your SIM card or phone number. It simply enhances security by guarding against SIM switching. 
        </p>
        
        <p className={"subTitle"}>
        Please keep in mind, while this option enhances security due to the 30-second window, it may still be vulnerable to phishing attacks.
        </p>
        <div className="btnWrap">
        <ButtonUI
          btnType="btn"
          type={"submit"}
          ariaLabel="Done"
          onClick={() => router.push("/sso/authenticator-app")}
        >
          Done
        </ButtonUI>
        </div>
      </div>
    </>
  );
};

export default GoogleAuthenticator;
