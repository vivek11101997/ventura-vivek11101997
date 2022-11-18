import Link from "next/link";
import React from "react";
import { enterPan } from "../../../../global/path/redirectPath";
import ButtonUI from "../../Button.component";
import Styles from "./PANValidation.module.css";

const InvalidPan = ({
  showModal,
  errorMsg,
  responseType,
  icon,
  buttonText,
  content,
}) => {
  return (
    <div className={Styles.alertContainer}>
      {icon ? (
        icon && responseType === "success" ? (
          <span className="icon-successfully"></span>
        ) : (
          <span className="icon-Access-denied"></span>
        )
      ) : null}
      <h1 className={Styles.alertTitle}>{errorMsg}</h1>
      <p className={Styles.alertSubTitle}>{content}</p>
      <ButtonUI onClick={showModal}>
        <Link href={enterPan}>
          <a>{buttonText}</a>
        </Link>
      </ButtonUI>
    </div>
  );
};

export default InvalidPan;
