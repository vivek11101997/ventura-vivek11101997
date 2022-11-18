import React from "react";
import styles from "./Pan.module.css";

const PanCard = ({ panNumber, panName }) => {
  return (
    <>
      <div
        className={`${styles.panCardBox} ${styles.previewPanWrap} animate__animated`}
      >
        <div>
          <div className={`${styles.list} ${styles.panLogo}`}>
            <img src="/images/pan_info_1.png" alt="income tax department" />
            <img src="/images/pan_info_2.png" alt="Govt. of India" />
          </div>
          <div aria-label="Pan Card Name" className={styles.list}>
            <span>Name</span>
            <h4>
          
              {panName}
            </h4>
          </div>
          <div aria-label="Pan Account Number" className={styles.list}>
            <span>Permanent Account Number</span>
            <h4>{panNumber}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanCard;
