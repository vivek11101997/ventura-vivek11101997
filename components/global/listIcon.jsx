import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import GetUserDataFromLocalStorage from "../../global/localStorage/GetUserDataFromLocalStorage";
import { mobileRegister } from "../../global/path/redirectPath";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../Redux/Landing";
import { TOGGLE_MODAL } from "../../Redux/modal";


const ListIcon = (props) => {
  const styles = props.style;
  const [step, setStep] = useState(null);

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

    setStep(userData.step);
  }, []);

  return (
    <>
      <div
        key={props.data.id}
        className={[
          `animate__animated`,
          `${styles.steps}`,
          props.data.id <= step && "completeStep",
        ].join(" ")}
      >
        <div className={`${styles.stepsIcon} stepsIcon`}>
          <span className={props.data.class}></span>
        </div>

        <div>
          <h3 className={styles.caSubtitle}>{props.data.title}</h3>
          <p className={styles.caSubTitleText}>{props.data.description}</p>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListIcon);
