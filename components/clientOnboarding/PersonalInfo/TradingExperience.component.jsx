import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import ButtonUI from "../../ui/Button.component";
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
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import InputRadio from "../../global/inputRadio";
import { addAnnualIncome, mobileRegister, welcome } from "../../../global/path/redirectPath";

const TradingExperience = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  // Creating Router For Routing Purpose
  const router = useRouter();
  const [occupationList, setOccupationList] = useState([]);
  const [selectedBox, setSelectedBox] = useState();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [user, setUser] = useState();
  const [sessionId, setSessionId] = useState();

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
        `/signup/user/trading/experience`,

      );
      const response = await getData.data;
      if (getData.status === 200) {
        setOccupationList(response.trading_experience);
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

    router.beforePopState(() => {
      void router.push(addAnnualIncome);
    });
  }, []);

  useEffect(() => {
    sessionId && getIncomeRange();
  }, [sessionId]);

  const postTradingExp = async () => {
    setIsLoading(true);
    try {
      const postData = await AxiosInstance.put(
        `/signup/user/politically-exposed/status/update`,
        {
          phone: user.phone,
          exposed: "relatively",
          exp_id: parseInt(selectedBox),
        },

      );
      if (postData.status === 200) {
        const object = user;
        object["step"] = 2;
        SetItemToLocalStorage("user", object);
        void router.push(welcome);
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
    setSelectedBox(event.target.value);
    setBtnDisabled(false);
  }
  function accessiblityHandler(status) {
    void setSelectedBox(status);
    setBtnDisabled(false);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
  };

  useEffect(() => {
    // for animation of fields
    let lineItem = document.querySelectorAll(".animate");
    lineItem.forEach((item, index) => {
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
          <h2 className="title animate">Your trading experience</h2>
          <p className="subTitle animate">
            These details are required by SEBI to open your demat account.
          </p>
          <div className="radioGroupMain">
            {occupationList.map((list, index) => {
              return (
                <InputRadio
                  name="occupation"
                  key={index}
                  id={`income${index}`}
                  listId={list.exp_id}
                  value={list.value}
                  handleChange={handleChange}
                  accessiblityHandler={accessiblityHandler}
                />


              );
            })}
          </div>
          <form onSubmit={onSubmit}>
            <div className="checkBox  animate ">
              <input
                type="checkbox"
                name="political"
                id="politicallyExposed"
                defaultChecked={true}
              />
              <label htmlFor="politicallyExposed" tabIndex={1}>
                I am not a politically exposed person
              </label>
            </div>
            <div className="animate ">
              <ButtonUI
                type={"submit"}
                onClick={postTradingExp}
                disabled={btnDisabled}
                tabIndex={1}
              >
                Continue
              </ButtonUI>
            </div>
          </form>
          <br />
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

export default connect(mapStateToProps, mapDispatchToProps)(TradingExperience);
