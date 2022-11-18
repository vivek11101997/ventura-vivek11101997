import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import Modal from "../../ui/Modal/Modal.component";
import { connect } from "react-redux";
import styles from "./BankVerificationFailed.module.css";
import BankVerificationFailedPop from "../../ui/Popups/BankVerificationFailed/BankVerificationFailedPop.component";
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
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { addBankAccount, mobileRegister, preview, welcome } from "../../../global/path/redirectPath";
const BankVerificationFailed = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, toggleModal } = props;
  const [docPic, setDocPic] = useState("");
  const [fDoctype, setFDocType] = useState("");
  const [access, setAccess] = useState(false);
  const [Upload, setUpload] = useState(false);
  const [camAccess, setCamAccess] = useState("");
  const [uploadScreen, setUploadScreen] = useState(true);
  const [pdfFileName, setPdfFileName] = useState("");
  const [user, setUser] = useState();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfPassword, setPdfPassword] = useState("");
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
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
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
    userData && router.beforePopState(() => router.push(addBankAccount));


    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }

  }, []);

  const pull_data = (data, fileName, cropData, base64Data) => {
    let dataval = data.toUpperCase();
    switch (dataval) {
      case "CAMSTATUS":
        setAccess(true);
        setUpload(false);
        break;
      case "PDFFILE":
        setUploadScreen(false);
        setFDocType("pdf");
        setPdfFileName(fileName);
        props.toggleModal();
        setPdfBase64(base64Data);
        break;
      case "UPLOADBANKDOC":
        void UploadBankDoc(cropData);
        break;
      default:
    }
  }

  const pull_accessData = (data) => {
    let dataval = data.toUpperCase();
    switch (dataval) {
      case "PERMISSION":
        setAccess(false);
        setUpload(true);
        setCamAccess("PERMISSION");
        break;
      case "UPLOADPHOTO":
        setAccess(false);
        setUpload(true);
        break;
      default:
    }
  };
  const RestPic = () => {
    toggleModal();
    setUploadScreen(true);
    setFDocType("");
  };
  const ContinuePdf = () => {
    void UploadBankDoc(pdfBase64);
  };
  const handleOnClick = (param1) => {
    toggleModal();
    setDocPic(param1);
    setUpload(true);
    setCamAccess("");
    setAccess(false);
  }
  const UploadBankDoc = async (cropData) => {
    setIsLoading(true);
    let PhoneNum = user.phone;
    try {
      const APIData = {
        phone: PhoneNum,
        doc_type: docPic,
        file: cropData,
        password: pdfPassword,
      };

      const getData = await AxiosInstance.post(
        `/signup/user/bank/bankproof/upload`,
        APIData
      );
      const res = await getData.data;
      if (getData.status === 200) {
        setIsLoading(false);
        if (res.success === "false") {
          if (fDoctype.toUpperCase() === "PDF") {
            props.setError({
              isError: true,
              ErrorMsg: res.message,
              showHide: true,
            });
          } else {
            toggleModal();
            setUpload(false);
            setUploadScreen(true);
            props.setError({
              isError: true,
              ErrorMsg: res.message,
              showHide: true,
            });
          }
        }
        else if (res.success === "true") {
          if (redirectTo === "P") {
            props.toggleModal();
            void router.push(preview);
          }
          else {
            setUploadScreen(true);
            setUpload(false);
            setFDocType("");
            props.toggleModal();
            const object = user;
            object["step"] = 3;
            SetItemToLocalStorage("user", object);
            void router.push(welcome);
          }
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
  const fetchAgain = (e) => {
    e.preventDefault();

    let userDataFromLocalStorage = user;
    userDataFromLocalStorage["selected_bank"] = "";
    userDataFromLocalStorage["selected_branch"] = "";
    userDataFromLocalStorage["account_no"] = "";
    userDataFromLocalStorage["ifsc"] = "";
    SetItemToLocalStorage("user", userDataFromLocalStorage);
    void router.push(addBankAccount);
  };

  return (
    <>
      {isLoading === true && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG lavender">
        <div className="containerMini">
          {uploadScreen && (
            <div className="textCenter">
              <div className={`animate__animated ${styles.failedIcon}`}>
                <span className="icon-verification-failed"></span>
              </div>
              <h2 className="title animate__animated">
                Bank verification failed
              </h2>
              <p className="subTitle animate__animated">
                We could not verify your bank account. <br /> This may happen due to
                unresponsive<br /> bank servers.
              </p>
              <div className={`animate__animated ${styles.RememberList}`}>
                <h3 className={styles.ListTitle}>
                  Upload any of these documents
                </h3>
                <p className={styles.ListText}>
                  Upload a single photo or a PDF file.<br /> We will manually verify
                  your bank details.
                </p>

                <div className={`animate__animated ${styles.uploadBoxWrap}`}>
                  <button
                    className={styles.UploadBox}
                    aria-label="Cancelled cheque"
                    onClick={() => handleOnClick("chequeleaf")}
                  >
                    <span className={`icon-Plus ${styles.icon}`}></span>
                    <p className={styles.uploadBoxText}>Cancelled Cheque</p>
                  </button>
                  <button
                    className={styles.UploadBox}
                    aria-label="Bank Statement"
                    onClick={() => handleOnClick("bank statement")}
                  >
                    <span className={`icon-Plus ${styles.icon}`}></span>
                    <p className={styles.uploadBoxText}>Bank Statement</p>
                  </button>
                  <button
                    className={styles.UploadBox}
                    aria-label="Bank Passbook"
                    onClick={() => handleOnClick("bank proof")}
                  >
                    <span className={`icon-Plus ${styles.icon}`}></span>
                    <p className={styles.uploadBoxText}>Bank Passbook</p>
                  </button>
                </div>
              </div>
              <div className={`animate__animated ${styles.lookingDiff}`}>
                <p className={styles.poorPhoto}>
                  Don't have the required documents?
                </p>
                <a
                  href=""
                  aria-label="Fetch Bank Details Again"
                  onClick={fetchAgain}
                  className={styles.UploadPhoto}
                >
                  Fetch bank details again
                </a>
              </div>
            </div>
          )}
          {fDoctype.toUpperCase() === "PDF" && (
            <>
              <h2 className="title animate__animated">Document uploaded</h2>
              <p className="subTitle animate__animated">
                Proceed if you're satisfied with the document quality.
              </p>
              <div className={`animate__animated ${styles.pdfWrap}`}>
                <img src="/images/pdf.png" alt="upload document" />
                <p className={styles.pdfName}>{pdfFileName}</p>
                <button onClick={RestPic} className={styles.resetSignature}>
                  <img src="/images/resetsignature.png" alt="upload document" />
                </button>
              </div>
              <h3 className={`animate__animated ${styles.ListTitle}`}>
                Document password protected?
              </h3>
              <p className={`animate__animated ${styles.ListText}`}>
                Enter password here in case your document is locked.
              </p>
              <div className={`animate__animated ${styles.inputWrap}`}>
                <input
                  className="form-control"
                  onChange={(e) => setPdfPassword(e.target.value)}
                  placeholder="Enter document password"
                />
              </div>
              <ButtonUI
                ariaLabel={"Continue"}
                className="animate__animated"
                type={"submit"}
                onClick={ContinuePdf}
              >
                Continue
              </ButtonUI>
            </>
          )}

          {showModal && (
            <>
              {Upload && (
                <Modal ModalType="signature_modal" onClick={toggleModal}>
                  <BankVerificationFailedPop
                    func={pull_data}
                    cardside={docPic}
                    camaccess={camAccess}
                  />
                </Modal>
              )}

              {access && (
                <Modal ModalType="panValidation" onClick={toggleModal}>
                  <AccessDenied func={pull_accessData} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BankVerificationFailed);
