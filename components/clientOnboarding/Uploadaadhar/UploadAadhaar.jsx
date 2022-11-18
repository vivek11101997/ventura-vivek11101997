import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import Modal from "../../ui/Modal/Modal.component";
import { connect } from "react-redux";
import styles from "./Uploadaadhar.module.css";
import UploadAadhaarPop from "../../ui/Popups/Uploadaadhar/UploadAadhaarPop.component";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import AxiosInstance from "../../../Api/Axios/axios";
import Loader from "../../ui/Loader/Loader.component";
import AccessDenied from "../../ui/Popups/Accessdenied/Accessdenied";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { kraDetails, mobileRegister, preview, uploadPan } from "../../../global/path/redirectPath";

const UploadAadhaar = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, toggleModal } = props;
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [aadhaarPic, setAadhaarPic] = useState("");
  const [disableBtn, setDisableBtn] = useState(true);
  const [fDocType, setFDocType] = useState("");
  const [bDocType, setBDocType] = useState("");
  const [disableUploadBtn, setDisableUploadBtn] = useState(true);
  const [access, setAccess] = useState(false);
  const [upload, setUpload] = useState(false);
  const [camAccess, setCamAccess] = useState("");
  const [user, setUser] = useState();
  const [redirectTo, setRedirectTo] = useState("");
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(() => {
      void router.push(kraDetails);
    });
    const localUserData = GetUserDataFromLocalStorage("user") || "";
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
    userData && setUser(userData);
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }

  }, []);


  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo={props.redirectTo}
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );

  const pull_data = (data) => {
    if (data.toUpperCase() === "CAMSTATUS") {
      setAccess(true);
      setUpload(false);
    } else {
      const base64Data = data;
      const [, type] = base64Data.split(";")[0].split("/");
      const side = aadhaarPic.toUpperCase();
      switch (side) {
        case "FRONT":
          setFrontImg(base64Data);
          setDisableBtn(false);
          setFDocType(type);
          setDisableUploadBtn(false);
          break;
        case "BACK":
          setBackImg(base64Data);
          setBDocType(type);
          break;
      }
      props.toggleModal();
    }
  };

  const pullAccessData = (data) => {

    const dataCase = data.toUpperCase();
    switch (dataCase) {
      case "PERMISSION":
        setAccess(false);
        setUpload(true);
        setCamAccess("PERMISSION");
        break;
      case "UPLOADPHOTO":
        setAccess(false);
        setUpload(true);
        break;
    }
  };
  const UploadPhoto = async () => {
    setIsLoading(true);
    let PhoneNum = user.phone;
    
    try {
      const APIData = {
        phone: PhoneNum,
        side: "front",
        file: frontImg,
      };
      const getData = await AxiosInstance.post(
        `/signup/user/aadhar/upload`,
        APIData
      );

      if (getData.status === 200) {

        if (backImg !== null) {
          void backAadhaarUpload();
        } else if (redirectTo === "P") {
          void router.push(preview);
        }
        else {
          setUpload(false);
          toggleModal();
          localStorage.setItem("aadharimg", frontImg);
          void router.push(uploadPan);
        }

      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };
  const backAadhaarUpload = async () => {
    let PhoneNum = user.phone;
    try {
      const APIData = {
        phone: PhoneNum,
        side: "back",
        file: backImg,
      };
      const getData = await AxiosInstance.post(
        `/signup/user/aadhar/upload`,
        APIData
      );
      if (getData.status === 200) {

        if (redirectTo === "P") {
          void router.push(preview);
        } else {
          setUpload(false);
          toggleModal();
          void router.push(uploadPan);
        }
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: getData.error.message,
        showHide: true,
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate__animated">Upload Aadhaar card</h2>
          <p className="subTitle animate__animated">
            Click a photo of your Aadhaar card or upload photos from your
            Gallery.
          </p>
          <div className={`animate__animated ${styles.RememberList}`}>
            <h3 className={styles.ListTitle}>Please remember:</h3>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Link-your-bank-account"></span>
              </div>
              <p className={styles.stepText}>
                Upload both the front and back of your Aadhaar card.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-uploading-photo"></span>
              </div>
              <p className={styles.stepText}>
                Photos must be clear; maximum size limit is 5 MB each.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-clear-picture"></span>
              </div>
              <p className={styles.stepText}>
                Photos must be well-lit and glare-free.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <img src="/images/clearphoto.svg" alt={"Clear Photo"} />
              </div>
              <p className={styles.stepText}>
                If you have an Aadhaar letter, upload a single photo of your
                address and details.
              </p>
            </div>
          </div>
          <div className={`animate__animated ${styles.uploadBoxWrap}`}>
            <button
              aria-label="Upload front"
              className={styles.UploadBox}
              onClick={() => {
                toggleModal();
                setAadhaarPic("front");
                setUpload(true);
                setCamAccess("");
                setAccess(false);
              }}
            >
              {frontImg === null && (
                <>
                  <span className={`icon-Plus ${styles.icon}`}></span>
                  <p className={styles.uploadBoxText}>Upload Front</p>
                </>
              )}
              {frontImg && (
                <>
                  {fDocType.toUpperCase() === "PDF" && (
                    <iframe
                      className={styles.aadhaarImg}
                      src={frontImg}
                    ></iframe>
                  )}
                  {fDocType.toUpperCase() !== "PDF" && (
                    <img
                      className={styles.aadhaarImg}
                      src={frontImg}
                      alt="Aadhaar Image"
                    />
                  )}
                  <a className={`icon-Edit ${styles.editAadhaar}`}></a>
                </>
              )}
            </button>
            <button
              aria-label="Upload back"
              className={styles.UploadBox}
              disabled={disableBtn}
              onClick={() => {
                toggleModal();
                setAadhaarPic("back");
                setCamAccess("");
                setAccess(false);
              }}
            >
              {backImg === null && (
                <>
                  <span className={`icon-Plus ${styles.icon}`}></span>
                  <p className={styles.uploadBoxText}>Upload Back</p>
                </>
              )}
              {backImg && (
                <>
                  {bDocType.toUpperCase() === "PDF" && (
                    <iframe
                      className={styles.aadhaarImg}
                      src={backImg}
                    ></iframe>
                  )}
                  {bDocType.toUpperCase() !== "PDF" && (
                    <img
                      className={styles.aadhaarImg}
                      src={backImg}
                      alt="Aadhaar Image"
                    />
                  )}
                  <a className={`icon-Edit ${styles.editAadhaar}`}></a>
                </>
              )}
            </button>
          </div>
          <div className="animate__animated btn-sticky">
            <ButtonUI
              ariaLabel={"Upload photos"}
              disabled={disableUploadBtn}
              type={"submit"}
              onClick={UploadPhoto}
            >
              Upload photos
            </ButtonUI>
          </div>

          {showModal && (
            <>
              {upload && (
                <Modal
                  ModalType="signature_modal"
                  onClick={toggleModal}
                  aria-label="Toggle Modal"
                >
                  <UploadAadhaarPop
                    func={pull_data}
                    cardside={aadhaarPic}
                    camaccess={camAccess}
                  />
                </Modal>
              )}

              {access && (
                <Modal
                  ModalType="panValidation"
                  onClick={toggleModal}
                  aria-label="Toggle Modal"
                >
                  <AccessDenied func={pullAccessData} />
                </Modal>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
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
export default connect(mapStateToProps, mapDispatchToProps)(UploadAadhaar);
