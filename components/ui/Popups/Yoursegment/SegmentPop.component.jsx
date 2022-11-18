import React, { useState, useEffect } from "react";
import Dragdrop from "../../DragDrop/Dragdrop.component";
import Otherupload from "../../Otherupload";
import ButtonUI from "../../Button.component";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from "../../UploadPopup.module.css";
import { connect } from "react-redux";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";
import AxiosInstance from "../../../../Api/Axios/axios";
import { useRouter } from "next/router";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import { mobileRegister, preview, welcome } from "../../../../global/path/redirectPath";
const SegmentPop = (props) => {
  const router = useRouter();
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState("");
  const [image, setImage] = useState(null);
  const [fileSource, setFileSource] = useState("Upload");
  const [doctype, setDocType] = useState("");
  const [user, setUser] = useState();
  const [pdfPassword, setPdfPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const pull_drop = (data, docType, fileName, Encrypt) => {
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
  };
  const ContinuePdf = async () => {
    props.func("showloader");
    let PhoneNum = user.phone;
    let docName = "Demat acct. holding statement";
    let filedata = cropData;
    try {
      const APIData = {
        phone: PhoneNum,
        doc_type: docName,
        password: pdfPassword,
        file: filedata,
      };
      const getData = await AxiosInstance.post(
        `/signup/user/mkt-segment/document/upload`,
        APIData
      );
      const res = await getData.data;
      if (getData.status === 200) {
        if (res.success === false && redirectTo === "P") {
          void router.push(preview);
        }
        if (res.success === false) {
          props.setError({
            isError: true,
            ErrorMsg: res.message,
            showHide: true,
          });
          props.func("hideloader");
        }
        if (res.success === true && redirectTo === "P") {
          void router.push(preview);
        }
        if (res.success === true) {
          let object = user;
          object["step"] = 4;
          SetItemToLocalStorage("user", object);
          void router.push(welcome);
          props.func("hideloader");
        }
      }
    } catch (error) {
      props.func("hideloader");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        props.setError({
          isError: true,
          ErrorMsg: error.response.data.message,
          showHide: true,
        });
      } else {
        props.setError({
          isError: true,
          ErrorMsg: error.message || process.env.errorMessage,
          showHide: true,
        });
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
    checkpassword: "true",
    extensions: [".jpeg", ".jpg", ".png", ".pdf"],
    fileSizeError: "file size should not be greater than 5mb",
    shareEncryptpdf: true,
  };
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") &&
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      });
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }
  }, []);

  return (
    <>
      <>
        {image === null && (
          <div className="SignAdd">
            <div className="textCenter">
              <h2 className="title">Upload document</h2>
              <p className="subTitle">
              Upload a document from files.
              </p>
            </div>
            <Dragdrop func={pull_drop} compInfo={compInfo} />
            <Otherupload compInfo={compInfo} func={pull_drop} />
          </div>
        )}
        {image && doctype.toUpperCase() !== "PDF" && (
          <div className="SignAdd">
            <div className="textCenter">
              <h2 className="title">Document selected</h2>
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
                <h2 className="title">Document selected</h2>
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

            <div className={styles.btnWrap}>
              <ButtonUI
                onClick={ContinuePdf}
                type={"submit"}
                ariaLabel={"Upload"}
              >
                Upload
              </ButtonUI>
            </div>
          </div>
        )}
      </>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SegmentPop);
