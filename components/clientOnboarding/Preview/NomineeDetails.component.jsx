import React, { useEffect, useState } from "react";
import styles from "./Preview.module.css";
import NomineeAllocation from "../Nominee/NomineeAllocation.component";

const NomineeDetails = (props) => {
  const [nomineeList, setNomineeList] = useState([]);
  const { PreviewData } = props;

  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
  item.className += " animate__fadeInUp animate__delay_" + index;
});

    if (PreviewData) {
      let list = [];
      PreviewData.nominee_details.map((nomineeData, index) => {
        if (nomineeData.is_nominee_minor.is_nominee_minor) {
          list.push({
            name: PreviewData.nominee_details[index].nominee_name.nominee_name,
            relation:
              PreviewData.nominee_details[index].nominee_relation
                .nominee_relation,
            dob: PreviewData.nominee_details[index].nominee_dob.nominee_dob,
            address:
              PreviewData.nominee_details[index].nominee_address
                .nominee_address,
            identification_type:
              PreviewData.nominee_details[index].nominee_identification_type
                .nominee_identification_type,
            identification_no:
              PreviewData.nominee_details[index].nominee_identification_no
                .nominee_identification_no,
            nominee_minor:
              PreviewData.nominee_details[index].is_nominee_minor
                .is_nominee_minor,
            zipcode:
              PreviewData.nominee_details[index].nominee_zipcode
                .nominee_zipcode,
            nominee_guardian_details: {
              guardian_identification_no:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_identification_no
                  .nominee_guardian_identification_no,
              guardian_dob:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_dob.nominee_guardian_dob,
              guardian_identification_type:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_identification_type
                  .nominee_guardian_identification_type,
              guardian_name:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_name.nominee_guardian_name,
              guardian_address:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_address.nominee_guardian_address,
              guardian_relation:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_relation.nominee_guardian_relation,
              guardian_zipcode:
                PreviewData.nominee_details[index].guardian_details
                  .nominee_guardian_zipcode.nominee_guardian_zipcode,
            },
            nominee_share:
              PreviewData.nominee_details[index].nominee_share.nominee_share,
          });
        } else {
          list.push({
            name: PreviewData.nominee_details[index].nominee_name.nominee_name,
            relation:
              PreviewData.nominee_details[index].nominee_relation
                .nominee_relation,
            dob: PreviewData.nominee_details[index].nominee_dob.nominee_dob,
            address:
              PreviewData.nominee_details[index].nominee_address
                .nominee_address,
            identification_type:
              PreviewData.nominee_details[index].nominee_identification_type
                .nominee_identification_type,
            identification_no:
              PreviewData.nominee_details[index].nominee_identification_no
                .nominee_identification_no,
            nominee_minor:
              PreviewData.nominee_details[index].is_nominee_minor
                .is_nominee_minor,
            zipcode:
              PreviewData.nominee_details[index].nominee_zipcode
                .nominee_zipcode,
            nominee_share:
              PreviewData.nominee_details[index].nominee_share.nominee_share,
          });
        }
      });
      setNomineeList(list);
    }
  }, []);

  return (
    <>
      <section
        className={`animate__animated ${styles.previewWrap} ${styles.fullWidth} ${styles.nomineeDetailsBox}`}
      >
        <h2 className={`animate__animated ${styles.title}`}>Nominee Details</h2>
        <NomineeAllocation nomineeList={nomineeList} redirectTo="P" />
      </section>
    </>
  );
};

export default NomineeDetails;
