import React, { useState } from "react";
import Webcam from "react-webcam";
import styles from "../UploadPopup.module.css";
import ButtonUI from "../Button.component";
const Webcamupload = (props) => {
  const webcamRef = React.useRef(null);
  const [isShowCam, setIsShowCam] = useState(true);
  const journey = props.journey;
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      props.func(imageSrc);
      setIsShowCam(false);
    }
  }, [webcamRef]);
  const videoConstraints = {
    width: 553,
    height: 422,
    facingMode: "environment",
  };
  const [side] = useState(props.cardside);
  const closeCam = (e) => {
    e.preventDefault();
    setIsShowCam(false);
    props.func("closeCam");
  };
  return (
    <>
      {isShowCam && (
        <div className={styles.clickpic}>
          <div className={styles.overlay}>
            <a href="" className={styles.CloseCam} onClick={closeCam} aria-label="Close Camera">
              <span className="icon-Close"></span>
            </a>
            {side && side.toUpperCase() === "FRONT" && (
              <p className={styles.topframetxt}>1/2: Aadhaar {side}</p>
            )}
            {side && side.toUpperCase() === "BACK" && (
              <p className={styles.topframetxt}>2/2: Aadhaar {side}</p>
            )}
            <Webcam
              className={styles.webcam}
              ref={webcamRef}
              audio={false}
              videoConstraints={videoConstraints}
              screenshotFormat="image/jpeg"
            />
            {journey.toUpperCase() === "AADHAR" && (
              <p className={styles.botframetxt}>
                Align {side}-side of your Aadhaar card inside the rectangle and
                click photo
              </p>
            )}
            {journey.toUpperCase() === "PAN" && (
              <p className={styles.botframetxt}>
                Align your PAN card inside the rectangle and click photo
              </p>
            )}
            {journey.toUpperCase() === "BANKDOC" && (
              <p className={styles.botframetxt}>
                Align the {side} inside the rectangle and click photo
              </p>
            )}
            <div className={styles.frame}>
              <img
                className={styles.frameimg}
                src="/images/cameraoverlay.png"
                alt={"Camera"}
              />
            </div>
          </div>
          <div className={styles.btnWrap}>
            <ButtonUI onClick={capture} ariaLabel={"Click photo"}>Click photo</ButtonUI>
          </div>
        </div>
      )}
    </>
  );
};
export default Webcamupload;
