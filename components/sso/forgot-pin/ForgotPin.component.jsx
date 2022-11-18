import { useRouter } from "next/router";
import React from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import Loader from "../../ui/Loader/Loader.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import { useEffect } from "react";
import { useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";

const ForgotPin = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Creating Router For Routing Purpose
  const router = useRouter();
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);
  const [showPanErrorMsg, setShowPanErrorMsg] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const [user, setUser] = useState("");
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("userDetails") || "";
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
    router.beforePopState(() => {});
  }, []);

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

  const handlePanOnChange = (e) => {
    e.preventDefault();
    setValue(
      "pan",
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
      // Sending data to API
      const APIData = {
        client_id: user.client_id,
        pan: data.pan,
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN,
      };
      const getData = await AxiosInstance.post(`/pan/v3/validateuser`, APIData);
      // receiving response from backend
      const res = await getData.data;
      let object = user;
      object["journey"] =
        process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN;
      SetItemToLocalStorage("userDetails", object);
      if (getData.status === 200 && res) {
        void router.push("/sso/enter-otp");
      } else {
        setIsLoading(false);
        setIsDisabled(true);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
        reset();
      }
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
    // }
  };

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("userDetails") || "";
    if (localUserData) {
      const userData =
        typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      setUser(userData);
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
          <h2 className="title animate">Forgot PIN?</h2>
          <p className="subTitle animate">Enter your PAN to continue.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tooltip for Invalid Pan */}
            <div className="inputTooltip animate">
              <div className={`tooltip ${!showPanErrorMsg && "hide"} `}>
                <div className="icon-Access-denied "></div>

                <span className="tooltipText tooltip-top">
                  PAN details invalid!
                </span>
              </div>

              {/* PAN Number Input */}
              <input
                type="text"
                className="form-control"
                id="pan"
                placeholder="Enter PAN"
                aria-label="Enter Pan"
                maxLength={10}
                {...register("pan", {
                  pattern: {
                    value: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/,
                    message: "Invalid PAN Number",
                  },
                  maxLength: {
                    value: 10,
                    message: "Maximum 10 number",
                  },
                })}
                onChange={(e) => handlePanOnChange(e)}
              />
            </div>
            <div className="animate">
              <ButtonUI
                type={"submit"}
                disabled={isDisabled}
                ariaLabel="Verify"
              >
                Verify
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPin);
