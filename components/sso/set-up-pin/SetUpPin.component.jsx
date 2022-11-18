import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import Header from "../../global/Header.component";
import ReEnterPin from "../../global/reEnterPin/ReEnterPin.component";
import Loader from "../../ui/Loader/Loader.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import Modal from "../../ui/Modal/Modal.component";
import PINSetSuccessfully from "../../ui/Popups/PINSetSuccessfully/PINSetSuccessfully";
import CryptoJS from "crypto-js";
const SetUpPin = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const { register, setValue, handleSubmit, reset, watch } = useForm();

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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Destructuring All the Input
      const { otpFirst, otpSecond, otpThird, otpFourth } = data;

      // Storing all input in one variable
      const otp = `${otpFirst}${otpSecond}${otpThird}${otpFourth}`;

      const md5Hash = CryptoJS.MD5(otp);
      // Sending data to API
      const APIData = {
        client_id: userDetails.client_id,
        pin: md5Hash.toString(),
      };

      const getData = await AxiosInstance.post(`/v3/setpin`, APIData, {
        headers: {
          Authorization: `Bearer ${userDetails.auth_token}`,
        },
      });

      if (getData.status === 200) {
        setIsLoading(false);
        props.toggleModal();
      } else {
        setIsLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
        reset();
      }
    } catch (error) {
      setIsLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });

      reset();
    }
  };

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("userDetails") || "";

    if (localUserData) {
      const userData =
        typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      setUserDetails(userData);
    }
  }, []);

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
      {props.showModal && (
        <Modal onClick={props.toggleModal}>
          <PINSetSuccessfully />
        </Modal>
      )}
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="welcomeBack animate">
            Welcome back, {userDetails && userDetails.fname}
          </div>
          <div className="setUpPinWrap">
            <h2 className="title animate ">Set up PIN</h2>
            <p className="subTitle animate ">
              Choose a PIN that you can remember and that <br />
              others can't guess.
            </p>
            <form aria-label="reEnter form" onSubmit={handleSubmit(onSubmit)}>
              <ReEnterPin
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetUpPin);
