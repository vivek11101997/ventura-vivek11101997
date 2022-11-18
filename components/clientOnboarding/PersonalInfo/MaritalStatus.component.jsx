import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../global/Header.component";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Loader from "./../../ui/Loader/Loader.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import InputRadio from "../../global/inputRadio";
import { addOccupationStatus, mobileRegister } from "../../../global/path/redirectPath";

const MaritalStatus = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Creating Router For Routing Purpose
  const router = useRouter();
  const [MaritalList, setMaritalList] = useState([]);
  const [session_id, setSessionId] = useState("");
  const [user, setUser] = useState();

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal errorMsg={props.errorMsg} onClick={props.hideErrorModal} redirectTo={props.redirectTo} />
      ) : null}
    </>
  );

  const getMaritalStatus = async () => {
    try {
      setIsLoading(true);
      const getData = await AxiosInstance.get(`/signup/user/marital-status`);
      const response = await getData.data;

      if (getData.status === 200) {
        setMaritalList(response.marital_list);
        setIsLoading(false);
      }
      else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }

    } catch (error) {
      setIsLoading(false);

      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });

    }
  };

  useEffect(() => {
    const session = GetSessionIdFromSessionStorage("session");
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
    session && session.session_id && setSessionId(session.session_id);
  }, []);

  useEffect(() => {
    session_id && getMaritalStatus();
  }, [session_id]);

  const postMaritalStatus = async (status) => {
    let data = {
      phone: user.phone,
      marital_status: status,
    };
    setIsLoading(true);
    try {
      const postData = await AxiosInstance.put(
        `/signup/user/marital-status/update`,
        data,

      );
      if (postData.status === 200) {
        void router.push(addOccupationStatus);
      }
    } catch (error) {
      if (error.message) {
        props.setError({
          isError: true,
          ErrorMsg: error.message,
          showHide: true,
        });
      } else {
        props.setError({
          isError: true,
          ErrorMsg:
            (error &&
              error.response &&
              error.response.data &&
              error.response.data.message) ||
            process.errorMessage,
          showHide: true,
        });
      }

      setIsLoading(false);
    }
  };

  function handleChange(event) {
    void postMaritalStatus(event.target.value);
  }

  function accessiblityHandler(status) {
    void postMaritalStatus(status);
  }

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
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate">Your marital status</h2>
          <p className="subTitle animate">
            These details are required by SEBI to open your demat account.
          </p>
          {MaritalList.map((list, index) => {
            return (
              <InputRadio
                name="maritalStatusRadio"
                key={index}
                listId={list}
                id={`MS${index}`}
                value={list}
                handleChange={handleChange}
                accessiblityHandler={accessiblityHandler}
              />
            );
          })}
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
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: () => dispatch(HIDE_ERROR_MODAL()),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaritalStatus);
