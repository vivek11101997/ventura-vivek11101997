import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
  STORE_PAN,
} from "../../../../Redux/Landing";

import Header from "../../../global/Header.component";
import ButtonUI from "../../../ui/Button.component";
import { validatePAN } from "../../../validation/Validation.jsx";
import Modal from "../../../ui/Modal/Modal.component";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import styles from "./Pan.module.css";
import AxiosInstance from "../../../../Api/Axios/axios";
import Loader from "../../../ui/Loader/Loader.component";
import InvalidPan from "../../../ui/Popups/PANValidation/InvalidPan";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import { mobileRegister, panDetails, welcome } from "../../../../global/path/redirectPath";
import GoogleAuthenticator from "../../../ui/Popups/GoogleAuthenticator/GoogleAuthenticator";
const EnterPan = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  // Error Msg State
  const [isError, setError] = useState("");

  const [responseType, setResponseType] = useState(null);
  const [icon, setIcon] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [content, setContent] = useState("");
  const [checkbox, setCheckbox] = useState(true);

  // PAN Validation Status
  const [isPanValid, setIsPanValid] = useState(false);
  const [user, setUser] = useState();
  // PAN Error Msg
  const [showPanErrorMsg, setShowPanErrorMsg] = useState(false);
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
  const handlePanCheckBoxOnChange = (e) => {
    e.preventDefault();
    if (e.target.checked) {
      setCheckbox(true);
      isPanValid ? setIsDisabled(false) : setIsDisabled(true);
    } else {
      setCheckbox(false);
      setIsDisabled(true);

    }
  };
  const handlePanOnChange = (e) => {
    e.preventDefault();
    setValue(
      "pan",
      e.target.value.replace(/[^a-z0-9]/gi, "").toLocaleUpperCase()
    );
    if (e.target.value.length === 10) {
      if (/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(e.target.value)) {
        setShowPanErrorMsg(false);
        setIsPanValid(true);
        checkbox ? setIsDisabled(false) : setIsDisabled(true);
      } else {
        setShowPanErrorMsg(true);
        setIsDisabled(true);
        setIsPanValid(false);
      }
    } else {
      setShowPanErrorMsg(false);
      setIsDisabled(true);
      setIsPanValid(false);
    }
  };
  // Sending Data to API Using Async Await
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Validating PAN Using Different Regex
      const errorMsg = validatePAN(data.pan);

      if (!errorMsg.validated) {
        setIsLoading(false);
        props.toggleModal();
        setError(errorMsg.msg);
        setIcon(errorMsg.icon);
        setContent(errorMsg.content);
        setButtonText(errorMsg.buttonText);
        setResponseType(errorMsg.responseType);
      } else {
        // Sending data to API
        const APIData = {
          phone: parseInt(user.phone),
          pan: data.pan,
          testing: true,
        };
        const getData = await AxiosInstance.post(`/signup/user/pan/verify`, {
          ...APIData,
        });

        // Pan verification attempts exceeds the limit
        // receiving response from backend
        const res = await getData.data;

        if (getData.status === 200) {
          let UserPANDetails = {
            name: res.name,
            new_user: res.new_user,
            pan: res.pan,
            pan_status: res.pan_status,
            phone: res.phone,
          };
          let storePANDetails = {
            IsPANValidated: true,
            UserPANDetails,
          };
          const object = user;
          object["panNumber"] = res.pan;
          object["panName"] = res.name;
          SetItemToLocalStorage("user", object);
          props.storePAN(storePANDetails);
          void router.push(panDetails);
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
  };
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
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
    userData && setUser(userData);
    if (userData && userData.panNumber) {
      setValue("pan", userData.panNumber, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setIsDisabled(false);
      setIsPanValid(true);
    }

    router.beforePopState(() => {
      void router.push(welcome);
    });
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);
  return (
    <>
      {Error}
      <Header />
      {/* PAN Form */}
      {props.showModal && (
        <Modal ModalType="panValidation" onClick={props.toggleModal}>
          <InvalidPan
            buttonText={buttonText}
            errorMsg={isError}
            content={content}
            icon={icon}
            responseType={responseType}
            showModal={props.toggleModal}
          />
        </Modal>
      )}
      {isLoading && <Loader />}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="animate__animated title">Enter your PAN</h2>
          <p className="animate__animated subTitle">
            These details are required by SEBI to open your demat account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tooltip for Invalid Pan */}
            <div className="inputTooltip animate__animated">
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

            <div className="animate__animated checkBox duelLine">
              <input
                type="checkbox"
                id="enableWhatsapp"
                aria-label=" I’m a Tax Resident Of India And Not Paying Taxes To Any Other
                Jurisdiction(s)."
                defaultChecked={true}
                onInput={(e) => handlePanCheckBoxOnChange(e)}
                {...register("checkbox", {
                  required: true,
                })}
              />
              <label htmlFor="enableWhatsapp">
                I’m a tax resident of India and not paying taxes to any other
                jurisdiction(s).
              </label>
            </div>
            <div className={`animate__animated ${styles.note}`}>
              Your account would be opened as per your PAN card details. Please
              use the <b>Offline Account Opening Form</b> if you are looking to open an
              HUF, Corporate, Partnership, Joint or NRI account.
            </div>
            <div className="animate__animated">
              <ButtonUI
                type={"submit"}
                disabled={isDisabled}
                ariaLabel="Continue to get pan details"
              >
                Continue
              </ButtonUI>
            </div>
          </form>
        </div>
      </section>
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
    storePAN: (storePANDetails) => dispatch(STORE_PAN(storePANDetails)),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnterPan);
