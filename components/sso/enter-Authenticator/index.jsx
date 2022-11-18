import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";

import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import Header from "../../../components/global/Header.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import InputOTP from "../../global/otp/inputOtp";
import styles from "../../clientOnboarding/Landing/Landing.module.css";
import ButtonUI from "../../ui/Button.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import { emailRegister } from "../../../global/path/redirectPath";
import Loader from "../../ui/Loader/Loader.component";

const EnterAuthenticatorComponent = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  // Otp Counter State
  const [counter, setCounter] = useState(60);

  // Otp Sent Time Count
  const [OtpCount, setOtpCount] = useState(0);

  const [sessionId, setSessionId] = useState("");

  const [user, setUser] = useState("");

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
        client_id: user.client_id,
        mfa_code: otp,
      };
      const getData = await AxiosInstance.post(
        `/v3/googleauth/registration`,
        APIData,
        {
          headers: {
            Authorization: `Bearer ${user.auth_token}`,
          },
        }
      );

      //   receiving response from backend
      const res = await getData.data;

      if (getData.status === 200 && res) {
        void router.push("/sso/enter-pin");
      } else {
        setIsDisabled(true);
        setOtpCount((OtpCount) => OtpCount + 1);
        setIsOtpErrorMSgVisible(true);
        reset();
        setIsLoading(false);
        
          props.setError({
            isError: true,
            ErrorMsg: getData.error.message,
            showHide: true,
          });
      }
      // Reset The Input Field
      reset();
    } catch (error) {
      // Error IF Something Goes Wrong

      setIsOtpErrorMSgVisible(true);
      setIsDisabled(true);
      setOtpCount((OtpCount) => OtpCount + 1);
      setIsLoading(false);
      reset();
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
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
  if (OtpCount >= 3) {
    void router.push(emailRegister);
  }

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
    const localUserData = GetUserDataFromLocalStorage("userDetails") || "";
    const session = GetSessionIdFromSessionStorage("ssoSessionId");
    session && session.session_id && setSessionId(session.session_id);

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
    router.beforePopState(() => {});
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);

  return (
    <>
      <Header />
      {isLoading && <Loader />}
      <div className="ContainerBG">
        <div className="containerMini">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="container ">
              <div className="welcomeBack animate__animated">
                Welcome back, {user && user.fname}
              </div>
              <h2 className="title animate__animated">
                Enter authenticator code
              </h2>
              <p className="subTitle animate__animated">
                You can find this code in your authenticator <br /> app.
                Remember that the codes refresh every 30
                <br /> secs.
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

              <div className="animate__animated pt20">
                <ButtonUI
                  type={"submit"}
                  id="btn"
                  disabled={isDisabled}
                  ariaLabel="Verify OTP"
                >
                  Verify
                </ButtonUI>
              </div>
              <div className={`animate__animated or`}>OR</div>
              <div className="animate__animated">
                <ButtonUI
                  btnType="btn btn-outline"
                  type={"submit"}
                  ariaLabel="Use authenticator code"
                  onClick={() => router.push("/sso/enter-otp")}
                >
                  Get OTP
                </ButtonUI>
              </div>
            </div>
          </form>
        </div>
        <div
          className={`animate__animated bottomLabelInfo ${styles.bottomTextWrap}`}
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
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterAuthenticatorComponent);
