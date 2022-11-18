import React, { useEffect } from "react";
import Header from "../../../global/Header.component";
import styles from "./Pan.module.css";
import ButtonUI from "../../../ui/Button.component";
import { connect } from "react-redux";
import Link from "next/link";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import { useState } from "react";
import PanCard from "./PanCard.component";
import { useRouter } from "next/router";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../../Redux/Landing";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import { enterPan, kycLanding, mobileRegister } from "../../../../global/path/redirectPath";
const PANCardDetails = (props) => {
  const router = useRouter();

  const [user, setUser] = useState("");

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    if (!localUserData || localUserData === "") {
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      })
    }

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);

    router.beforePopState(() => {
      void router.push(enterPan);
    });
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);

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
  return (
    <>
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate__animated">Your PAN details</h2>
          <p className="subTitle animate__animated">
            This PAN will be used to set up your demat account.
          </p>

          <p className={`${styles.panNo} animate__animated`}>
            {(user && user.panNumber) || ""}
          </p>

          <PanCard
            panNumber={(user && user.panNumber) || ""}
            panName={(user && user.panName) || ""}
          />
          <div className="animate__animated">
            <Link href={enterPan}>
              <a
                aria-label="Not Your Pan Try Again"
                className={`${styles.notYourPan} animate__animated`}
              >
                Not your PAN? Try again
              </a>
            </Link>
          </div>
          <div className="animate__animated">
            <ButtonUI
              ariaLabel="complate your kyc"
              onClick={() => router.push(kycLanding)}
              type="submit"
            >
              Continue
            </ButtonUI>
          </div>
          <div className="animate__animated pb20">
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    pan: state.LandingReducer.user.pan,
    phone: state.LandingReducer.user.phone || "",
    showModal: state.modalReducer.showModal,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PANCardDetails);
