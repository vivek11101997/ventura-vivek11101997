import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";

import AxiosInstance from "../../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import GetSessionIdFromSessionStorage from "../../../../global/localStorage/GetSessionIdFromSessionStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";

import styles from ".././Landing.module.css";
import ButtonUI from "../../../ui/Button.component";
import Loader from "../../../ui/Loader/Loader.component";
import Logo from "../../../ui/LogoWithName/Logo";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import InputOTP from "../../../global/otp/inputOtp";
import BackGroundImage from "../../../ui/BackgroundLineImage/BackGroundImage.component";
import { emailRegister, mobileRegister, welcome } from "../../../../global/path/redirectPath";

const MailOTP = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  // Otp Counter State
  const [counter, setCounter] = useState(60);

  // Otp Sent Time Count
  const [OtpCount, setOtpCount] = useState(0);

  const [sessionId, setSessionId] = useState("");

  const [user, setUser] = useState();

  const [maskEmail, setMaskEmail] = useState("");
  // Invalid OTP Msg
  const [isOtpErrorMSgVisible, setIsOtpErrorMSgVisible] = useState(false);
  const { register, setValue, handleSubmit, reset } = useForm();

  const router = useRouter();

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

  const otpArray = [
    "otpFirst",
    "otpSecond",
    "otpThird",
    "otpFourth",
    "otpFifth",
    "otpSixth",
  ];
  // Handling THe Form on Submit Using Async Await
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Destructuring All the Input
      const { otpFirst, otpSecond, otpThird, otpFourth, otpFifth, otpSixth } =
        data;

      // Storing all input in one variable
      const otp = `${otpFirst}${otpSecond}${otpThird}${otpFourth}${otpFifth}${otpSixth}`;
      // Sending data to API
      const APIData = {
        email: user.email,
        otp: parseInt(otp),
      };
      const getData = await AxiosInstance.post(
        "/signup/user/email/otp/verify",
        { ...APIData }
      );
      //   receiving response from backend
      if (getData.status === 200) {
        router.push(welcome);
      } else {
        setOtpCount((OtpCount) => OtpCount + 1);
        setIsOtpErrorMSgVisible(true);
        reset();
        setIsLoading(false);
        setIsDisabled(true);
        getData.error &&
          getData.error.message &&
          getData.error.message.includes("maximum attempts") &&
          props.setError({
            isError: true,
            ErrorMsg: getData.error.message,
            showHide: true,
            redirectTo: emailRegister,
          });
      }
      // Reset The Input Field
      reset();
    } catch (error) {
      // Error IF Something Goes Wrong

      setIsLoading(false);
      setIsOtpErrorMSgVisible(true);
      setIsDisabled(true);
      setOtpCount((OtpCount) => OtpCount + 1);
      reset();
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
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
        email: user.email,
      };
      const getData = await AxiosInstance.post("/signup/user/resendotp", {
        ...APIData,
      });
      const response = await getData.data;

      if (getData.status === 200 && response) {
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
      setIsLoading(false);
      setIsDisabled(true);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });

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
    router.beforePopState(() => {
      void router.push(emailRegister);
    });
    // Getting Session From Session Storage
    const session = GetSessionIdFromSessionStorage("session");
    // Getting User Details From Local Storage
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

    session && session.session_id && setSessionId(session.session_id);
    userData && setUser(userData);
    userData.email &&
      userData.email.trim() !== "" &&
      setMaskEmail(userData.email.replace(/[^@\n](?=[^@\n]*?[^\s]{4}@)/g, "x"));

    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);
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

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.signUpBox}>
        <BackGroundImage />
        <Logo />
        {/* OTP Input Form */}
        <img
          src="/images/VenturaLogo.png"
          alt="Ventura Logo"
          className={`animate__animated ${styles.logo} ${styles.logoDesk}`}
        />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="container ">
              <h2 className="title animate__animated">Enter OTP here</h2>
              <p className="subTitle animate__animated">
                We have sent an OTP to your email ID {maskEmail}.
              </p>
              <div className="enterOTP row animate__animated">
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
              <div className="row otpTimerResend animate__animated">
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
                <div className="otpTimerResend errorMsgOtp  animate__animated">
                  <span className="attempts" aria-label="Invalid OTP">
                    Invalid OTP {OtpCount}/3
                  </span>
                  : Your account will get temporarily blocked after 3 wrong
                  attempts.
                </div>
              )}
              <div className="animate__animated">
                <ButtonUI
                  type={"submit"}
                  id="btn"
                  disabled={isDisabled}
                  ariaLabel="Verify OTP"
                >
                  Verify OTP
                </ButtonUI>
              </div>
            </div>
          </form>
        </div>
        {Error}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MailOTP);
