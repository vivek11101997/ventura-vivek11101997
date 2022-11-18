import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import Loader from "../../../components/ui/Loader/Loader.component";
import { connect } from "react-redux";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import ErrorModal from "../../../components/ui/Modal/ErrorModal.component";
import { useRouter } from "next/router";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import setStorageSessionItem from "../../../global/localStorage/SetItemToSessionStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import getSystemDetails from "../../../components/global/systemDetails/getSystemDetails";
import axios from "axios";
import Modal from "../../../components/ui/Modal/Modal.component";
import MultipleIdDetected from "../../../components/ui/Popups/MultipleIdDetected/MultipleIdDetected";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import { useFlags } from "flagsmith/react";
import QRCode  from "qrcode";
const SsoSignIn = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Creating Router For Routing Purpose
  const router = useRouter();
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);
  const [uuid, setUuid] = useState();
  const [user, setUser] = useState("");
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [browserModalErrorMessage, setBrowserModalErrorMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const systemDetails = getSystemDetails();

  const app_qr_link = useFlags(["app_qr_link"]);
  const app_qr_link_url = app_qr_link["app_qr_link"].value;

  // Initialize an agent at application startup.
  const fpPromise = FingerprintJS.load({
    apiKey: process.env.FINGERPRINTJS_API_KEY,
    region: "ap",
  });

  // Get the visitor identifier when you need it.
  fpPromise
    .then((fp) => fp.get())
    .then((result) => {
      setUuid(result.visitorId);
    });

  const signInChangeHandler = (e) => {
    e.preventDefault();
    e.target.value.length >= 3 ? setIsDisabled(false) : setIsDisabled(true);
  };
  // Initialize an fingerprintjs at application startup END

  const Error = (
    <>
      {props.showError && props.error && props.errorMsg ? (
        <ErrorModal
          redirectTo=""
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );

  const handleModal = () => {
    setShowBrowserModal(false);
  };
  const errorPopup = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message &&
      error.response.data.message.includes("multiple accounts")
    ) {
      setBrowserModalErrorMessage(error.response.data.message);
      setShowBrowserModal(true);
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
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
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let APIData = {
        id: data.phone,
        application: "neutrino_exe",
        application_version: "11",
        meta: {
          os: systemDetails.OSName,
          "os version": 12,
          "browser version": systemDetails.fullVersion,
          "browser type": systemDetails.appName,
          "device type": "realme x",
        },
        uuid: uuid,
      };

      const postData = await axios.post(
        `https://sso-stage.ventura1.com/auth/user/v3/validateuser`,
        APIData,
        {
          headers: {
            "x-api-key": process.env.VENTURA_APP_SSO_API_KEY,
          },
        }
      );
      if (postData.status === 200) {
        let object = postData.data;
        setUser(object);
        object["otpTryCount"] = 0;
        object["browserBlockedCount"] = 0;
        SetItemToLocalStorage("userDetails", object);
        const newData = {
          client_id: data.phone,
          newuser: postData.data.newuser,
          google_auth_enabled: postData.data.google_auth_enabled,
        };
        void validateUser(newData);
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: postData.error.message,
          showHide: true,
        });
      }
      reset();
    } catch (error) {
      // Error If Something Goes Wrong
      setIsLoading(false);
      setIsDisabled(true);
      errorPopup(error);
      reset();
    }
  };

  const validateUser = async (newData) => {
    try {
      setIsLoading(true);
      let APIData = {
        id: newData.client_id,
        application: "boom_exe",
        application_version: "1",
        meta: {
          os: "Android",
          "os version": 12,
          "browser version": "98.0.4758.101",
          "browser type": "chrome",
          "device type": "realme x",
        },
        uuid: uuid,
      };

      const postData = await fetch("/api/validateUser", {
        method: "POST",
        body: JSON.stringify(APIData),
      });
      const res = await postData.json();
      if (res) {
        const object = {
          session_id: res.sessionId,
          timestamp: new Date().getTime() + 10000,
        };
        setStorageSessionItem("ssoSessionId", object);
        if (newData.newuser === true) {
          void router.push("/sso/enter-pan");
        } else {
          newData.google_auth_enabled
            ? void router.push("/sso/choose-verification")
            : void router.push("/sso/enter-otp");
        }
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: postData.error.message,
          showHide: true,
        });
      }
      reset();
    } catch (error) {
      setIsLoading(false);
      setIsDisabled(true);
      errorPopup(error);
      reset();
    }
  };

  useEffect(() => {
    // for animation of fields
    document.querySelectorAll(".animate").forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
    !isLoading &&   QRCode.toCanvas(
      document.getElementById("canvas"),
      app_qr_link_url,
      { toSJISFunc: QRCode.toSJIS },
      function (error) {
        if (error) console.error(error);
      
      }
    );
  }, [isLoading]);
  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate">Start building your wealth</h2>
          <p className="subTitle animate">
            Login using your mobile number/email <br />
            /client ID.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col animate">
              <input
                type="text"
                className="form-control"
                aria-label="Enter Mobile Number / Email / Client ID"
                placeholder="Enter mobile number / email / client ID"
                name="phone"
                required={true}
                {...register("phone", {
                  required: true,
                })}
                onChange={(e) => signInChangeHandler(e)}
              />
            </div>
            <div className="animate">
              <ButtonUI
                type={"submit"}
                id="btn"
                disabled={isDisabled}
                ariaLabel="Login"
              >
                Login
              </ButtonUI>
            </div>
          </form>
          <div className={"qr"}>
            <canvas id="canvas" className={"qrcodeCanvas"}></canvas>
          </div>
        </div>
        {showBrowserModal && (
          <Modal onClick={handleModal}>
            <MultipleIdDetected
              errorMessage={browserModalErrorMessage}
              showBrowserModal={showBrowserModal}
              setShowBrowserModal={setShowBrowserModal}
            />
          </Modal>
        )}
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
    showModal: state.modalReducer.showModal,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SsoSignIn);
