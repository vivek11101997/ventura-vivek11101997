import React, { useState, useEffect } from "react";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import styles from "./../Uploadpan/Uploadpan.module.css";
import Loader from "../../ui/Loader/Loader.component";
import { useRouter } from "next/router";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import { connect } from "react-redux";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import AxiosInstance from "../../../Api/Axios/axios";
import Modal from "../../ui/Modal/Modal.component";
import SegmentPop from "../../ui/Popups/Yoursegment/SegmentPop.component";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { mobileRegister, segmentUploadFinancialProof, welcome } from "../../../global/path/redirectPath";
const UploadProof = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const { showModal, toggleModal } = props;
  const [user, setUser] = useState();
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
    const session = GetSessionIdFromSessionStorage("session") || "";
    session && session.session_id && setSessionId(session.session_id);
  }, []);

  useEffect(() => {
    sessionId && void getDocumentList();
  }, [sessionId]);

  const getDocumentList = async () => {
    try {
      setIsLoading(true);
      const getData = await AxiosInstance.get(
        "/signup/user/mkt-segment/document/list"
      );
      const res = await getData.data;
      if (getData.status === 200) {
        setIsLoading(false);
        setDocumentList(res.documents);
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

  const pull_data = (data, fileName, cropData, base64Data) => {
    let dataval = data.toUpperCase();
    switch (dataval) {
      case "SHOWLOADER":
        setIsLoading(true);
        break;
      case "HIDELOADER":
        setIsLoading(false);
        break;
      case "PDFFILE":
        let object = user;
        object["SegmentPdf"] = base64Data;
        object["SegmentPdfName"] = fileName;
        SetItemToLocalStorage("user", object);
        void router.push(segmentUploadFinancialProof);
        toggleModal();
        break;
      default:
    }
  };
  const handleSegment = () => {
    let object = user;
    object["step"] = 4;
    SetItemToLocalStorage("user", object);
    void router.push(welcome);
  };

  const displayDocumentList = documentList.map((item, index) => {
    return (
      <div className={styles.steps} key={index}>
        <div className={styles.stepsIcon}>
          <span className={`icon-${index}`}></span>
        </div>
        <p className={styles.stepText}>{item}</p>
      </div>
    );
  });

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <>
            <h2 className="title animate__animated">Upload financial proof </h2>
            <p className="subTitle animate__animated">
              You can either upload it now or later from your <br /> profile.
            </p>
            <div className={`animate__animated ${styles.RememberList}`}>
              <h3 className={styles.ListTitle}>
                Acceptable documents include:
              </h3>
              {sessionId && displayDocumentList}
            </div>
            <div className="animate__animated btn-sticky">
              <ButtonUI
                type={"submit"}
                ariaLabel={"Continue"}
                onClick={() => {
                  toggleModal();
                }}
              >
                Upload Document
              </ButtonUI>
              <div className="textCenter pt20 animate__animated">
                <a
                  onClick={handleSegment}
                  className="btnLInk"
                  aria-label="Skip For Now"
                >
                  Skip for now
                </a>
              </div>

            </div>
          </>
        </div>
      </section>

      {showModal && (
        <>
          <Modal ModalType="signature_modal" onClick={toggleModal}>
            <SegmentPop func={pull_data} />
          </Modal>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadProof);
