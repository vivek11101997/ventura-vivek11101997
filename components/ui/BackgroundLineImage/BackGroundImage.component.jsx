import React from "react";
import styles from "./Background.module.css";

const BackGroundImage = () => {
  return (
    <>
      <img
        className={styles.lineBg}
        src="/images/lineBg.png"
        alt="Background Lines Image Top Right"
      />
      <img
        className={styles.lineBgBottom}
        src="/images/cardLinesBottom.png"
        alt="Background Lines Image Bottom Left"
      />
    </>
  );
};

export default BackGroundImage;
