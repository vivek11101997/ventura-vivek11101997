import React, { useEffect, useState } from "react";
import style from "./kra.module.css";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import AxiosInstance from "../../../Api/Axios/axios";
import { connect } from "react-redux";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import { mobileRegister } from "../../../global/path/redirectPath";

const KraDataCard = (props) => {
  const { KraData } = props;
  const [fatherName, setFatherName] = useState("");
  const [nameEditMode, setNameEditMode] = useState(false);
  const [userData, setUser] = useState({});

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || ""
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
    setUser(userData);
  }, []);

  useEffect(() => {
    KraData && setFatherName(KraData.fathers_name);
  }, [KraData]);

  const handleNameChange = async () => {
    setNameEditMode(false);

    const UserFromLocalStorage = userData;
    UserFromLocalStorage["fatherName"] = fatherName;

    SetItemToLocalStorage("user", UserFromLocalStorage);

    const { data, status } = await AxiosInstance.put(
      `/signup/parent-name/update`,
      {
        phone: userData.phone,
        "new name": fatherName,
      }
    );
  };
  const handleClose = () => {
    setNameEditMode(false);
  };
  return (
    <div className={style.card}>
      <ul className={style.container__list}>
        <li className={style.listItem}>
          <div className={style.key}>Name</div>
          <div className={style.value}>{KraData.name}</div>
        </li>
        <li className={style.listItem}>
          <div className={style.key}>Father's Name</div>
          <div className={`${style.outer_div} ${style.fatherValueBox}`}>
            {nameEditMode && (
              <>
                <div className={style.value}>
                  <input
                    type="text"
                    className={`form-control ${style.fatherNameEdit}`}
                    maxLength={45}
                    value={fatherName}
                    onChange={(e) =>
                      setFatherName(e.target.value.replace(/[^a-z]/gi, ""))
                    }
                  />
                </div>
                <button
                  aria-label="Close"
                  onClick={handleClose}
                  className={`${style.btn} ${style.btnCancel}`}
                >
                  &times;
                </button>
                <button
                  aria-label="Save"
                  onClick={handleNameChange}
                  className={`${style.btn} ${style.btnSave}`}
                >
                  Save
                  <span className={`icon-Arrow ${style.editArrow}`}></span>
                </button>
              </>
            )}
            {!nameEditMode && userData && userData.fatherName && (
              <div className={`${style.value} ${style.lblFatherName}`}>    {userData.fatherName}
              </div>)}
            {!nameEditMode && !(userData && userData.fatherName) && (
              <div className={[style.lblFatherName, style.value].join(" ")}>    {KraData.fathers_name}
              </div>)}

            {!nameEditMode && (
              <button
                aria-label="Edit"
                onClick={() => setNameEditMode(true)}
                className={style.btn}
              >
                Edit
                <span className={`icon-Arrow ${style.editArrow}`}></span>
              </button>
            )}
          </div>
        </li>
        <li className={style.listItem}>
          <div className={style.key}>DOB</div>
          <div className={style.value}>{KraData.dob}</div>
        </li>
        <li className={style.listItem}>
          <div className={style.key}>Gender</div>
          <div className={style.value}>{KraData.gender}</div>
        </li>
        <li className={style.listItem}>
          <div className={style.key}>Address</div>
          <div className={style.value}>{KraData.permanent_address}</div>
        </li>
      </ul>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(KraDataCard);
