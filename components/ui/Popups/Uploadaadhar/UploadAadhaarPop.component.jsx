import React, { useState, useEffect } from "react";
import styles from "../../UploadPopup.module.css";
import Dragdrop from "../../DragDrop/Dragdrop.component";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ButtonUI from "../../Button.component";
import Webcamupload from "../../Webcam/Webcamupload.component";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import Otherupload from "../../Otherupload";
import { connect } from "react-redux";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../../Redux/Landing";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import { mobileRegister } from "../../../../global/path/redirectPath";
const UploadAadhaarPop = (props) => {
  const [ToggleState, setToggleState] = useState(1);
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState("");
  const [cropData, setCropData] = useState("");
  const [doctype, Setdoctype] = useState("");
  const [opencam, Setopencam] = useState(false);
  const [side] = useState(props.cardside);
  const [filesource, Setfilesource] = useState("Upload");

  const toggleTab = (index) => {
    setToggleState(index);
  };
  const pull_data = (data) => {
    if (data.toUpperCase() === "CLOSECAM") {
      Setopencam(false);
    } else {
      const base64Data = data;
      const [, type] = base64Data.split(";")[0].split("/");
      Setdoctype(type);
      setImage(base64Data);
      if (type.toUpperCase() === "PDF") {
        setCropData(base64Data);
      }
    }
  };
  const pull_drop = (data, filetype, fileName, Encrypt) => {
    const base64Data = data;
    const [, type] = base64Data.split(";")[0].split("/");
    Setdoctype(type);
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
  const RestPic = () => {
    setImage(null);
    setCropData("");
    Setopencam(false);
  };
  const SelectCamera = (e) => {
    e.preventDefault();
    if (navigator.mediaDevices.getUserMedia) {
      const successCallback = function () {
        setImage(null);
        setCropData("");
        setToggleState(2);
        Setopencam(true);
        Setfilesource("Camera");
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
    Setopencam(false);
    setToggleState(1);
    setImage(null);
    setCropData("");
    Setfilesource("Upload");
  };
  const UploadPhoto = (e) => {
    e.preventDefault();
    props.func(cropData);
    Setopencam(false);
  };
  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      const successCallback = function () {
        Setopencam(true);
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
    maxSize: "5e+6",
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
      Setopencam(true);
      Setfilesource("Camera");
    }
  }, []);

  useEffect(() => {
    let localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
  }, [ToggleState]);

  return (
    <>
      {image === null && opencam === false && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">Upload document</h2>
            <p className="subTitle">
              Click a photo of your Aadhaar card or upload it from files.
            </p>
          </div>
          <div className={styles.tabwrap}>
            <ul className={styles.tablist}>
              <li
                className={`tabs ${getActiveClass(1, "activetabs")}`}
                aria-label="Upload photo"
                onClick={() => {
                  toggleTab(1);
                  Setfilesource("Upload");
                }}
              >
                Upload photo
              </li>
              <li
                className={`tabs ${getActiveClass(2, "activetabs")}`}
                aria-label="Use camera"
                onClick={() => {
                  toggleTab(2);
                  Setfilesource("Camera");
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
                  aria-label="Open camera"
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
      {opencam && (
        <Webcamupload func={pull_data} cardside={side} journey="Aadhar" />
      )}
      {image && doctype.toUpperCase() !== "PDF" && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">Aadhaar-{side} selected</h2>
            <p className="subTitle">
              Crop the photo to capture the relevant details and remove unwanted
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
            {filesource.toUpperCase() === "UPLOAD" && (
              <h2 className="title">Aadhaar-{side} selected</h2>
            )}
            {filesource.toUpperCase() === "CAMERA" && (
              <h2 className="title">Aadhaar-{side} captured</h2>
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
            {filesource.toUpperCase() === "UPLOAD" && (
              <a
                href=""
                onClick={SelectCamera}
                className={styles.UploadPhoto}
                aria-label="Click a Photo"
              >
                Click a photo
              </a>
            )}
            {filesource.toUpperCase() === "CAMERA" && (
              <a
                href=""
                onClick={SelectFile}
                className={styles.UploadPhoto}
                aria-label="Select From Files"
              >
                Select from files
              </a>
            )}
          </div>
          <div className={styles.btnWrap}>
            <ButtonUI onClick={UploadPhoto} type={"submit"} aria-label="Upload">
              Upload
            </ButtonUI>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    // Error Message For Api Fail
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadAadhaarPop);
