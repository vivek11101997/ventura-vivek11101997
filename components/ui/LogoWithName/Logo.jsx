import React from "react";
import styles from "./logo.module.css";
const Logo = () => {
  return (
    <>
      <div className={styles.logoRight}>
        <img
          src="/images/venturaNewLogo.PNG"
          alt="Ventura Logo"
          className={`animate__animated ${styles.logo}`}
        />
      </div>
    </>
  );
};

export default Logo;
