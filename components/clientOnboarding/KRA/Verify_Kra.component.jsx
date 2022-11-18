import "react-datepicker/dist/react-datepicker.css";
import style from "./kra.module.css";
import DatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import ButtonUI from "../../ui/Button.component";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import { HIDE_ERROR_MODAL, SET_ERROR, STORE_DOB } from "../../../Redux/Landing";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import moment from "moment";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import { kraDetails, kycLanding, mobileRegister } from "../../../global/path/redirectPath";

const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd/mm/yyyy HH:MM");

const VerifyKra = (props) => {
  // Code for date picker min and max date setting
  // to set the minimum age limit  18 years
  const yy = new Date().getFullYear() - 18;
  // to set the maximum age limit 99 years
  const yyMin = new Date().getFullYear() - 99;
  const dd = new Date().getDate();
  const mm = new Date().getMonth();
  // Code for date picker min and max date settings END

  const router = useRouter();
  const [date, setDate] = useState(null);
  const [disableBtn, setDisableBtn] = useState(true);
  const [user, setUser] = useState();
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user");
    (!localUserData || localUserData === "") &&
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      });
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);

    router.beforePopState(() => {
      void router.push(kycLanding);
    });
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
    userData && userData.dob && checkAge(userData.dob)
  }, []);

  const handleDigiLocker = () => {
    void router.push(kycLanding);
  };

  const checkAge = (date) => {
    if (date) {
      let dob = moment(date).format("YYYY");
      let today = moment().format("YYYY");
      today - dob < 18 ? setDisableBtn(true) : setDisableBtn(false);
    }
  };

  const handleVerifyDOB = () => {
    void router.push(kraDetails);
  };

  const datePickerHandleChange = (date) => {
    checkAge(date);
    setDate(date);

    props.storeDob(
      new Date(date).toLocaleDateString("es-CL").replace(/-/g, "/").toString()
    );

    const object = user;
    object["dob"] = new Date(date)
      .toLocaleDateString("es-CL")
      .replace(/-/g, "/")
      .toString();
    SetItemToLocalStorage("user", object);
  };

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
    <section className="ContainerBG">
      {Error}
      <div className="containerMini">
        <h2 className="title animate__animated">Add your date of birth</h2>
        <p className={`subTitle animate__animated`}>
          These details are required by SEBI to open your demat account.
        </p>
        <div className="animate__animated datepickerWrap">
          {user && (
            <DatePicker
              className="form-control"
              placeholderText="DD/MM/YY"
              customInput={
                <MaskedInput
                  pipe={autoCorrectedDatePipe}
                  mask={[
                    /\d/,
                    /\d/,
                    "/",
                    /\d/,
                    /\d/,
                    "/",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  keepCharPositions={true}
                  guide={false}
                />
              }
              onChange={(date) => {
                datePickerHandleChange(date);
              }}
              selected={date}
              value={date || user.dob}
              showPopperArrow={false}
              minDate={new Date(yyMin, mm, dd)}
              maxDate={new Date(yy, mm, dd)}
              showMonthDropdown
              showYearDropdown
              dateFormat="dd/MM/yyyy"
              dateFormatCalendar="MMMM"
              yearDropdownItemNumber={99}
              scrollableYearDropdown
              popperClassName="datepicker"
              popperPlacement="top-start"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, -20],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    rootBoundary: "viewport",
                    tether: false,
                    altAxis: true,
                  },
                },
              ]}
            />
          )}
        </div>
        <div className={`animate__animated ${style.SliderTip}`}>
          KRA is a SEBI-registered agency that keeps KYC records. If Digilocker
          verification is not possible, you must complete KRA verification to
          proceed.
        </div>
        <div className="animate__animated">
          <ButtonUI disabled={disableBtn} onClick={handleVerifyDOB}>
            Verify
          </ButtonUI>
        </div>
        <div
          className={`animate__animated btnLInk ${style.retry}`}
          onClick={handleDigiLocker}
        >
          Retry DigiLocker e-KYC
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
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
    storeDob: (dob) => dispatch(STORE_DOB(dob)),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyKra);
