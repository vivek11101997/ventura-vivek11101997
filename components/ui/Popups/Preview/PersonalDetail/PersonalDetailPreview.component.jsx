import React, { useState, useEffect } from "react";
import GetSessionIdFromSessionStorage from "../../../../../global/localStorage/GetSessionIdFromSessionStorage";
import ButtonUI from "./../../../Button.component";
import GetUserDataFromLocalStorage from "./../../../../../global/localStorage/GetUserDataFromLocalStorage";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SET_PERSONAL_DETAILS,
  SHOW_ERROR_MODAL,
} from "../../../../../Redux/Landing";
import { connect } from "react-redux";
import ErrorModal from "./../../../Modal/ErrorModal.component";
import AxiosInstance from "./../../../../../Api/Axios/axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TOGGLE_MODAL } from "../../../../../Redux/modal";
import { mobileRegister } from "../../../../../global/path/redirectPath";

const PersonalDetailPreview = (props) => {
  const [MaritalList, setMaritalList] = useState([]);
  const [OccupationsList, setOccupationsList] = useState([]);
  const [TradingExpList, setTradingExpList] = useState([]);
  const [IncomeList, setIncomeList] = useState([]);
  const [session_id, setSessionId] = useState("");
  const [selectedOccupationInEdit, setSelectedOccupationInEdit] = useState();
  const [selectedTradExpInEdit, setSelectedTradExpInEdit] = useState();
  const [selectedIncomeRangeInEdit, setSelectedIncomeRangeInEdit] = useState();
  const [user, setUser] = useState();
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

  const handle_Marital_Status = (event) => {
    setValue("marital_status", event.target.value);
  };

  const handle_occupations = (event) => {
    let Selected_occupation = OccupationsList.filter(
      (occ) => occ.occupation_type === event.target.value
    );

    setSelectedOccupationInEdit(
      Selected_occupation[0].occupation_detail_id_incr
    );
  };

  const handleTradingExp = (event) => {
    let selectedTradingExp = TradingExpList.filter(
      (exp) => exp.value === event.target.value
    );

    setSelectedTradExpInEdit(selectedTradingExp[0].exp_id);
  };

  const handleIncomeRange = (event) => {
    let selectedIncomeRange = IncomeList.filter(
      (range) => range.income_range_type === event.target.value
    );
    setSelectedIncomeRangeInEdit(selectedIncomeRange[0].income_range_id_incr);
  };

  const getPersonalData = async () => {
    try {
      const getData = await AxiosInstance.get(
        `/signup/user/details/get?phone=${user.phone}`
      );
      const response = await getData.data;
      if (getData.status === 200) {
        setValue(
          "income",
          response.personal_details.income_range.income_range,
          {
            shouldValidate: true,
          }
        );

        // setting occupation
        setValue(
          "occupations",
          response.personal_details.occupation.occupation,
          {
            shouldValidate: true,
          }
        );

        setValue(
          "trad_exp",
          response.personal_details.trading_experience.trading_experience,
          { shouldValidate: true }
        );

        setValue(
          "marital_status",
          response.personal_details.marital_status.marital_status,
          {
            shouldValidate: true,
          }
        );
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }

    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const getMaritalStatus = async () => {
    try {
      const getData = await AxiosInstance.get("/signup/user/marital-status");
      const response = await getData.data;
      if (getData.status === 200) {
        setMaritalList(response.marital_list);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const getOccupations = async () => {
    try {
      const getData = await AxiosInstance.get(
        "/signup/static/user/occupations"
      );
      const response = await getData.data;
      if (getData.status === 200) {
        setOccupationsList(response.occupations);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const getIncomeRange = async () => {
    try {

      const getData = await AxiosInstance.get(
        "/signup/static/user/income-range"
      );
      const response = await getData.data;
      if (getData.status === 200) {
        setIncomeList(response.income_range);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const getTradingExperience = async () => {
    try {


      const getData = await AxiosInstance.get(
        "/signup/user/trading/experience"
      );
      const response = await getData.data;
      if (getData.status === 200) {
        setTradingExpList(response.trading_experience);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  useEffect(() => {
    session_id && getMaritalStatus();
    session_id && getOccupations();
    session_id && getIncomeRange();
    session_id && getTradingExperience();
    session_id && getPersonalData();
  }, [session_id]);

  let validationObject = {
    marital_status: "",
    occupations: "",
    income: "",
    trad_exp: "",
  };

  const PersonalDetailSchema = yup.object().shape(validationObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
    trigger,
    getValues,
  } = useForm({
    mode: "all",
    defaultValues: {
      marital_status: "",
      occupations: "",
      income: "",
      trad_exp: "",
    },
    resolver: yupResolver(PersonalDetailSchema),
  });

  const updateMaritalStatus = async () => {
    const data = {
      phone: user.phone,
      marital_status: getValues("marital_status"),
    };
    try {
      const postData = await AxiosInstance.put(
        "/signup/user/marital-status/update",
        data
      );

      if (postData.status === 200) {
        return true;
      } else {
        props.setError({
          isError: true,
          ErrorMsg: postData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const updateOccupation = async () => {
    const data = {
      phone: user.phone,
      occupation: selectedOccupationInEdit,
    };

    try {
      const postData = await AxiosInstance.put(
        "/signup/user/occupation/update",
        data
      );

      if (postData.status === 200) {
        return true;
      } else {
        props.setError({
          isError: true,
          ErrorMsg: postData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const updateTradingExp = async () => {
    try {
      const putData = await AxiosInstance.put(
        `/signup/user/politically-exposed/status/update`,
        {
          phone: user.phone,
          exposed: "relatively",
          exp_id: parseInt(selectedTradExpInEdit),
        }
      );
      if (putData.status === 200) {
        return true;
      } else {
        props.setError({
          isError: true,
          ErrorMsg: putData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const updateIncomeRange = async () => {
    try {
      const putData = await AxiosInstance.put(
        `/signup/user/income-range/update`,
        {
          phone: user.phone,
          "income-range": parseInt(selectedIncomeRangeInEdit),
        }
      );

      if (putData.status === 200) {
      } else {
        props.setError({
          isError: true,
          ErrorMsg: putData.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  const onSubmit = () => {
    const maritalUpdateSatus = updateMaritalStatus();
    const updateOccupationStatus = updateOccupation();
    const updateTradingStatus = updateTradingExp();
    const updateIncomeStatus = updateIncomeRange();

    if (
      maritalUpdateSatus &&
      updateOccupationStatus &&
      updateTradingStatus &&
      updateIncomeStatus
    ) {
      props.storePersonalData({
        personal_details: {
          income: getValues("income"),
          marital_status: getValues("marital_status"),
          occupation: getValues("occupations"),
          trade_exp: getValues("trad_exp"),
        },
      });
      props.toggleModal();
    }
  };

  return (
    <>
      {Error}
      <div className="textCenter">
        <h2 className="title">Personal details</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="previewInfoEdit">
          <label>Marital Status</label>
          <div className="newRadioStyle">
            {MaritalList.map((list, index) => {
              return (
                <div className="radio-group" key={index}>
                  <input
                    id={list}
                    type="radio"
                    value={list}
                    {...register("marital_status", { required: true })}
                    onChange={handle_Marital_Status}
                  />
                  <label htmlFor={list}>{list}</label>
                </div>
              );
            })}
          </div>
          <label>Occupation</label>
          <div className="form-select">
            <select
              id="occupation"
              className="form-control"
              name="occupations"
              {...register("occupations", { required: true })}
              onChange={handle_occupations}
              onFocus={() => trigger("occupations")}
            >
              {OccupationsList.map((occupation) => (
                <option
                  key={occupation.occupation_detail_id_incr}
                  value={occupation.occupation_type}
                >
                  {occupation.occupation_type}
                </option>
              ))}
            </select>
          </div>

          <label>Annual income</label>
          <div className="form-select">
            <select
              {...register("income", { required: true })}
              id="income"
              className="form-control"
              name="income"
              onChange={handleIncomeRange}
            >
              {IncomeList.map((range) => (
                <option
                  key={range.income_range_id_incr}
                  value={range.income_range_type}
                >
                  {range.income_range_type}
                </option>
              ))}
            </select>
          </div>

          <label>Trading experience</label>
          <div className="form-select">
            <select
              {...register("trad_exp", { required: true })}
              id="trad_exp"
              className="form-control"
              name="trad_exp"
              onChange={handleTradingExp}
            >
              {TradingExpList.map((exp) => (
                <option key={exp.exp_id} value={exp.value}>
                  {exp.value}
                </option>
              ))}
            </select>
          </div>

          <ButtonUI type="submit" disabled={!isValid}>
            Save
          </ButtonUI>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    personalData: state.LandingReducer.user.personal_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    storePersonalData: (data) => dispatch(SET_PERSONAL_DETAILS(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalDetailPreview);
