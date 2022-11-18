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

const SetNewPin = (props) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState("");
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
        client_id: user.client_id,
        newpin: md5Hash.toString(),
      };
      //
      const getData = await AxiosInstance.post(`/v3/updatepin`, APIData, {
        headers: {
          Authorization: `Bearer ${user.auth_token}`,
        },
      });

      if (getData.status === 200) {
        setIsLoading(false);
        props.toggleModal();
      } else {
        setIsLoading(false);
        setIsDisabled(true);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
        reset();
        setIsLoading(false);
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
      setUser(userData);
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
          <PINSetSuccessfully redirectUrl="/sso/enter-pin" />
        </Modal>
      )}
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="setUpPinWrap">
            <h2 className="title animate">Set new PIN</h2>
            <p className="subTitle animate">
              Your new PIN must be different from your last-used PIN.
            </p>
            <form aria-label="reEnter pin" onSubmit={handleSubmit(onSubmit)}>
              <ReEnterPin
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </form>
          </div>
        </div>
        <div className="bottomLabelInfo animate">
          NRI customers are requested to use <br />
          <a>client ID</a> or <a>email</a> to login.
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

export default connect(mapStateToProps, mapDispatchToProps)(SetNewPin);
