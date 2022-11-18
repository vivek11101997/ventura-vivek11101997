import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import AxiosInstance from "../../../Api/Axios/axios";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import Header from "../../global/Header.component";
import InputOTP from "../../global/otp/inputOtp";
import ButtonUI from "../../ui/Button.component";
import Loader from "../../ui/Loader/Loader.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";

const LoginWithPin = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);
  // Otp Sent Time Count
  const [OtpCount, setOtpCount] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [user, setUser] = useState();

  // Invalid OTP Msg
  const [isOtpErrorMSgVisible, setIsOtpErrorMSgVisible] = useState(false);
  const { register, setValue, handleSubmit, reset } = useForm();
  const router = useRouter();

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

  const otpArray = ["otpFirst", "otpSecond", "otpThird", "otpFourth"];

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Destructuring All the Input
      const { otpFirst, otpSecond, otpThird, otpFourth } = data;

      // Storing all input in one variable
      const otp = `${otpFirst}${otpSecond}${otpThird}${otpFourth}`;
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
        router.push("/sso/sign-in");
      } else {
        setOtpCount((OtpCount) => OtpCount + 1);
        setIsOtpErrorMSgVisible(true);
        reset();
        setIsLoading(false);
        setIsDisabled(true);
      }
      // Reset The Input Field
      reset();
    } catch (error) {
      // Error IF Something Goes Wrong
      setIsLoading(false);
      setIsDisabled(true);
      setIsOtpErrorMSgVisible(true);
      setOtpCount((OtpCount) => OtpCount + 1);
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
    }
  }, []);

  useEffect(() => {
    // for animation of fields
    document.querySelectorAll(".animate").forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
  }, [isLoading]);
  return (
    <>
      <Header />
      {Error}
      {isLoading && <Loader />}
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="welcomeBack animate">Welcome back, {user && user.fname}</div>
          <div className="setUpPinWrap">
            <h2 className="title animate animate">Enter PIN</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="enterOTP row animate">
                {otpArray &&
                  otpArray.map((item, index) => (
                    <div className="col-3" key={index}>
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
                <div className="col-6 timer" aria-label="Otp Timer"></div>
                <div className="col-6 text-right">
                  <Link href="/sso/forgot-pin">
                    <a
                      className={`btnLInk`}
                      onClick={() => router.push("/sso/forgot-pin")}
                      aria-label="Forgot PIN?"
                    >
                      Forgot PIN?
                    </a>
                  </Link>
                </div>
              </div>
              {isOtpErrorMSgVisible && (
                <div className="otpTimerResend errorMsgOtp  animate">
                  <span className="attempts" aria-label="Invalid OTP">
                    Invalid PIN {OtpCount}/3
                  </span>
                  : Your account will get temporarily blocked after 3 wrong
                  attempts.
                </div>
              )}
              <div className="animate">
                <ButtonUI
                  type={"submit"}
                  id="btn"
                  disabled={isDisabled}
                  ariaLabel="Login"
                >
                  Login
                </ButtonUI>
                <Link className="" href={""}>
                  <a> Switch account </a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithPin);
