import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import Loader from "../../../components/ui/Loader/Loader.component";
import AxiosInstance from "../../../Api/Axios/axios";
import styles from "./AuthenticatorApp.module.css";
import { connect } from "react-redux";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import ErrorModal from "../../../components/ui/Modal/ErrorModal.component";
import { useRouter } from "next/router";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";

const AuthenticatorApp = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Creating Router For Routing Purpose
  const router = useRouter();
  // Button Disabled State
  const [authKey, setAuthKey] = useState("");
  const [copyTooltipShow, setcopyTooltipShow] = useState(false);
useEffect(() => {
  const newUserDetails = GetUserDataFromLocalStorage("userDetails");
  if (newUserDetails) {
    const userData =
      typeof newUserDetails === "string"
        ? JSON.parse(newUserDetails)
        : newUserDetails;

    userData && getAuthKey(userData);
  }
    QRCode.toCanvas(
      document.getElementById("canvas"),
      authKey,
      { toSJISFunc: QRCode.toSJIS },
      function (error) {
        if (error) console.error(error);
      
      }
    );
}, [authKey]);
const copyText=async()=>{
 await navigator.clipboard.writeText(authKey)
 setcopyTooltipShow(true);
 setTimeout(function() {
  setcopyTooltipShow(false);
  }, 2500);
}
  const getAuthKey = async (userData) => {
    try {
      setIsLoading(true);
      let APIData = {
        client_id: userData.client_id ,
      };
      const postData = await AxiosInstance.post(
        `/v3/googleauth/auth_code`,
        APIData,
        {
          headers: {
            Authorization: `Bearer ${userData.auth_token}`,
          },
        }
      );
      const data = await postData.data;
      if (postData.status === 200 && data) {
        setIsLoading(false);
        setAuthKey(data.auth_code);
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: postData.error.message,
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
        <div className="containerMiniMD">
          <h2 className="title animate">
            Get started with any authenticator app
          </h2>
          <p className="subTitle animate">
            Enter the given key in your authenticator app (Google Authenticator,
            <br /> Authy, etc.) or scan the QR code from your authenticator app.
          </p>
          <div className={styles.AuthenticatorApp}>
            <p className="animate">
              <a
                aria-label="What is an authenticator app?"
                href=""
                className="btnLInk"
              >
     
                <u>What is an authenticator app?</u>
              </a>
            </p>
            <div className={`animate ${styles.qcBox}`}>
              <div className={`row align-items-center ${styles.itemCenter}`}>
                <div className="col-auto ">
                  <div className={styles.qrCont}>
                    <div className={styles.qr}>
                      <canvas id="canvas" className={styles.qrcodeCanvas}></canvas>
                    </div>
                    <p>Scan QR code from phone</p>
                  </div>
                </div>
                <div className="col-auto">
                  <span className={styles.minTitle}>
                    Key for authenticator app
                  </span>
                  <div className="row align-items-center">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        aria-label="Key for authenticator app"
                        name="authKey"
                        value={authKey}
                        readOnly={true}
                      />
                    </div>
                    <div className="col">
                      <a className={styles.copy} onClick={copyText} aria-label="Text Copied" >
                        <span className={`copyTooltip ${copyTooltipShow ? 'show' : ''} `}>Text copied</span>
                        <span className="icon-Copy-Paste"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.btnWrap}>
            <ButtonUI
              btnType={`btn animate ${styles.btnCont}`}
              type={"submit"}
              ariaLabel="Continue"
              onClick={() => router.push("/sso/enter-authenticator")}
            >
              Continue
            </ButtonUI>
            </div>
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatorApp);
