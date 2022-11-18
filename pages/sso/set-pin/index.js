import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import Loader from "../../../components/ui/Loader/Loader.component";
import ErrorModal from "../../../components/ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import {useRouter} from "next/router";

const SetPin = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Button Disabled State
  const [isDisabled, setIsDisabled] = useState(true);

  const [userDetails, setUserDetails] = useState([]);
  const {  handleSubmit, reset } = useForm();
const router=useRouter();
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

  useEffect(() => {
    const newUserDetails = localStorage.getItem("userDetails");
    setUserDetails(JSON.parse(newUserDetails));
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let APIData = {
        client_id: userDetails.client_id,
        pan: data.panNumber,
        journey: process.env.VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN,
      };
      setIsLoading(true);
      const getData = await AxiosInstance.post(
        `https://sso.ventura1.com/auth/user/pan/v3/validateuser`,
        APIData,
      );
      if (getData.status === 200) {
        void router.push("/sso/enter-otp");
      } else {
        setIsLoading(false);
        setIsDisabled(true);
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
      reset();
    } catch (error) {
      // Error If Something Goes Wrong
      setIsLoading(false);
      setIsDisabled(true);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
      reset();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <div className="welcomeBack">
            Welcome back, {userDetails && userDetails.fname}
          </div>
          <h2 className="title animate">Set up PIN</h2>
          <p className="subTitle animate">
            Choose a PIN that you can remember and that others can't guess.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="animate__animated">
              <ButtonUI
                type={"submit"}
                id="btn"
                disabled={isDisabled}
                ariaLabel="Login"
              >
                Set PIN
              </ButtonUI>
            </div>
          </form>
        </div>
        <div className="bottomLabelInfo">
          NRI customers are requested to use <br />
          <a>client ID</a> or <a>email</a> to login.
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPin);
