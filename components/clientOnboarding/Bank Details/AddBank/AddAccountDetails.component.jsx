import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import ButtonUI from "../../../ui/Button.component";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../../../Api/Axios/axios";
import { useRouter } from "next/router";
import Loader from "../../../ui/Loader/Loader.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import { addBankAccount, bankVerifyAccount, bankVerifyAccountFailed, mobileRegister, selectBranch } from "../../../../global/path/redirectPath";

const AddAccountDetails = (props) => {
  const [user, setUser] = useState();
  const [redirectTo, setRedirectTo] = useState("");
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(() => {
      void router.push(selectBranch);
    });
    const localUserData = GetUserDataFromLocalStorage("user") || ""
    if (!localUserData || localUserData === "") {
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister
      })
    }
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    setUser(userData);
    setFocus("accountNumber")
  }, []);

  useEffect(() => {
    (user && !user.selected_bank || user === "") && void router.push(addBankAccount);

    user && router.beforePopState(() => router.push(selectBranch));
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }
  }, [user]);
  const [IFSC, setIFSC] = useState("");
  const [Account_number, setAccount_number] = useState("");
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    setFocus,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

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

  const saveAccountNo = () => {
    const userFromLocalStorage = user;
    userFromLocalStorage["account_no"] = `${Account_number}`;
    SetItemToLocalStorage("user", userFromLocalStorage);
  };

  const resolveData = (response) => {
    try {
      setLoading(false);
      if (response.status === 200 && response.data.bank_verified) {
        redirectTo === "P" ? void router.push(preview) :
          void router.push(bankVerifyAccount)
      } else {
        redirectTo === "P" ? void router.push(`${bankVerifyAccountFailed}?redirect=P`) :
          void router.push(bankVerifyAccountFailed);

      }

    } catch (error) {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setValue("accountNumber", e.target.value.replace(/\D/g, ""));
    setAccount_number(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post(`/signup/bank/verify`, {
        phone: user.phone,
        account: data.accountNumber,
        ifsc: data.ifsc,
        account_type: "savings",
        primary_bank: true,
      });
      resolveData(response);
    } catch (error) {
      setLoading(false);
      reset();
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });

      void router.push(bankVerifyAccountFailed);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <section className="ContainerBG">
        <form
          aria-label="Add Bank Account Form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="containerMini">
            <h2 className="title animate__animated">Add bank account</h2>
            <p className="animate__animated subTitle">
              We’ll credit the account you confirm with a token of ₹1.
            </p>

            {user && <div className="animate_animated">
              <label aria-label="Bank Name" className="form-label" htmlFor="bankName">
                Bank name
              </label>

              <input
                {...register("bank_name")}
                aria-label="Enter Bank Name"
                id="ifscCode"
                readOnly
                className="form-control"

                value={user.selected_bank}
              />
            </div>}

            {user && <div className="animate_animated">
              <label className="form-label" htmlFor="ifscCode">
                IFSC code
              </label>
              <input
                aria-label="Enter IFSC Code"
                id="ifscCode"
                readOnly
                {...register("ifsc")}
                className="form-control"
                onChange={(e) => setIFSC(e.target.value)}
                value={IFSC || user.ifsc}
              />
            </div>}

            <div className="animate_animated">
              <label className="form-label" htmlFor="accountNumber">
                Account number
              </label>
              <input
                {...register("accountNumber", {
                  required: true,
                  minLength: 9,
                  maxLength: 18,
                })}
                aria-label="Enter Account Number"
                id="accountNumber"

                autoFocus={true}
                className="form-control"
                minLength={8}
                maxLength={18}
                onInput={(e) => {
                  handleInputChange(e);
                }}
                onKeyUp={() => {
                  void trigger("accountNumber");
                }}
                value={Account_number}
              />
            </div>

            <div className="animate__animated btn-sticky">
              <ButtonUI
                onClick={saveAccountNo}
                ariaLabel="Link Bank Account"
                type={"submit"}
                disabled={!isDirty || !isValid}
              >
                Link account
              </ButtonUI>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    selected_bank: state.LandingReducer.user.bank_details.selected_bank,
    selected_branch_ifsc:
      state.LandingReducer.user.bank_details.selected_branch_IFSC,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAccountDetails);
