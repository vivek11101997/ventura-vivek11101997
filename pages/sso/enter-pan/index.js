import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import Loader from "../../../components/ui/Loader/Loader.component";
import ErrorModal from "../../../components/ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { useRouter } from "next/router";

const EnterPan = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  const [showPanErrorMsg, setShowPanErrorMsg] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const { register, handleSubmit, reset, setValue } = useForm();
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

  const panHandler = (e) => {
    e.preventDefault();
    setValue(
      "panNumber",
      e.target.value.replace(/[^a-z0-9]/gi, "").toLocaleUpperCase()
    );
    if (e.target.value.length === 10) {
      if (/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(e.target.value)) {
        setShowPanErrorMsg(false);
        setIsDisabled(false);
      } else {
        setShowPanErrorMsg(true);
        setIsDisabled(true);
      }
    } else {
      setShowPanErrorMsg(false);
      setIsDisabled(true);
    }
  };
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let APIData = {
        client_id: userDetails.client_id,
        pan: data.panNumber,
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN,
      };
      const getData = await AxiosInstance.post(`/pan/v3/validateuser`, APIData);

      if (getData.status === 200) {
        if (getData.data && getData.data.message) {
          let obj = userDetails;
          obj["otpMessage"] = getData.data.message;
          obj["panNumber"] = data.panNumber;
          SetItemToLocalStorage("userDetails", obj);
        }
        void router.push("/sso/enter-otp");
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
      // Error If Something Goes Wrong
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

  useEffect(() => {
    const newUserDetails = GetUserDataFromLocalStorage("userDetails");
    if (newUserDetails) {
      const userData =
        typeof newUserDetails === "string"
          ? JSON.parse(newUserDetails)
          : newUserDetails;
      setUserDetails(userData);
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
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="welcomeBack animate">
            Welcome back, {userDetails && userDetails.fname}
          </div>
          <h2 className="title animate animate">Enter your PAN</h2>
          <p className="subTitle animate animate">
            Your PAN is required to set your PIN.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputTooltip animate col">
              <div className={`tooltip ${!showPanErrorMsg && "hide"} `}>
                <div className="icon-Access-denied "></div>

                <span className="tooltipText tooltip-top">
                  PAN details invalid!
                </span>
              </div>
              <input
                type={"text"}
                className="form-control"
                aria-label="Enter PAN"
                placeholder="Enter PAN"
                name="panNumber"
                maxLength={10}
                {...register("panNumber", {
                  pattern: {
                    value: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/,
                    message: "Invalid PAN Number",
                  },
                  maxLength: {
                    value: 10,
                    message: "Maximum 10 number",
                  },
                })}
                onChange={(e) => panHandler(e)}
              />
            </div>
            <div className="animate">
              <ButtonUI
                type={"submit"}
                id="btn"
                disabled={isDisabled}
                ariaLabel="Login"
              >
                Continue
              </ButtonUI>
            </div>
          </form>
        </div>
        <div className="bottomLabelInfo animate">
          NRI customers are requested to use <br />
          <a>client ID</a> or <a>email</a> to login.
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnterPan);
