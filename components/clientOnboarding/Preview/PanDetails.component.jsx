import React from "react";
import styles from "./Preview.module.css";
import PanCard from "../Landing/VerifyPAN/PanCard.component";
const PanDetails = (props) => {
  const { PreviewData } = props;
  return (
    <>
      <section className={`${styles.previewWrap}`}>
        <h2 className={`animate__animated ${styles.title}`}>PAN Details</h2>
        <PanCard
          panNumber={PreviewData.personal_details.pan_no.pan_no}
          panName={PreviewData.personal_details.name.name}
        />

      </section>
    </>
  );
};

export default PanDetails;
