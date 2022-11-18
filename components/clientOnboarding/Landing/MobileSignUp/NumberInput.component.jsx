import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
  STORE_SESSION,
} from "../../../../Redux/Landing";

import ButtonUI from "../../../ui/Button.component";
import Loader from "../../../ui/Loader/Loader.component";
import styles from ".././Landing.module.css";
import BackGroundImage from "../../../ui/BackgroundLineImage/BackGroundImage.component";
import Logo from "../../../ui/LogoWithName/Logo";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage.js";
import setStorageSessionItem from "../../../../global/localStorage/SetItemToSessionStorage";
import axios from "axios";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import { useFlags } from "flagsmith/react";
import Link from "next/link";
import { phoneVerifyOtp } from "../../../../global/path/redirectPath";

const NumberInput = (props) => {
  // Loading State
  // console.log(process.env.FINGERPRINTJS_API_KEY,"number")
  // debugger
  const [isLoading, setIsLoading] = useState(false);
  

  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

  const router = useRouter();

  const privacy_policy = useFlags(["privacy_policy_url"]);
  const privacy_policy_url = privacy_policy["privacy_policy_url"].value;
  const terms_of_use = useFlags(["terms_of_use_url"]);
  const terms_of_use_url = terms_of_use["terms_of_use_url"].value;
  const cob_base_url_prod1 = useFlags(["cob_base_url_prod"]);
  const cob_base_url_prod = cob_base_url_prod1["cob_base_url_prod"].value;
  const cob_base_url_stage1 = useFlags(["cob_base_url_stage"]);
  const cob_base_url_stage = cob_base_url_stage1["cob_base_url_stage"].value;
  const cob_base_url_qa1 = useFlags(["cob_base_url_qa"]);
  const cob_base_url_qa = cob_base_url_qa1["cob_base_url_qa"].value;
  if (typeof window !== "undefined") {
    const object = {
      cob_base_url_prod,
      cob_base_url_qa,
      cob_base_url_stage
    }
    SetItemToLocalStorage("url", object)
  }

  // Defining Regex for mobile number
  const phoneNumberRegex = new RegExp(/^[6-9]\d{9}$/i);

  //   Number Validation
  const validatePhone = (phone) => {
    if (phoneNumberRegex.test(phone)) {
      return true;
    } else {
      return "Invalid Phone Number";
    }
  };

  const errorPopup = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      props.setError({
        isError: true,
        ErrorMsg: error.response.data.message,
        showHide: true,
      });
    } else {
      props.setError({
        isError: true,
        ErrorMsg: error.message || process.env.errorMessage,
        showHide: true,
      });
    }
  }
  // Error Modal

  const Error = (
    <>
      {props.showError && props.error && props.errorMsg ? (
        <ErrorModal redirectTo="" errorMsg={props.errorMsg} onClick={props.hideErrorModal} />
      ) : null}
    </>
  );
  // Handling Form on Submit Using Async Await
  const onSubmit = async (data) => {
    try {
      // Set Loading to true When Submitting the Form
      setIsLoading(true);
      // Sending data to API
      const APIData = JSON.stringify({
        phone: parseInt(data.phone),
        enable_whatsapp: data.enableWhatsapp,
      });

      // Generating session ID
      let sessionRes = "";
      const sessionConfig = {
        method: "post",
        url: `${process.env.CO_BASE_URL}/signup/session-id`,
        headers: {
          "Content-Type": "application/json",
        },
        data: APIData,
      };

      axios(sessionConfig)
        .then(function (response) {
          if (response.status === 200) {
            sessionRes = response.data;
            const object = {
              session_id: sessionRes.session_id,
              timestamp: new Date().getTime() + 10000,
            };

            setStorageSessionItem("session", object);
            let res = [];

            let phoneSignUp = {
              method: "post",
              url: `${process.env.CO_BASE_URL}/signup/user/phone`,
              headers: {
                "Content-Type": "application/json",
              },
              data: APIData,
            };
            axios(phoneSignUp)
              .then(function (response) {
                res = response.data;
                let userObject = JSON.parse(APIData)
                userObject["step"] = 0
                userObject["returning_user"] = res.returning_user
                userObject["clientid"] = res.clientid || ""
      
                if (response.status === 200) {
                  SetItemToLocalStorage("user", JSON.stringify(userObject));
                  void router.push(phoneVerifyOtp);
                }
              })
              .catch(function (error) {
                errorPopup(error)
                setIsLoading(false);
              });
            // Storing tha data in redux
            // let UserSession = {
            //   clientid: res.clientid,
            //   existing_user: res.existing_user,
            //   new_user: res.new_user,
            //   returning_user: res.returning_user,
            // };
            // props.storeSession(UserSession);
          }
        })
        .catch(function (error) {
          errorPopup(error)
          setIsLoading(false);
        });

     
      // Reset The Input Field
      reset();
    } catch (error) {
      // Error IF Something Goes Wrong
      errorPopup(error)
      setIsLoading(false);

      // Reset The Input Field
      reset();
    }
  };

  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;

    });

    // Getting User Details From Session Storage

    const localUserData = GetUserDataFromLocalStorage("user") || "";
    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;

      userData &&
        userData.phone &&
        setValue("phone", userData.phone, {
          shouldDirty: true,
          shouldValidate: true,
        });
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.signUpBox}>
        <BackGroundImage />
        <Logo />
        <img
          src="/images/VenturaLogo.png"
          alt="Ventura Logo"
          className={`animate__animated ${styles.logo} ${styles.logoDesk}`}
        />
        <div className={styles.form_wrap}>
          <h2 className="title animate__animated ">Ready to get started?</h2>
          <p className="subTitle animate__animated ">
            Enter your number to help us set up your investment account.
          </p>

          {/* Mobile Number Input Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row  animate__animated  ">
              <div className="col-auto ">
                <input
                  className="form-control countryCode"
                  defaultValue={"+91"}
                />
              </div>
              <div className="col">
                {/* Number Inout Field */}
                <input
                  type={"text"}
                  className="form-control"
                  aria-label="Enter Mobile Number"
                  placeholder="Enter mobile number"
                  name="phone"
                  maxLength={10}
                  {...register("phone", {
                    required: true,
                    validate: validatePhone,
                  })}
                  onInput={(e) => {
                    setValue("phone", e.target.value.replace(/\D/g, ""));
                  }}
                  onKeyUp={() => {
                    void trigger("phone");
                  }}
                />
              </div>
            </div>

            {/* WhatsApp Notification Button Default Value Will Be Checked */}
            <div className="checkBox  animate__animated ">
              <input
                type="checkbox"
                id="enableWhatsapp"
                aria-label="Enable WhatsApp Notification"
                {...register("enableWhatsapp")}
                defaultChecked={true}
              />
              <label htmlFor="enableWhatsapp" aria-label="Enable WhatsApp Notifications Label">
                Enable WhatsApp notifications
              </label>
            </div>

            {/* Submit Button */}
            <div className={`animate__animated ${styles.btnTp}`}>
              <ButtonUI type={"submit"} disabled={!isDirty || !isValid} ariaLabel="Continue">
                Continue
              </ButtonUI>
            </div>
          </form>
          <p className={`animate__animated  ${styles.haveAnAccount} `}>
            Have an account?
            <a href="" aria-label="Login">Login</a>
          </p>
          <p className={`animate__animated  ${styles.termsOfUse} `}>
            By proceeding, you accept Ventura’s
            {/* <Link href={terms_of_use_url}> */}
              <a aria-label="Terms Of Use" target={"_blank"}>  &nbsp;Terms of Use</a>
            {/* </Link> */}
            <br />
             and
             {/* <Link href={privacy_policy_url}> */}
              <a aria-label="Privacy Policy" target={"_blank"}>&nbsp;Privacy Policy</a>
            {/* </Link> */}

          </p>
          {Error}
        </div>
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
    storeSession: (session) => dispatch(STORE_SESSION(session)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NumberInput);
