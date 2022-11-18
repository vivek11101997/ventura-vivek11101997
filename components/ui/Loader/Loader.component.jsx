import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.overlay__inner}>
          <div className={styles.overlay__content}>
            <img src="/images/loader.gif" className={styles.loadingImg} alt="Loading Image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
