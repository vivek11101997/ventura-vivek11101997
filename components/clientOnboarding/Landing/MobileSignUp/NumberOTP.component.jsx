import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { connect } from "react-redux";

import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";

import styles from ".././Landing.module.css";
import AxiosInstance from "../../../../Api/Axios/axios";
import ButtonUI from "../../../ui/Button.component";
import Loader from "../../../ui/Loader/Loader.component";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import GetSessionIdFromSessionStorage from "../../../../global/localStorage/GetSessionIdFromSessionStorage";
import Logo from "../../../ui/LogoWithName/Logo";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import InputOTP from "../../../global/otp/inputOtp";
import BackGroundImage from "../../../ui/BackgroundLineImage/BackGroundImage.component";
import Welcomeback from "../../../ui/Popups/Welcomeback/Welcomeback";
import Modal from "../../../ui/Modal/Modal.component";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import SetItemToLocalStorage from "./../../../../global/localStorage/SetItemToLocalStorage";
import {
  emailRegister,
  mobileRegister,
} from "../../../../global/path/redirectPath";
const NumberOTP = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  // SessionId State
  const [sessionId, setSessionId] = useState("");

  // Phone Number State
  const [phoneNumber, setPhoneNumber] = useState("");

  // Masked Phone Number State
  const [maskMobile, setMaskMobile] = useState("");

  // Otp Counter State
  const [counter, setCounter] = useState(60);

  // Otp Sent Time Count
  const [OtpCount, setOtpCount] = useState(0);
  // Get User Data From LocalStorage

  // Invalid OTP Msg
  const [isOtpErrorMSgVisible, setIsOtpErrorMSgVisible] = useState(false);

  const { register, setValue, handleSubmit, reset } = useForm();

  const [welcomeBackRedirectUrl, setWelcomeBackRedirectUrl] = useState("");
  const [userFirstName, setUserFirstName] = useState("");

  const [user, setUser] = useState({});

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

  // Handling Form on Submit Using Async Await
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
        phone: parseInt(phoneNumber),
        otp: parseInt(otp),
      };

      const getData = await AxiosInstance.post(
        `/signup/user/phone/otp/verify`,
        {
          ...APIData,
        }
      );
      const res = await getData.data;
      if (getData.status === 200 && res) {
        if (
          getData.status === 200 &&
          res &&
          res.returning_user &&
          res.returning_user.web_route
        ) {
          user.phone && getPreviewData();
          setIsLoading(false);
          props.toggleModal();
          setWelcomeBackRedirectUrl(res.returning_user.web_route);
        } else  {
          void router.push(emailRegister);
        }
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
            redirectTo: mobileRegister,
          });
      }
    } catch (error) {
      setOtpCount((OtpCount) => OtpCount + 1);

      setIsLoading(false);
      setIsOtpErrorMSgVisible(true);
      setIsDisabled(true);

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
      setIsLoading(true);
      reset();
      setCounter(60);
      setIsDisabled(true);
      const APIData = {
        phone: parseInt(phoneNumber),
      };

      const getData = await AxiosInstance.post(`/signup/user/resendotp`, {
        ...APIData,
      });
      const response = await getData.data;

      if (getData.status === 200 && response) {
        setOtpCount(response.attempts_left);
        setIsLoading(false);
      } else {
        reset();
        setIsLoading(false);
        setIsDisabled(true);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
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
    const session = GetSessionIdFromSessionStorage("session") || "";

    // Getting User Details From Session Storage
    let localUserData = GetUserDataFromLocalStorage("user") || "";
    const userData =
      (!localUserData || localUserData !== "") &&
      typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
    session && session.session_id && setSessionId(session.session_id);
    userData && userData.phone && setPhoneNumber(userData.phone);

    userData.phone &&
      setMaskMobile(userData.phone.toString().replace(/\d(?!(\d{4}))/g, "x"));
  }, [isLoading]);
  useEffect(() => {
    const timer =
      counter > 0 &&
      setInterval(() => {
        setCounter(counter - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [counter]);
  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
    router.beforePopState(() => {
      void router.push(mobileRegister);
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

  const getPreviewData = async () => {
    try {
      setIsLoading(true);
      const getPreview = await AxiosInstance.get(
        `/signup/user/details/get?phone=${user.phone}`
      );
      setIsLoading(false);
      if (getPreview.status === 200) {
        const personalData = getPreview.data.personal_details;
        const bankDetail = getPreview.data.bank_details;
        const UserObject = {
          phone: user.phone || parseInt(personalData.phone_no.phone_no) || "",
          step: 0, // parameter pending from APi
          returning_user: true,
          first_name: personalData.first_name.first_name,
          clientid: personalData.client_id.client_id || "",
          email: personalData.email_id.email_id || "",
          panNumber: personalData.pan_no.pan_no || "",
          panName: personalData.name.name || "",
          dob: personalData.dob.dob || "",
          selected_bank: bankDetail.bank_name.bank_name || "",
          selected_branch: bankDetail.branch_name.branch_name || "",
          ifsc: bankDetail.ifsc_code.ifsc_code || "",
          account_no: bankDetail.account_no.account_no || "",
          fatherName: personalData.pan_father_name.pan_father_name || "",
        };

        const WelcomeBackUser = UserObject;
        SetItemToLocalStorage("user", WelcomeBackUser);
        setUserFirstName(personalData.first_name.first_name);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getPreview.error.message,
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
  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.signUpBox}>
        <BackGroundImage />
        {props.showModal && (
          <Modal onClick={props.toggleModal}>
            <Welcomeback
              redirectUrl={welcomeBackRedirectUrl}
              userName={userFirstName}
            />
          </Modal>
        )}

        <Logo />
        <img
          src="/images/VenturaLogo.png"
          alt="Ventura Logo"
          className={`animate__animated ${styles.logo} ${styles.logoDesk}`}
        />
        <div>
          <div className={styles.form_wrap}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="container">
                <h2 className="title animate__animated">Enter OTP here</h2>
                <p className="subTitle animate__animated">
                  We have sent an OTP to your mobile number <br /> +91-
                  {maskMobile}.
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
                  <div className="col-6 timer" aria-label="OTP Timer">
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
                  <div className="otpTimerResend errorMsgOtp">
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
            {Error}
          </div>
        </div>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    toggleModal: () => dispatch(TOGGLE_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NumberOTP);
