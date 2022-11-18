import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import { connect } from "react-redux";
import styles from "./../BankVerificationFailed/BankVerificationFailed.module.css";
import AxiosInstance from "../../../Api/Axios/axios";
import Loader from "../../ui/Loader/Loader.component";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { mobileRegister, segmentUploadProof, welcome } from "../../../global/path/redirectPath";

const UploadFinancialProof = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [user, setUser] = useState();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfPassword, setPdfPassword] = useState("");
  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo=""
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );
  const RestPic = () => {
    void router.push(segmentUploadProof);
  };
  const ContinuePdf = async () => {
    setIsLoading(true);
    let PhoneNum = user.phone;
    let docName = "Demat acct. holding statement";
    try {
      const APIData = {
        phone: PhoneNum,
        doc_type: docName,
        password: pdfPassword,
        file: pdfBase64,
      };
      const getData = await AxiosInstance.post(
        `/signup/user/mkt-segment/document/upload`,
        APIData
      );
      const res = await getData.data;
      if (getData.status === 200) {
        if (res.success === false) {
          props.setError({
            isError: true,
            ErrorMsg: res.message,
            showHide: true,
          });
        }
        if (res.success === true) {
          let object = user;
          object["step"] = 4;
          SetItemToLocalStorage("user", object);
          void router.push(welcome);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false)
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
    setPdfFileName(userData.SegmentPdfName);
    setPdfBase64(userData.SegmentPdf);
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <>
            <h2 className="title animate__animated">
              Financial proof uploaded
            </h2>
            <p className="subTitle animate__animated">
              Proceed if you're satisfied with the document quality.
            </p>
            <div className={`animate__animated ${styles.pdfWrap}`}>
              <img src="/images/pdf.png" alt="PDF icon" />
              <p className={styles.pdfName}>{pdfFileName}</p>
              <button
                onClick={RestPic}
                aria-label="Reset"
                className={styles.resetSignature}
              >
                <img src="/images/resetsignature.png" alt="Reset" />
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
                aria-label="Enter Document Password"
                onChange={(e) => setPdfPassword(e.target.value)}
                placeholder="Enter document password"
              />
            </div>
            <ButtonUI
              className="animate__animated"
              type={"submit"}
              ariaLabel={"Continue"}
              onClick={ContinuePdf}
            >
              Continue
            </ButtonUI>
          </>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    showError: state.LandingReducer.error.showHide,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFinancialProof);
