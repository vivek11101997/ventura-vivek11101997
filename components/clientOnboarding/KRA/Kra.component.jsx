import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import KraDataCard from "./KraDataCard.component";
import style from "./kra.module.css";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import AxiosInstance from "../../../Api/Axios/axios";
import ButtonUI from "../../ui/Button.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import Loader from "../../ui/Loader/Loader.component";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import { kra, mobileRegister, uploadAadhaar } from "../../../global/path/redirectPath";
import Modal from "../../ui/Modal/Modal.component";
import Krafailed from "../../ui/Popups/Krafailed/Krafailed";


const KraComponent = (props) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [kraData, setKraData] = useState({});
  const [sessionId, setSessionId] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    router.beforePopState(() => {
      void router.push(kra);
    });


    const session = GetSessionIdFromSessionStorage("session");
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    if (localUserData === "" || !localUserData) {
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister
      });
    }

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;

    session && setSessionId(session.session_id);
    userData && setUser(userData);
  }, []);

  const getKraData = async () => {
    try {

      setLoading(true);
      const getData = await AxiosInstance.post(`/signup/kra/data/get`, {
        phone: user.phone,
        pan: user.panNumber,
        dob: user.dob,
      });
      setLoading(false);
      if (getData.status === 200) {
        setKraData(getData.data)
      }
      else {
        !props.showModal && props.toggleModal();
      }
    } catch (error) {
      setLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: kra,
      });
    }
  };

  useEffect(() => {
    sessionId && void getKraData();
  }, [sessionId]);

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
          redirectTo={props.redirectTo}
        />
      ) : null}
    </>
  );
  const handalError = () => {
    props.toggleModal();
    router.push(kra);
  }

  const kraErrorModal = (
    <>
      {props.showModal && <Modal
        ModalType="panValidation"
        onClick={() => handalError()}
        aria-label="Toggle Modal"
      >
        <Krafailed />
      </Modal>}</>

  )
  const handelUploadPhotos = () => {
    void router.push(uploadAadhaar);
  };

  return (
    <>
      {Error}
      {kraErrorModal}
      {isLoading && <Loader />}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="animate__animated title">Confirm your details</h2>
          <p className="animate__animated subTitle">
            These details are required by SEBI to open your demat account.
          </p>
          {kraData && <KraDataCard KraData={kraData} />}
          <p className={style.uploadTitle}>Upload PAN and Aadhaar card</p>
          <p className={`${style.kraSubtitle} ${style.uploadSubtitle}`}>
            You can upload your PAN and Aadhaar card photos now or at the end of
            the account opening process.
          </p>
          <div>
            <ul className={style.note}>
              <li>
                Click the photos directly through our app or upload them from
                files.
              </li>
            </ul>
          </div>
          <ButtonUI ariaLabel="Upload Photos" onClick={handelUploadPhotos}>
            Upload Photos
          </ButtonUI>
          <div className={style.skip}></div>
        </div>
      </section>
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
    showModal: state.modalReducer.showModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KraComponent);
