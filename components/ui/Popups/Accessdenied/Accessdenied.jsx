import React,{useS} from "react";
import ButtonUI from "../../Button.component";
import styles from "./Accessdenied.module.css";
const AccessDenied = (props) => { 
  const journey = props.journey;
  const enableAccess = () => {
    if (navigator.mediaDevices.getUserMedia) {
      const successCallback = function () {
        props.func("PERMISSION");
      };
      const errorCallback = function () {};
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
        .then(successCallback, errorCallback);
    }
  };
  const UploadPhoto = (e) => {
    e.preventDefault();
    props.func("UPLOADPHOTO");
  };
  const ShareLink = (e) => {
    e.preventDefault();
    props.func("SHARELINK");
  };
  return (
    <div className="textCenter">
      <span className={`icon-Access-denied ${styles.icon}`}></span>
      <h1 className="title">Access denied</h1>
      <p className={styles.popSubTitle}>
        Access to camera is necessary for the following step.
      </p>
      <div className={styles.btnWrap}>
        <ButtonUI type={"submit"} onClick={enableAccess}>
          Enable access
        </ButtonUI>
      </div>
      {journey && journey.toUpperCase() === "TAKESELFIE" ? (
        <div className={styles.uploadPhotoWrap}>
          <p className={styles.uploadPhotop}>
            Or click a picture from another device
          </p>
          <a href="" className={styles.UploadPhoto} onClick={ShareLink}>
            Share link
          </a>
        </div>
        ):
        (
          <div className={styles.uploadPhotoWrap}>
          <a href="" className={styles.UploadPhoto} onClick={UploadPhoto}>
            Upload photo
          </a>
        </div>
      )}
    </div>
  );
};
export default AccessDenied;
