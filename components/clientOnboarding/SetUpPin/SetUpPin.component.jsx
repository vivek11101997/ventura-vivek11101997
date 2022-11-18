import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { useRouter } from "next/router";
import Loader from "../../ui/Loader/Loader.component";
import InputOTP from "../../global/otp/inputOtp";
import { connect } from "react-redux";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import ReEnterPin from "../../global/reEnterPin/ReEnterPin.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import { mobileRegister } from "../../../global/path/redirectPath";
const SetUpPin = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  const [sessionId, setSessionId] = useState("");
  const { register, setValue, handleSubmit, reset, watch } = useForm();

  const otpArray = ["otpFirst", "otpSecond", "otpThird", "otpFourth"];
  const reEnterOtpArray = [
    "otpFirstAgain",
    "otpSecondAgain",
    "otpThirdAgain",
    "otpFourthAgain",
  ];

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

  // Handling Form on Submit Using Async Await
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Destructuring All the Input
      const { otpFirst, otpSecond, otpThird, otpFourth } = data;

      // Storing all input in one variable
      const otp = `${otpFirst}${otpSecond}${otpThird}${otpFourth}`;
      const APIData = {
        client_id: user.client_id,
        pin: otp,
      };
      const getData = await AxiosInstance.post(
        `https://sso-stage.ventura1.com/auth/user/cob/v1/setpin`,
        APIData,
        {
          headers: {
            "x-api-key": process.env.VENTURA_APP_SSO_API_KEY,
          },
        }
      );

      if (getData.status === 200) {
        void router.push("/sso/sign-in");
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
        reset();
        setIsLoading(false);
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
      setIsDisabled(true);

      setIsLoading(false);
      reset();
    }
  };

  const [clientName, setClientName] = useState("");
  const [user, setUser] = useState("");
  const [phone, setPhone] = useState();
  const getClientID = async () => {
    try {
      setIsLoading(true);
      const APIData = {
        phone: parseInt(phone),
      };
      const getData = await AxiosInstance.post("/getclientName", {
        ...APIData,
      });
      const data = await getData.data;
      if (getData.status === 200) {
        setIsLoading(false);
      } else {
        setIsLoading(false)
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
          redirectTo:"/co/account-created"
        });
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: "/sso/enter-pan",
      });
    }
  };
  const checkValue = () => {
    let arr1 = [],
      arr2 = [],
      count = 0;
    let inputs = document.querySelectorAll("input");
    const validInputs = Array.from(inputs).filter((input) => {
      input.value !== "";
    });

    otpArray.map((item) => arr1.push(watch(item)));
    reEnterOtpArray.map((item) => arr2.push(watch(item)));
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        count = count - 1;
      } else {
        count = count + 1;
      }
    }
    count === arr1.length ? setIsDisabled(false) : setIsDisabled(true);
  };

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") &&
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister,
      });
    const session = GetSessionIdFromSessionStorage("ssoSessionId");
    session && session.session_id && setSessionId(session.session_id);
    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      userData && setPhone(userData.phone);
      userData && setUser(userData);
    }
  }, []);
  useEffect(() => {
    phone && void getClientID();
  }, [phone]);
  return (
    <>
      <Header />
      {isLoading && <Loader />}
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="setUpPinWrap">
            <h2 className="title">
              Welcome aboard,&nbsp;
              <span>{user && clientName}</span>
            </h2>
            <p className="subTitle">
              Set a 4 digit PIN to login to your account.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ReEnterPin
                register={register}
                setValue={setValue}
                watch={watch}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(SetUpPin);
