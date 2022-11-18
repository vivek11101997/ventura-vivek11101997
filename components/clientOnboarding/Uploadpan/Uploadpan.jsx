import React, { useState, useEffect } from "react";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import Modal from "../../ui/Modal/Modal.component";
import { connect } from "react-redux";
import styles from "./Uploadpan.module.css";
import UploadpanPop from "../../ui/Popups/UploadPan/UploadpanPop.component";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import AxiosInstance from "../../../Api/Axios/axios";
import Loader from "../../ui/Loader/Loader.component";
import AccessDenied from "../../ui/Popups/Accessdenied/Accessdenied";
import { useRouter } from "next/router";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import KraDataCard from "../KRA/KraDataCard.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { mobileRegister, preview, uploadAadhaar, uploadPan, welcome } from "../../../global/path/redirectPath";

const Uploadpan = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, toggleModal } = props;
  const [uploadScreen, setUploadScreen] = useState(true);
  const [uploadedScreen, setUploadedScreen] = useState(false);
  const [panCardImage, setPanCardImage] = useState(null);
  const [panDocType, setPanDocType] = useState("");
  const [access, setAccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [kraData, setKraData] = useState();
  const [upload, setUpload] = useState(false);
  const [camaccess, setCamaccess] = useState("");
  const [user, setUser] = useState();
  const [redirectTo, setRedirectTo] = useState("");
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
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") &&
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister
      });
    if (localUserData && localUserData !== "") {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      userData && setUser(userData);
    }
    router.beforePopState(() => {
      void router.push(uploadAadhaar);
    });
    if (router.query.hasOwnProperty("redirect")) {
      debugger
      setRedirectTo(router.query.redirect);
    }

    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);

  const getKraData = async () => {
    try {
      setIsLoading(true);
      const getData = await AxiosInstance.post("signup/kra/data/get", {
        phone: user.phone,
        pan: user.panNumber,
        dob: user.dob,
      });
      const resp = await getData.data;
      if (getData.status === 200) {
        setIsLoading(false);
        setKraData(resp);
        setDisabled(false);
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
          redirectTo: uploadAadhaar,
        });
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: uploadPan,
      });
    }
  };

  const pull_data = (data) => {
    if (data.toUpperCase() === "CAMSTATUS") {
      setAccess(true);
      setUpload(false);
    } else {
      const base64Data = data;
      const [, type] = base64Data.split(";")[0].split("/");
      setPanCardImage(base64Data);
      setPanDocType(type);
      props.toggleModal();
      setUploadScreen(false);
      setUploadedScreen(true);
    }
  };

  const pullAccessData = (data) => {
    const dataCase = data.toUpperCase();
    switch (dataCase) {
      case "PERMISSION":
        setAccess(false);
        setUpload(true);
        setCamaccess("PERMISSION");
        break;
      case "UPLOADPHOTO":
        setAccess(false);
        setUpload(true);
        break;
    }
  };

  const PanContinue = async () => {
    setIsLoading(true);
    let PhoneNum = user.phone;
    try {
      const APIData = {
        phone: PhoneNum,
        file: panCardImage,
      };
      const getData = await AxiosInstance.post(
        "signup/user/pan/upload?phone=" + PhoneNum,
        APIData
      );
      if (getData.status === 200) {
        toggleModal();
        setUpload(false);
        if (redirectTo === "P") {
          void router.push(preview);
        } else {
          const object = user;
          object["step"] = 1;
          SetItemToLocalStorage("user", object);
          void router.push(welcome);
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
  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          {uploadScreen && (
            <>
              <h2 className="title animate__animated">Upload PAN card </h2>
              <p className="subTitle animate__animated">
                Click a photo of your PAN card or upload from files.
              </p>
              <div className={`animate__animated ${styles.RememberList}`}>
                <h3 className={styles.ListTitle}>Please remember:</h3>
                <div className={styles.steps}>
                  <div className={styles.stepsIcon}>
                    <span className="icon-Link-your-bank-account"></span>
                  </div>
                  <p className={styles.stepText}>
                    Upload only the front-side of your PAN card.
                  </p>
                </div>
                <div className={styles.steps}>
                  <div className={styles.stepsIcon}>
                    <span className="icon-uploading-photo"></span>
                  </div>
                  <p className={styles.stepText}>
                    Photo size must not exceed 5 MB each.
                  </p>
                </div>
                <div className={styles.steps}>
                  <div className={styles.stepsIcon}>
                    <span className="icon-clear-picture"></span>
                  </div>
                  <p className={styles.stepText}>
                    Photo must be well-lit and glare-free.
                  </p>
                </div>
                <div className={styles.steps}>
                  <div className={styles.stepsIcon}>
                    <img src="/images/clearphoto.svg" alt="Clear Photo" />
                  </div>
                  <p className={styles.stepText}>Photo must be clear.</p>
                </div>
              </div>
              <div className="animate__animated btn-sticky">
                <ButtonUI
                  type={"submit"}
                  ariaLabel={"Continue"}
                  onClick={() => {
                    void getKraData();
                    toggleModal();
                    setUpload(true);
                    setAccess(false);
                  }}
                >
                  Continue
                </ButtonUI>
              </div>
            </>
          )}
          {uploadedScreen && (
            <>
              <h2 className="title animate__animated">Confirm your details</h2>
              <p className="subTitle animate__animated">
                These details are required by SEBI to open your demat account.
              </p>
              <KraDataCard KraData={kraData} />
              <div className={`animate__animated ${styles.uploadBoxWrap}`}>
                <button
                  className={styles.UploadBox}
                  onClick={() => {
                    toggleModal();
                    setUpload(true);
                    setCamaccess("");
                  }}
                >
                  {panDocType.toUpperCase() === "PDF" && (
                    <iframe
                      className={styles.aadhaarImg}
                      src={panCardImage}
                    ></iframe>
                  )}
                  {panDocType.toUpperCase() !== "PDF" && (
                    <img
                      className={styles.aadhaarImg}
                      src={panCardImage}
                      alt="Pan Card Image"
                    />
                  )}
                  <a className={`icon-Edit ${styles.editAadhaar}`}></a>
                </button>
              </div>
              <div className="animate__animated btn-sticky">
                <ButtonUI
                  type={"submit"}
                  ariaLabel={"Continue"}
                  disabled={disabled}
                  onClick={PanContinue}
                >
                  Continue
                </ButtonUI>
              </div>
            </>
          )}
          {showModal && (
            <>
              {upload === true && (
                <Modal ModalType="signature_modal" onClick={toggleModal}>
                  <UploadpanPop func={pull_data} camaccess={camaccess} />
                </Modal>
              )}
              {access === true && (
                <Modal ModalType="panValidation" onClick={toggleModal}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Uploadpan);
