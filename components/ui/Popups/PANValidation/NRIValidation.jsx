import Link from "next/link";
import React from "react";
import { enterPan } from "../../../../global/path/redirectPath";

import ButtonUI from "../../Button.component";
import Styles from "./PANValidation.module.css";

const NRIValidation = () => {
  return (
    <div className={Styles.alertContainer}>
      <h1 className={Styles.alertTitle}>NRI demat account</h1>
      <p className={Styles.alertSubTitle}>
        Currently NRI customers can’t open an account online. To know more about
        Ventura’s NRI offerings and policies, please contact our team.
      </p>
      <ButtonUI>
        <Link href={enterPan}>
          <a>Contact Us</a>
        </Link>
      </ButtonUI>
    </div>
  );
};

export default NRIValidation;
