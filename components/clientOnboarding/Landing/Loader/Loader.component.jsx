import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.overlay__inner}>
          <div className={styles.overlay__content}>
            <span className={styles.spinner}></span>
          </div>
        </div>
      </div> 
    </>
  );
};

export default Loader;
