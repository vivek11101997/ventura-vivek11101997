import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { mobileRegister, signature, takeSelfie, } from "../../../global/path/redirectPath";
import { HIDE_ERROR_MODAL, SET_ERROR, SHOW_ERROR_MODAL } from "../../../Redux/Landing";
import ButtonUI from "../../ui/Button.component";
import Loader from "../../ui/Loader/Loader.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";

const SelfiePreview = (props) => {
  const { base64Image } = props;
  const router = useRouter();
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");


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

  const sendUploadLiveImage = async () => {
    try {
      setIsLoading(true);
      // Sending data to API
      const APIData = {
        phone: user.phone,
        file: base64Image,
      };

      const postUploadLiveImage = await AxiosInstance.post(
        "/signup/user/livephoto/upload",
        APIData
      );

      if (postUploadLiveImage.status === 200) {
        void router.push(signature);
      } else {
        // If Anything Goes Wrong then Display Modal With Error && Set Loading to True

        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: postUploadLiveImage.error.message,
          showHide: true,
          redirectTo: takeSelfie,
        });
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: takeSelfie,
      });
    }
  };

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      userData && setUser(userData);
      let fullName = userData.panName;
      const userName = fullName.split(" ");

      userName && setFirstName(userName[0]);
    }
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <h2 className="title animate__animated">
        Looking good,
        {user && user.panName && firstName || ""}!
      </h2>
      <img
        src={base64Image}
        alt="selfie Preview"
        className="selfiPreview"
        width="100%"
      />
      <ButtonUI onClick={sendUploadLiveImage}>Continue</ButtonUI>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelfiePreview);