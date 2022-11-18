import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../global/Header.component";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Loader from "./../../ui/Loader/Loader.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import InputRadio from "../../global/inputRadio";
import { addOccupationStatus, addTradingExperience, mobileRegister } from "../../../global/path/redirectPath";

const IncomeRange = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();
  const [sessionId, setSessionId] = useState();
  // Creating Router For Routing Purpose
  const router = useRouter();
  const [incomeRangeList, setIncomeRangeList] = useState([]);

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
        `/signup/static/user/income-range`,

      );
      const response = await getData.data;
      setIncomeRangeList(response.income_range);
      setIsLoading(false);
    } catch (error) {
      if (error) {
        let errorMessage;
        if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = (error.response &&
            error.response.data &&
            error.response.data.message) ||
            process.errorMessage;
        }
        props.setError({
          isError: true,
          ErrorMsg: errorMessage,
          showHide: true,
        });
      }
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

    router.beforePopState(() => {
      void router.push(addOccupationStatus);
    });
  }, []);

  useEffect(() => {
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

  const postAnnualIncome = async (status) => {
    let data = {
      phone: user.phone,
      "income-range": parseInt(status),
    };
    setIsLoading(true);
    try {
      const postData = await AxiosInstance.put(
        `/signup/user/income-range/update`,
        data,

      );
      if (postData.status === 200) {
        void router.push(addTradingExperience);
      }
      else {
        props.setError({
          isError: true,
          ErrorMsg: postData.data.message,
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

  function handleChange(event) {
    void postAnnualIncome(event.target.value);
  }
  function accessiblityHandler(status) {
    void postAnnualIncome(status);
  }
  return (
    <>
      {isLoading && <Loader />}
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate">Your annual income</h2>
          <p className="subTitle animate">
            These details are required by SEBI to open your demat account.
          </p>
          {incomeRangeList.map((list, index) => {
            return (
              <InputRadio
                name="occupation"
                key={index}
                id={`income${index}`}
                listId={list.income_range_id_incr}
                value={list.income_range_type}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: () => dispatch(HIDE_ERROR_MODAL()),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IncomeRange);
