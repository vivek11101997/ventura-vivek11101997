import React from "react";
import ButtonUI from "../../../ui/Button.component";
import styles from "./AddBank.module.css";
import { useRouter } from "next/router";
import BankAddedCard from "./BankAddedCard.component";
import { useState, useEffect } from "react";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../../Redux/Landing";
import { connect } from "react-redux";
import { mobileRegister, welcome } from "../../../../global/path/redirectPath";

const BankAccountAdded = () => {
  const [user, setUser] = useState();

  const router = useRouter();

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || ""
      (!localUserData || localUserData === "") && (props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      }));
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    setUser(userData);
  }, []);

  const handelBankAddedSuccess = () => {
    void router.push(welcome);
  };
  return (
    <section className="ContainerBG">
      {/* body bg */}
      <div className="containerMini">
        <div className="center">
          <img
            src="/images/added-account.svg"
            alt="Bank Account Icon"
            className={`animate__animated ${styles.accountIcon} `}
          />
          <h2 className="title animate__animated">Bank account added</h2>
          <p className="animate__animated subTitle">
            Your bank details have been verified.
          </p>
        </div>

        {user && (
          <BankAddedCard
            account_holder_name={user.panName}
            account_number={user.account_no}
            ifsc={user.ifsc}
            branch={user.selected_branch}
            bank_name={user.selected_bank}
          />
        )}

        <div className={`animate__animated ${styles.marginTop}`}>
          <ButtonUI
            ariaLabel="Bank Account added successfully"
            onClick={handelBankAddedSuccess}
          >
            Continue
          </ButtonUI>
        </div>
      </div>
    </section>
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BankAccountAdded);
