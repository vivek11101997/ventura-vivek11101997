import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";

import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../../components/global/Header.component";
import styles from "./enterOTP.module.css";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";

import ButtonUI from "../../ui/Button.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import InputOTP from "../../global/otp/inputOtp";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import Loader from "../../ui/Loader/Loader.component";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import Modal from "../../ui/Modal/Modal.component";
import BlockBrowser from "../../ui/Popups/BlockBrowser/BlockBrowser";
import SetYourPIN from "../../ui/Popups/SetYourPIN/SetYourPIN";

const EnterOTPComp = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  // Otp Counter State
  const [counter, setCounter] = useState(60);
  const [blockParameter, setBlockParameter] = useState({});

  // Otp Sent Time Count
  const [otpCount, setOtpCount] = useState(0);
  const [browserBlockCount, setBrowserBlockCount] = useState(0);

  const [sessionId, setSessionId] = useState("");

  const [user, setUser] = useState();
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [showPinNotSetModal, setShowPinNotSetModal] = useState(false);

  // Invalid OTP Msg
  const [isOtpErrorMSgVisible, setIsOtpErrorMSgVisible] = useState(false);
  const { register, setValue, handleSubmit, reset } = useForm();

  const router = useRouter();

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

  const otpArray = [
    "otpFirst",
    "otpSecond",
    "otpThird",
    "otpFourth",
    "otpFifth",
    "otpSixth",
  ];
  const handleBlockBrowserModal = () => {
    void router.push("/sso/sign-in");
    setShowBrowserModal(false);
  };
  const handleSetPinModal = () => {
    router.push("/sso/set-up-pin");
    setShowPinNotSetModal(false);
  };

  // Generating OTP for new user FALSE
  const generateOTP = async (res) => {
    try {
      setIsLoading(true);
      let data = {
        client_id: res.client_id,
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN,
      };
      const generate = await AxiosInstance.post(`/v3/sendotp`, data);
      if (generate.status === 200) {
        setIsLoading(false);

        let object = user;
        object["otpMessage"] = generate.data.message;
        SetItemToLocalStorage("userDetails", object);
        setCounter(60);
      } else {
        setIsLoading(false);
        setIsDisabled(true);
        props.setError({
          isError: true,
          ErrorMsg: generate.error.message,
          showHide: true,
          redirectTo: "/sso/enter-pan",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setIsDisabled(true);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: "/sso/enter-pan",
      });
    }
  };

  const blockBrowser = (count) => {
    let object = user;
    if (user  && count  === 0) {
      setBrowserBlockCount(user.browserBlockedCount + 1);
      object["browserBlockedCount"] = ++browserBlockCount;

      SetItemToLocalStorage("userDetails", object);
     
      let browseBlockObject;
      switch (browserBlockCount) {
        case 0:
          browseBlockObject = {
            blockTiming: "15 mins",
            blockCount: "",
            warning: false,
            timer: 15,
          };
          break;
        case 1:
          browseBlockObject = {
            blockTiming: "30 mins",
            blockCount: "2nd Block,",
            warning: true,
            timer: 30,
          };
          break;
        case 2:
          browseBlockObject = {
            blockTiming: "one hour",
            blockCount: "3rd Block",
            warning: false,
            timer: 60,
          };
          break;
      }
      setBlockParameter(browseBlockObject);
    
      setShowBrowserModal(true);
    }
  };

  // Handling THe Form on Submit Using Async Await
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let object = user;

      // Destructuring All the Input
      const { otpFirst, otpSecond, otpThird, otpFourth, otpFifth, otpSixth } =
        data;

      // Storing all input in one variable
      const otp = `${otpFirst}${otpSecond}${otpThird}${otpFourth}${otpFifth}${otpSixth}`;
      // Sending data to API
      const APIData = {
        client_id: user.client_id,
        otp: parseInt(otp),
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN,
      };
      const getData = await AxiosInstance.post(`/v3/validateotp`, APIData);
      //   receiving response from backend
      const res = await getData.data;

      if (getData.status === 200 && res) {
        object["auth_expiry"] = res.auth_expiry;
        object["auth_token"] = res.auth_token;
        object["refresh_expiry"] = res.refresh_expiry;
        object["refresh_token"] = res.refresh_token;
        SetItemToLocalStorage("userDetails", object);
        if (user && user.newuser === true) {
          setIsLoading(false);
          setIsDisabled(true);
          setShowPinNotSetModal(true);
        } else {
          user && user.journey === "forgotpin"
            ? void router.push("/sso/set-new-pin")
            : void router.push("/sso/enter-pin");
        }
      } else {
        SetItemToLocalStorage("userDetails", object);
        getData.error &&
        getData.error.message &&
        getData.error.message.attempts_left &&
        setOtpCount(getData.error.message.attempts_left);
        blockBrowser(getData.error.message.attempts_left);
        setIsOtpErrorMSgVisible(true);
        reset();
        setIsLoading(false);
        setIsDisabled(true);
        
        getData.error &&
          getData.error.message &&
          getData.error.message.message&& 
          getData.error.message.message.includes("maximum attempts") &&
          props.setError({
            isError: true,
            ErrorMsg: getData.error.message.message,
            showHide: true,
            redirectTo: user.newuser === true ? "/sso/enter-pan" : "/sso/sign-in" ,
          });
      }
      // Reset The Input Field
      reset();
    } catch (error) {
      // Error IF Something Goes Wrong
      setIsLoading(false);
      setIsDisabled(true);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: "/sso/enter-pan",
      });
      setIsOtpErrorMSgVisible(true);
      setIsDisabled(true);

      blockBrowser(otpCount + 1);

        setOtpCount((count)=>count-1);
      reset();
    }
  };
  // Resend Otp Functionality
  const resendOtp = async () => {
    try {
      reset();
      setCounter(60);
      setIsLoading(true);
      setIsDisabled(true);
      const APIData = {
        client_id: user.client_id,
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN,
      };
      const getData = await AxiosInstance.post(`/v3/resendotp`, APIData);
      const response = await getData.data;

      if (getData.status === 200 && response) {
        blockBrowser(response.attempts_left);
        setOtpCount(response.attempts_left);

        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsDisabled(true);

        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
      reset();
    } catch (error) {
      setIsDisabled(true);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });

      setIsLoading(false);

      reset();
    }
  };
  const checkValue = () => {
    let inputs = document.querySelectorAll("input");
    const validInputs = Array.from(inputs).filter(
      (input) => input.value !== ""
    );
    validInputs.length === otpArray.length
      ? setIsDisabled(false)
      : setIsDisabled(true);
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        // Submit Form On Enter
        handleSubmit(onSubmit)();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [sessionId]);
  useEffect(() => {
    const newUserDetails = GetUserDataFromLocalStorage("userDetails");
    const session = GetSessionIdFromSessionStorage("ssoSessionId");
    session && session.session_id && setSessionId(session.session_id);
    if (newUserDetails) {
      const userData =
        typeof newUserDetails === "string"
          ? JSON.parse(newUserDetails)
          : newUserDetails;
      userData && setUser(userData);
      userData && userData.browserBlockedCount > 1 && blockBrowser(3);
    }
  }, []);
  useEffect(() => {
    user && generateOTP(user);
  }, [user]);
  
  useEffect(() => {
    // for animation of fields
    document.querySelectorAll(".animate").forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
  }, [isLoading]);
  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <div className="ContainerBG">
        <div className="containerMini">
          <div className="container">
            <div className="welcomeBack animate">
              Welcome back, {user && user.fname}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="title  animate">Enter OTP</h2>
              <p className="subTitle  animate">
                {user && user.otpMessage}
              </p>
              <div className="enterOTP row animate">
                {otpArray &&
                  otpArray.map((item, index) => (
                    <div className="col-2" key={index}>
                      <InputOTP
                        id={item}
                        checkValue={checkValue}
                        otpArray={otpArray}
                        register={register}
                        setValue={setValue}
                      />
                    </div>
                  ))}
              </div>
              <div className="row otpTimerResend animate">
                <div className="col-6 timer" aria-label="Otp Timer">
                  {counter === 0 ? null : <>00:{counter}s</>}
                </div>
                <div className="col-6 text-right">
                  <Link href="">
                    <a
                      className={`btnLInk ${counter !== 0 && "disabled"}`}
                      onClick={resendOtp}
                      aria-label="Resend OTP"
                    >
                      Resend OTP
                    </a>
                  </Link>
                </div>
              </div>
              {isOtpErrorMSgVisible && (
                <div className="otpTimerResend errorMsgOtp  animate">
                  <span className="attempts" aria-label="Invalid OTP">
                    Invalid OTP {otpCount}/3
                  </span>
                  : Ventura access on this browser will get temporarily blocked after 3 wrong attempts
                </div>
              )}
              <div className="animate">
                <ButtonUI
                  type={"submit"}
                  id="btn"
                  disabled={isDisabled}
                  ariaLabel="Verify OTP"
                >
                  Verify
                </ButtonUI>
              </div>
            </form>
            {user && user.google_auth_enabled && (
              <>
                <div className={`animate or`}>OR</div>
                <div className="animate">
                  <ButtonUI
                    btnType="btn btn-outline"
                    type={"submit"}
                    ariaLabel="Use authenticator code"
                    onClick={() => router.push("/sso/enter-authenticator")}
                  >
                    Use authenticator code
                  </ButtonUI>
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={`animate bottomLabelInfo ${styles.bottomTextWrap}`}
        >
          <p className={`${styles.txtInfo}`}>Need help with verification?</p>
          <a
            className={`${styles.txtLink}`}
            href=""
            aria-label="Contact support"
          >
            Contact support
          </a>
        </div>

        {Error}
        {showBrowserModal && browserBlockCount > 0 && (
          <Modal onClick={handleBlockBrowserModal}>
            <BlockBrowser param={blockParameter} />
          </Modal>
        )}
        {showPinNotSetModal && (
          <Modal onClick={handleSetPinModal}>
            <SetYourPIN />
          </Modal>
        )}
      </div>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnterOTPComp);
