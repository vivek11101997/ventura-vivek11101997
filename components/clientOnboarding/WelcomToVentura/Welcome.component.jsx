import React, { useEffect, useState } from "react";
import Header from "../../global/Header.component";
import styles from "../WelcomToVentura/Welcome.module.css";
import ButtonUI from "../../ui/Button.component";
import { useRouter } from "next/router";
import ListIcon from "../../global/listIcon";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import store from "../../../Redux/store";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import { connect } from "react-redux";
import { addBankAccount, addMaritalStatus, enterPan, mobileRegister, preview, takeSelfie } from "../../../global/path/redirectPath";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
const WelcomeComponent = (props) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

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

    userData && setStep(parseInt(userData.step) || 0);

    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });

    userData && router.beforePopState(() => {
      userData.step === 0 &&
        void router.push(mobileRegister)
      void router.back();
    });
  }, []);

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo={props.redirectTo}
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );
  const hideModal = () => {
    if (store.getState().modalReducer.showModal) {
      store.dispatch(TOGGLE_MODAL());
    }
  };
  const welcomeStep = [
    {
      id: "1",
      class: "icon-Complete-your-e-KYC completeIcon",
      parentClass: "completedSteps",
      title: "Complete your e-KYC",
      description: "Keep your Aadhaar and PAN card handy",
    },
    {
      id: "2",
      class: "icon-Set-up-your-profile completeIcon",
      parentClass: "completedSteps",
      title: "Set up your profile",
      description: "Answer a few questions about yourself",
    },
    {
      id: "3",
      class: "icon-Link-your-bank-account completeIcon",
      parentClass: "completedSteps",
      title: "Link your bank a/c",
      description: "Speed up your deposits and withdrawals",
    },
    {
      id: "4",
      class: "icon-Confirm-its-you completeIcon",
      parentClass: "completedSteps",
      title: "Confirm it's you",
      description: "Upload your photo and signature",
    },
    {
      id: "5",
      class: "icon-eSign-and-Login completeIcon",
      parentClass: "completedSteps",
      title: "eSign and Login",
      description: "Sign your application and start investing",
    },
  ];

  const continueBtn = [
    { step: 0, ariaLabel: "Create account", redirectTo: enterPan },
    {
      step: 1,
      ariaLabel: "Continue",
      redirectTo: addMaritalStatus,
    },
    { step: 2, ariaLabel: "Continue", redirectTo: addBankAccount },
    { step: 3, ariaLabel: "Continue", redirectTo: takeSelfie },
    { step: 4, ariaLabel: "Continue", redirectTo: preview },
    { step: 5, ariaLabel: "Continue", redirectTo: "" },
  ];

  return (
    <>
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="animate__animated title">Here's what's next</h2>
          <div className={`animate__animated ${styles.stepsWrap}`} id="stepsWrap">
            {welcomeStep.map((item, index) => (
              <div key={item.id}>
                <ListIcon key={index} data={item} style={styles} />
                {index + 1 === step && (
                  <h2
                    key={`listTitle${index}`}
                    className="animate__animated Nextup"
                  >
                    Next up...
                  </h2>
                )}
              </div>
            ))}
          </div>
          <div className="animate__animated pb20">
            {continueBtn
              .filter((temp) => temp.step === step)
              .map((item, index) => (
                <ButtonUI
                  key={index}
                  ariaLabel={item.ariaLabel}
                  onClick={() => {
                    void router.push(item.redirectTo);
                    hideModal();
                  }}
                  type={"submit"}
                >
                  {item.ariaLabel}
                </ButtonUI>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    // Error Message For Api Fail
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeComponent);