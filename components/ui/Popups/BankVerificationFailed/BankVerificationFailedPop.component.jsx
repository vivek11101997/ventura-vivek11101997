import React, { useState, useEffect } from "react";
import styles from "../../UploadPopup.module.css";
import Dragdrop from "../../DragDrop/Dragdrop.component";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ButtonUI from "../../Button.component";
import Webcamupload from "../../Webcam/Webcamupload.component";
import Otherupload from "../../Otherupload";
const BankVerificationFailedPop = (props) => {
  const side = props.cardside;
  const [ToggleState, setToggleState] = useState(1);
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState("");
  const [cropData, setCropData] = useState("");
  const [docType, setDocType] = useState("");
  const [openCam, setOpenCam] = useState(false);
  const [fileSource, setFileSource] = useState("Upload");
  const [SuccessApiRes, SetSuccessApiRes] = useState("");
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas({ width: 1000 }).toDataURL());
      setImage("");
    }
  };
  const RestPic = () => {
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
        setFileSource("Camera", "", "", "");
      };
      const errorCallback = function () {
        props.func("camstatus", "", "", "");
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
  const UploadBankPic = () => {
    props.func("UploadBankDoc", "", cropData, "");
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
        props.func("camstatus", "", "", "");
      };
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
        .then(successCallback, errorCallback);
    }
  };
  const pull_drop = (data,docType,fileName,Encrypt) => {
    if (data.toUpperCase() === "CLOSECAM") {
      setOpenCam(false);
    } else {
      const base64Data = data;
      const [, type] = base64Data.split(";")[0].split("/");
      setDocType(type);
      setImage(base64Data);
      if (type.toUpperCase() === "PDF") {
        if (Encrypt.toUpperCase() === "ENCRYPT") {
          props.func("pdffile", fileName, "", base64Data);
        }
        if (Encrypt.toUpperCase() === "DECRYPT") {
          setCropData(base64Data);
        }
      }
    }
    
  };
  const compInfo = {
    maxSize: "5e+6",
    fileErrorMsg: "File type must be jpeg, png, pdf",
    infoMsg: "Supported files: jpeg, png, pdf",
    filesaccept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "application/pdf": [],
    },
    "checkpassword":"false",
    "extensions" : [".jpeg", ".jpg", ".png", ".pdf"],
    "fileSizeError" : "file size should not be greater than 5mb",
    "shareEncryptpdf":true
  }
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
            <h2 className="title">Upload document</h2>
            <p className="subTitle">
              Add a document for bank verification, maximum size 5 MB.
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
                Upload file
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
                <Dragdrop
                  func={pull_drop}
                  compInfo={compInfo}
                />
                <Otherupload compInfo={compInfo} func={pull_drop} />
              </div>
              <div className={`content ${getActiveClass(2, "active-content")}`}>
                <div className={styles.OpenCam} onClick={startCam}>
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
      {openCam && (
        <Webcamupload func={pull_drop} cardside={side} journey="bankdoc" />
      )}
      {image && docType.toUpperCase() !== "PDF" && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">Bank verification document</h2>
            <p className="subTitle">
              Crop the photo to capture the details and remove unwanted area.
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
              <h2 className="title">Document uploaded</h2>
            )}
            {fileSource.toUpperCase() === "CAMERA" && (
              <h2 className="title">Photo captured</h2>
            )}
            <p className="subTitle">
              Proceed only if the contents of the photo are clearly visible.
            </p>
          </div>
          <div className={styles.SignBox}>
            {docType.toUpperCase() === "PDF" && (
              <iframe className={styles.AadharBoxImg} src={cropData}></iframe>
            )}
            {docType.toUpperCase() !== "PDF" && (
              <img
                className={styles.AadharBoxImg}
                src={cropData}
                alt={"Aadhaar Box"}
              />
            )}
            <button
              onClick={RestPic}
              className={styles.resetSignature}
              aria-label="Reset"
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
              onClick={UploadBankPic}
              type={"submit"}
              ariaLabel={"Upload"}
            >
              Upload
            </ButtonUI>
            <p className="textCenter">{SuccessApiRes}</p>
          </div>
        </div>
      )}
    </>
  );
};
export default BankVerificationFailedPop;
