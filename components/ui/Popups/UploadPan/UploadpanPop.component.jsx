import React, { useState, useEffect } from "react";
import styles from "../../UploadPopup.module.css";
import Dragdrop from "../../DragDrop/Dragdrop.component";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ButtonUI from "../../Button.component";
import Webcamupload from "../../Webcam/Webcamupload.component";
import Otherupload from "../../Otherupload";

const UploadpanPop = (props) => {
  const side = props.cardside || "";
  const [ToggleState, setToggleState] = useState(1);
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState("");
  const [cropData, setCropData] = useState("");
  const [doctype, setDocType] = useState("");
  const [openCam, setOpenCam] = useState(false);
  const [fileSource, setFileSource] = useState("Upload");
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const pull_data = (data) => {
    if (data.toUpperCase() === "CLOSECAM") {
      setOpenCam(false);
    } else {
      const base64Data = data;
      const [, type] = base64Data.split(";")[0].split("/");
      setDocType(type);
      setImage(base64Data);
      if (type.toUpperCase() === "PDF") {
        setCropData(base64Data);
      }
    }
  };

  const pull_drop = (data, filetype, fileName,Encrypt) => {
     
    const base64Data = data;
    const [, type] = base64Data.split(";")[0].split("/");
    setDocType(type);
    setImage(base64Data);
    if (type.toUpperCase() === "PDF") {
      setCropData(base64Data);
    }
  };
  
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas({ width: 1000 }).toDataURL());
      setImage("");
    }
  };
  const restPic = () => {
    setImage(null);
    setCropData("");
    setOpenCam(false);
  };
  const SelectCamera = (e) => {
    e.preventDefault();
    if (navigator.mediaDevices.getUserMedia) {
      const successCallback = function () {
        setImage(null);
        setCropData("");
        setToggleState(2);
        setOpenCam(true);
        setFileSource("Camera");
      };
      const errorCallback = function () {
        props.func("camstatus");
      };
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
        .then(successCallback, errorCallback);
    }
  };

  const SelectFile = (e) => {
    e.preventDefault();
    setOpenCam(false);
    setToggleState(1);
    setImage(null);
    setCropData("");
    setFileSource("Upload");
  };
  const UploadPhoto = (e) => {
    e.preventDefault();
    props.func(cropData);
    setOpenCam(false);
  };
  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";

  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      const successCallback = function () {
        setOpenCam(true);
      };
      const errorCallback = function () {
        props.func("camstatus");
      };
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
        .then(successCallback, errorCallback);
    }
  };

  const compInfo = {
    maxSize: "5e+6", // max file size 5 mb
    fileErrorMsg: "File type must be jpeg, png, pdf",
    infoMsg: "Supported files: jpeg, png, pdf",
    filesaccept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "application/pdf": [],
    },
    checkpassword: "true",
    extensions: [".jpeg", ".jpg", ".png", ".pdf"],
    fileSizeError: "file size should not be greater than 5mb",
  };
  useEffect(() => {
    const CamPermission = props.camaccess;
    if (CamPermission.toUpperCase() === "PERMISSION") {
      setOpenCam(true);
      setFileSource("Camera");
    }
  }, []);

  return (
    <>
      {image === null && openCam === false && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">Upload document {side}</h2>
            <p className="subTitle">
              Click a photo of your PAN card or upload from files.
            </p>
          </div>
          <div className={styles.tabwrap}>
            <ul className={styles.tablist}>
              <li
                className={`tabs ${getActiveClass(1, "activetabs")}`}
                aria-label="Upload Photo"
                onClick={() => {
                  toggleTab(1);
                  setFileSource("Upload");
                }}
              >
                Upload photo
              </li>
              <li
                className={`tabs ${getActiveClass(2, "activetabs")}`}
                aria-label="Use Camera"
                onClick={() => {
                  toggleTab(2);
                  setFileSource("Camera");
                }}
              >
                Use camera
              </li>
            </ul>

            <div className="tabcontainer">
              <div className={`content ${getActiveClass(1, "active-content")}`}>
                <Dragdrop func={pull_data} compInfo={compInfo} />
                <Otherupload compInfo={compInfo} func={pull_drop} />
              </div>
              <div className={`content ${getActiveClass(2, "active-content")}`}>
                <div
                  className={styles.OpenCam}
                  onClick={startCam}
                  aria-label="Open Camera"
                >
                  <div className={styles.camicon}>
                    <span className="icon-camera"></span>
                  </div>
                  <p className={styles.btntext}>Open camera</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {openCam && <Webcamupload func={pull_data} journey="Pan" />}
      {image && doctype.toUpperCase() !== "PDF" && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">PAN card selected</h2>
            <p className="subTitle">
              Crop the photo to capture relevant details and remove unwanted
              area.
            </p>
          </div>
          <Cropper
            style={{ height: 302, width: "100%", background: "white" }}
            zoomTo={0}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            guides={true}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
          <div className={styles.btnWrap}>
            <ButtonUI
              onClick={getCropData}
              type={"submit"}
              ariaLabel={"Continue"}
            >
              Continue
            </ButtonUI>
          </div>
        </div>
      )}
      {cropData && (
        <div className="SignAdd">
          <div className="textCenter">
            {fileSource.toUpperCase() === "UPLOAD" && (
              <h2 className="title">PAN card selected</h2>
            )}
            {fileSource.toUpperCase() === "CAMERA" && (
              <h2 className="title">PAN card captured</h2>
            )}
            <p className="subTitle">
              Proceed only if the contents of the photo are clearly visible.
            </p>
          </div>
          <div className={styles.SignBox}>
            {doctype.toUpperCase() === "PDF" && (
              <iframe className={styles.AadharBoxImg} src={cropData}></iframe>
            )}
            {doctype.toUpperCase() !== "PDF" && (
              <img
                className={styles.AadharBoxImg}
                src={cropData}
                alt={"Pan Box"}
              />
            )}
            <button
              onClick={restPic}
              aria-label="Reset"
              className={styles.resetSignature}
            >
              <img src="/images/resetsignature.png" alt={"Reset"} />
            </button>
          </div>
          <div className={styles.lookingDiff}>
            <p className={styles.poorPhoto}>Poor photo quality?</p>
            {fileSource.toUpperCase() === "UPLOAD" && (
              <a
                href=""
                aria-label="Click A Photo"
                onClick={SelectCamera}
                className={styles.UploadPhoto}
              >
                Click a photo
              </a>
            )}
            {fileSource.toUpperCase() === "CAMERA" && (
              <a
                href=""
                aria-label="Select From Files"
                onClick={SelectFile}
                className={styles.UploadPhoto}
              >
                Select from files
              </a>
            )}
          </div>
          <div className={styles.btnWrap}>
            <ButtonUI
              onClick={UploadPhoto}
              type={"submit"}
              ariaLabel={"Upload"}
            >
              Upload
            </ButtonUI>
          </div>
        </div>
      )}
    </>
  );
};
export default UploadpanPop;
