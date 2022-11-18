import React from "react";
import styles from "./Preview.module.css";
import { useRouter } from 'next/router'
import { yourSegment } from "../../../global/path/redirectPath";
const Segment = (props) => {
  const router = useRouter()
  const {
    PreviewData: { segment_details },
  } = props;


  const handelEdit = () => {
    router.push(`${yourSegment}?redirect=P`)
  }

  return (
    <>
      <section
        className={`animate__animated ${styles.previewWrap} ${styles.fullWidth}`}
      >

        <h2 className={`animate__animated ${styles.title}`}>Segments</h2>
        <button
          aria-label="Edit"
          onClick={handelEdit}
          className={`${styles.btn}`}
        >
          Edit
          <span className={`icon-Arrow ${styles.editArrow}`}></span>
        </button>
        {Object.keys(segment_details).map((segment, index) => (
          <div
            key={index}
            className={`animate__animated checkBox ${styles.chkSegment} ${styles.typeEquity}`}
          >
            <div className={styles.iconWrap}>
              <span className={`icon-preview-segment-${index}`}></span>
            </div>
            <span className={styles.title}>{segment}</span>
          </div>
        ))}
      </section>
    </>
  );
};

export default Segment;
