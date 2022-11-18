import React from "react";
import ButtonUI from "../../Button.component";
import styles from "./Krafailed.module.css";
import { useRouter } from 'next/router'
import { kra } from "../../../../global/path/redirectPath";

const Krafailed = () => {
  const router = useRouter()
  return (
    <div className="textCenter">
      <span className={`icon-Access-denied ${styles.icon}`}></span>
      <h1 className="title">We couldn’t retrieve your details</h1>
      <p className={styles.popSubTitle}>
        Verification via Digilocker or a KRA is required for the online application process. Please contact our support team for further assistance.
      </p>
      <div className={styles.btnWrap}>
        <ButtonUI type={"submit"} onClick={() => router.push(kra)}>
          Re-enter DOB
        </ButtonUI>

      </div>
      <a href="" className={styles.UploadPhoto}>
        Contact us
      </a>
    </div>
  );
}

export default Krafailed