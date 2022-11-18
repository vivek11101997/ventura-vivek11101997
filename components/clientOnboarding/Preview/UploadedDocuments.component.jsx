import React from "react";
import styles from "./Preview.module.css";
import { useRouter } from "next/router";
import { bankVerifyAccountFailed, signature, takeSelfie, uploadAadhaar, uploadPan } from "../../../global/path/redirectPath";
const UploadedDocuments = (props) => {
  const router = useRouter();
  const { PreviewData } = props;
  const documentPath = PreviewData.document_details;
  let documents;
  if (documentPath) {
    documents = [
      {
        name: "selfie",
        imgSrc: documentPath.live_photo_s3_link.live_photo_s3_link,
        redirectTo: `${takeSelfie}?redirect=P`,
      },
      {
        name: "sign",
        imgSrc: documentPath.signature_s3_link.signature_s3_link,
        redirectTo: `${signature}?redirect=P`,
      },
      {
        name: "aadhar_front",
        imgSrc: documentPath.aadhar_s3_link.aadhar_s3_link,
        redirectTo: `${uploadAadhaar}?redirect=P`,
      },
      {
        name: "aadhar_back",
        imgSrc: documentPath.aadhar_back_s3_link.aadhar_back_s3_link,
        redirectTo: `${uploadAadhaar}?redirect=P`,
      },
      {
        name: "pan",
        imgSrc: documentPath.pan_s3_link.pan_s3_link,
        redirectTo: `${uploadPan}?redirect=P`,
      },
      {
        name: "cheque",
        imgSrc: documentPath.cheque_s3_link.cheque_s3_link,
        redirectTo: `${bankVerifyAccountFailed}?redirect=P`,
      },
    ];
  }

  return (
    <>
      <section className={`${styles.previewWrap} ${styles.fullWidth}`}>
        <h2 className={`animate__animated ${styles.title}`}>
          Uploaded Details
        </h2>

        <div className={`${styles.upDocListWrap}`}>
          {documents.map((doc, index) => (
            <div key={index} className={`${styles.upDocList}`}>
              {doc.imgSrc && (
                <div key={doc.name} >
                  <img src={doc.imgSrc} alt={doc.name} />
                  <button
                    onClick={() => router.push(doc.redirectTo)}
                    className={styles.btnEdit}
                  >
                    <span className="icon-Edit"></span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default UploadedDocuments;
