import React, { useState, useEffect } from "react";
import styles from "./AddSignaturePop.module.css";
import Signature from "./Signature.component";
import ButtonUI from "../../Button.component";
import AxiosInstance from "../../../../Api/Axios/axios";
import Dragdrop from "../../DragDrop/Dragdrop.component";
import { connect } from "react-redux";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../Modal/ErrorModal.component";
import Otherupload from "../../Otherupload";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";
import { useRouter } from "next/router";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import { mobileRegister, nomineeLanding, preview } from "../../../../global/path/redirectPath";
const AddSignaturePopup = (props) => {
  const [toggleState, setToggleState] = useState(1);
  const [sign, SetSign] = useState(null);
  const [signType, setSignType] = useState("");
  const [user, setUser] = useState();
  const [redirectTo, setRedirectTo] = useState("");
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const router = useRouter();

  const pull_drop = (data) => {
    SetSign(data);
    const [, type] = data.split(";")[0].split("/");
    setSignType(type);
  };

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
    userData && setUser(userData);
  }, []);

  useEffect(() => {
    if (router.query.hasOwnProperty("redirect")) {
      const redirectTo = router.query.redirect.replace(/['"]/g, "");
      setRedirectTo(redirectTo);
    }
  }, []);

  const getActiveClass = (index, className) =>
    toggleState === index ? className : "";

  const pull_data = (data) => {
    SetSign(data);
    const [, type] = data.split(";")[0].split("/");
    setSignType(type);
  };

  const onSubmit = async () => {
    props.func("showloader");
    try {
      const APIData = {
        phone: user.phone,
        file: sign,
      };
      const getData = await AxiosInstance.post(
        "/signup/user/signature/upload",
        APIData
      );
      if (getData.status === 200) {

        SetSign(null);
        if (redirectTo === "P") {

          void router.push(preview);
        } else {
          void router.push(nomineeLanding);
        }
        props.toggleModal();
      } else {
        props.func("hideloader");
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.func("hideloader");
      SetSign(null);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };
  const UploadPhoto = (event) => {
    event.preventDefault();
    SetSign(null);
    setToggleState(1);
  };
  const compInfo = {
    "maxSize": "5e+6",
    "fileErrorMsg": "File type must be jpeg, png, pdf",
    "infoMsg": "Supported files: jpeg, png, pdf",
    "filesaccept": {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "application/pdf": [],
    },
    "checkpassword": "true",
    "extensions": [".jpeg", ".jpg", ".png", ".pdf"],
    "fileSizeError": "file size should not be greater than 5mb"
  }

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
  return (
    <>
      {Error}
      {sign === null && (
        <div className="SignAdd">
          <div className="textCenter">
            <h2 className="title">Add your signature</h2>
            <p className="subTitle">
              Upload an image or use the signature-box to sign
            </p>
          </div>
          <div className={styles.tabwrap}>
            <ul className={styles.tablist}>
              <li
                className={`tabs ${getActiveClass(1, "activetabs")}`}
                aria-label="Upload Photo"
                onClick={() => toggleTab(1)}
              >
                Upload photo
              </li>
              <li
                className={`tabs ${getActiveClass(2, "activetabs")}`}
                aria-label="Use Signature Box"
                onClick={() => toggleTab(2)}
              >
                Use signature box
              </li>
            </ul>
            <div className="tabcontainer">
              <div className={`content ${getActiveClass(1, "active-content")}`}>
                <Dragdrop func={pull_data} compInfo={compInfo} />
                <Otherupload compInfo={compInfo} func={pull_drop} />
              </div>
              <div className={`content ${getActiveClass(2, "active-content")}`}>
                <Signature func={pull_data} />
              </div>
            </div>
          </div>
        </div>
      )}
      {sign && (
        <div className="SignAdded">
          <div className="textCenter">
            <h2 className="title">Signature added</h2>
            <p className="subTitle">Use the same signature as on your PAN. </p>
          </div>
          <div className={styles.SignBox}>
            {signType.toUpperCase() === "PDF" && (
              <iframe className={styles.SignBoxFrame} src={sign}></iframe>
            )}
            {signType.toUpperCase() !== "PDF" && (
              <img
                className={styles.SignBoxImg}
                src={sign}
                alt={"Signature Box"}
              />
            )}
            <button
              onClick={UploadPhoto}
              aria-label="Reset"
              className={styles.resetSignature}
            >
              <img src="/images/resetsignature.png" alt={"Reset Signature"} />
            </button>
          </div>
          <div className={styles.lookingDiff}>
            <p>Signature looking different?</p>
            <a
              href="#"
              aria-label="Upload Photo"
              onClick={UploadPhoto}
              className={styles.UploadPhoto}
            >
              Upload Photo
            </a>
          </div>

          <div className={styles.btnWrap}>
            <ButtonUI ariaLabel={"Continue"} onClick={onSubmit} type={"submit"}>
              Continue
            </ButtonUI>
          </div>
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
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
export default connect(mapStateToProps, mapDispatchToProps)(AddSignaturePopup);
