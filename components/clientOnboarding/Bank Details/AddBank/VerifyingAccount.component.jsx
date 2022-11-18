import React from "react";
import { useEffect } from "react";
import styles from "./AddBank.module.css";
import { useRouter } from "next/router";
import { bankAccountAddSuccess } from "../../../../global/path/redirectPath";

const VerifyingAccount = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      void router.push(bankAccountAddSuccess);
    }, 5000);
  });
  return (
    <section className="ContainerBG">
      <div className="containerMini">
        <div className="title">Verifying your account</div>

        <ul className={styles.verifySteps}>
          <li>
            <div className={styles.processed}>
              <span className={`icon-Tick ${styles.icon}`}></span>
            </div>
            <p>Crediting ₹1</p>
          </li>

          <li>
            <div className={styles.processed}>
              <span className={`icon-Tick ${styles.icon}`}></span>
            </div>
            <p>Verifying bank details</p>
          </li>

          <li>
            <div className={styles.processing}>
              <span className={styles.iconProcessing}></span>
            </div>
            <p>Linking your bank account</p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default VerifyingAccount;
