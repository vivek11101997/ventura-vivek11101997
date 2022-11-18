import React from "react";
import KraDataCard from "../KRA/KraDataCard.component";
import styles from "./Preview.module.css";

const AadhaarDetails = (props) => {
  const { PreviewData } = props;
  let kraData;
  if (PreviewData) {
    const address = `${PreviewData.address_details.address_line1.address_line1}${PreviewData.address_details.address_line2.address_line2}${PreviewData.address_details.address_line3.address_line3}`;

    kraData = {
      name: PreviewData.personal_details.name.name,
      dob: PreviewData.personal_details.dob.dob,
      fathers_name:
        PreviewData.personal_details.pan_father_name.pan_father_name,
      permanent_address: address,
      gender: PreviewData.personal_details.gender.gender,
      phone: PreviewData.personal_details.phone_no.phone_no,
    };
  }
  return (
    <>
      <section className={styles.previewWrap}>
        <h2 className={`animate__animated ${styles.title}`}>Aadhaar Details</h2>
        {PreviewData && kraData && <KraDataCard KraData={kraData} />}
      </section>
    </>
  );
};

export default AadhaarDetails;
