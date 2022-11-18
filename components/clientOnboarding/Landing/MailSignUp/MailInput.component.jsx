import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { auth } from "../../../../global/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";
import ButtonUI from "../../../ui/Button.component";
import styles from ".././Landing.module.css";
import AxiosInstance from "../../../../Api/Axios/axios";
import Loader from "../../../ui/Loader/Loader.component";
import Logo from "../../../ui/LogoWithName/Logo";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import BackGroundImage from "../../../ui/BackgroundLineImage/BackGroundImage.component";
import { emailVerifyOtp, mobileRegister, welcome } from "../../../../global/path/redirectPath";

const MailInput = (props) => {
  // Creating Router For Routing Purpose
  const router = useRouter();

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Get User Data From LocalStorage
  const [user, setUser] = useState();

  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

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

  // Defining Regex for Email
  const MailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

  //   Email Validation
  const validateEmail = (email) => {
    if (MailRegex.test(email)) {
      return true;
    } else {
      return "Invalid Email ID";
    }
  };


  // Handling Form  on Submit USing Async Await
  const onSubmit = async (data) => {
    try {
      // Set Loading to true When Submitting the Form
      setIsLoading(true);

      // Sending data to API
      const APIData = {
        email: data.email,
      };

      const getData = await AxiosInstance.post("/signup/user/email", APIData);
      //   receiving response from backend


      if (getData.status === 200) {
        // set loading False if Response is Successful
        void router.push(emailVerifyOtp);

        const object = user;
        object["email"] = data.email;
        SetItemToLocalStorage("user", object);
      } else {
        // If Anything Goes Wrong then Display Modal With Error && Set Loading to True
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
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
      // Reset The Input Field
      reset();
      setIsLoading(false);
    }
  };
  const signInWithGoogle = async () => {
    try {
      // Creating Continue With G-mail Functionality
      const provider = new GoogleAuthProvider();
      const userData = await signInWithPopup(auth, provider);

      const response = userData.user;
      const APIData = {
        email: response.email,
      };
      setIsLoading(true);
      const getData = await AxiosInstance.post("/signup/user/gmail_verified", {
        ...APIData,
      });

      const object = user;

      object["email"] = response.email;
      SetItemToLocalStorage("user", object);

      if (getData.status === 200) {
        // Redirect To Welcome Page Instead of OTP Component
        void router.push(welcome);
      } else {
        reset();
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
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

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      setUser(userData);
      userData &&
        userData.email &&
        setValue("email", userData.email, {
          shouldDirty: true,
          shouldValidate: true,
        });
    }

    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
    router.beforePopState(() => {
      void router.push(mobileRegister);
    });
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.signUpBox}>
        {/* Using Ternary Operator to Toggle OTP And Input Field  */}

        <BackGroundImage />
        <Logo />
        <img
          src="/images/VenturaLogo.png"
          alt="Ventura Logo"
          className={`animate__animated ${styles.logo} ${styles.logoDesk}`}
        />
        <div>
          <h2 className="title animate__animated">Add your email</h2>
          <p className="subTitle animate__animated">
            This is where we&lsquo;ll send you important updates and insights on
            the market.
          </p>
          {/* Email Form  */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row animate__animated">
              <div className="col">
                {/* Defining Email Input */}
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  aria-label="Enter Email"
                  required
                  {...register("email", {
                    required: "Email is required",
                    validate: validateEmail,
                  })}
                  onKeyUp={() => {
                    void trigger("email");
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate__animated">
              <ButtonUI
                btnType="btn btn-outline"
                type={"submit"}
                disabled={!isDirty || !isValid}
                ariaLabel="Verify email"
              >
                Verify email
              </ButtonUI>
            </div>
            <div className={`animate__animated ${styles.or}`}>OR</div>
          </form>
          <div className="animate__animated">
            <ButtonUI
              btnType={styles.gmail}
              type={"submit"}
              onClick={signInWithGoogle}
              ariaLabel="Continue with Google"
            >
              <img src="/images/googleMail.svg" alt="gmail Icon" /> Continue
              with Google
            </ButtonUI>
          </div>
        </div>
      </div>
      {Error}
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

export default connect(mapStateToProps, mapDispatchToProps)(MailInput);
