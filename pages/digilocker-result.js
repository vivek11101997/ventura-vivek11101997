import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import AxiosInstance from "../Api/Axios/axios";
import ConfirmDetails from "../components/clientOnboarding/EkycProcess/ConfirmDetails.component";
import ErrorModal from "../components/ui/Modal/ErrorModal.component";
import Loader from "../components/ui/Loader/Loader.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../Redux/Landing";
import GetSessionIdFromSessionStorage from "../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../global/localStorage/SetItemToLocalStorage";
import { TOGGLE_MODAL } from "../Redux/modal";
import { kra, kycLanding, mobileRegister } from "../global/path/redirectPath";

let session_ID = "";
const DigilockerResult = (props) => {
  const [sessionId, setSessionId] = useState();
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();
  const [digiLockerData, setDigiLockerData] = useState({});

  const ChangeFormateDate = (oldDate) => {
    return oldDate.toString().split("-").reverse().join("/");
  };

  useEffect(() => {
    const session = GetSessionIdFromSessionStorage("session");
    const localUserData =
      GetUserDataFromLocalStorage("user") ||
      (""(!localUserData || localUserData === "") &&
        props.setError({
          redirectTo: mobileRegister,
          isError: true,
          ErrorMsg: process.env.errorMessage,
          showHide: true,
        }));

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    setUser(userData);
    if (session) {
      setSessionId(session.session_id);
      session_ID = session.session_id;
    }
  }, []);

  useEffect(() => {
    if (sessionId && user) {
      if (
        router.query.hasOwnProperty("error") &&
        router.query.error === "consent_required"
      ) {
        void router.push(kra);
      } else if (
        router.query.hasOwnProperty("error") &&
        router.query.error === "user_cancelled"
      ) {
        void router.push(kycLanding);
      } else {
        user && getAadharCardData();
      }
    }
  }, [sessionId, user]);

  const getAadharCardData = async () => {
    try {
      setLoading(true);
      const getDigilockerData = await AxiosInstance.post(
        "https://kyc-dev.ventura1.com/onboarding/v2/digilocker/web",
        {
          phone: user.phone || parseInt(router.query.state),
          aadhar: router.query.code,
          testing: true,
        }
      );
      const { data, status } = getDigilockerData;

      if (status === 200) {
        setLoading(false);
        setDigiLockerData(data);

        const object = user;
        object["dob"] = ChangeFormateDate(data.dob);
        SetItemToLocalStorage("user", object);
      } else {
        setLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getDigilockerData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      setLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo={kycLanding}
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );

  return (
    <>
      {Error}
      {isLoading && <Loader />}
      {digiLockerData && <ConfirmDetails data={digiLockerData} />}
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DigilockerResult);
