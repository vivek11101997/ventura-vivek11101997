import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../global/Header.component";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Loader from "./../../ui/Loader/Loader.component";
import ErrorModal from "./../../ui/Modal/ErrorModal.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import InputRadio from "../../global/inputRadio";

import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { addAnnualIncome, addMaritalStatus, mobileRegister } from "../../../global/path/redirectPath";

const Occupation = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState();
  const [user, setUser] = useState();
  // Creating Router For Routing Purpose
  const router = useRouter();
  const [occupationList, setOccupationList] = useState([]);

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal errorMsg={props.errorMsg} onClick={props.hideErrorModal} />
      ) : null}
    </>
  );

  const getIncomeRange = async () => {
    try {
      const getData = await AxiosInstance.get(
        `/signup/static/user/occupations`,

      );
      const response = await getData.data;
      if (getData.status === 200) {
        setOccupationList(response.occupations);
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
    router.beforePopState(() => {
      void router.push(addMaritalStatus);
    });

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
    sessionId && getIncomeRange();
  }, [sessionId]);

  useEffect(() => {
    // for animation of fields

    let lineItem = document.querySelectorAll(".animate");
    lineItem.forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
  }, [isLoading]);

  useEffect(() => {
    sessionId && getIncomeRange();
  }, [sessionId]);

  const postOccupationStatus = async (status) => {
    let data = {
      phone: user.phone,
      occupation: parseInt(status),
    };
    setIsLoading(true);

    try {
      const postData = await AxiosInstance.put(
        `/signup/user/occupation/update`,
        data,

      );
      if (postData.status === 200) {
        void router.push(addAnnualIncome);
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
    void postOccupationStatus(event.target.value);
  }
  function accessiblityHandler(status) {
    void postOccupationStatus(status);
  }
  return (
    <>
      {isLoading && <Loader />}
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate">Your occupation</h2>
          <p className="subTitle animate">
            These details are required by SEBI to open your demat account.
          </p>

          {occupationList.map((list, index) => {
            return (
              <InputRadio
                name="occupation"
                key={index}
                id={`oc${index}`}
                listId={list.occupation_detail_id_incr}
                value={list.occupation_type}
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
    phone: state.LandingReducer.user.phone,

    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: () => dispatch(HIDE_ERROR_MODAL()),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Occupation);
