import React, { useState, useEffect } from "react";
import style from "./NomineeList.module.css";
import { connect } from "react-redux";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import moment from "moment";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { useRouter } from "next/router";
import { addNominee, mobileRegister, nomineeLanding } from "../../../global/path/redirectPath";
import ErrorModal from "../../ui/Modal/ErrorModal.component";

const NomineeAllocation = (props) => {
  const router = useRouter();
  const { nomineeList, redirectTo } = props;

  const [user, setUser] = useState();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || ""
    if (!localUserData || localUserData === "") {
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      })
    }
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;

    userData && setUser(userData);

    if (router.query.hasOwnProperty("redirect")) {
      setRedirect(router.query.redirect);
    }
  }, []);

  const calculateAge = (birthDate) => {
    const birthYear = moment(birthDate, "DD/MM/YYYY").format("YYYY");
    const birthMonth = moment(birthDate, "DD/MM/YYYY").format("MM");

    //current Date - birth Year
    let age = moment().format("YYYY") - parseInt(birthYear);
    if (age === 0) {
      let age_In_Month = parseInt(moment().format("MM")) - parseInt(birthMonth);
      age = `${age_In_Month} months`;
    } else {
      age = `${age} years`;
    }
    return age;
  };

  const HandelRemoveNominee = async (index) => {
    try {
      nomineeList.splice(index, 1);
      nomineeList.map((item) => {
        item["nominee_share"] = Math.round(100 / nomineeList.length);
      });

      const resp = await AxiosInstance.post(`/signup/user/nominee/add`, {
        phone: user.phone,
        nominee_data: [...nomineeList],
      });
      if (resp.status === 200) {
        void router.push(nomineeList);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: resp.error.message,
          showHide: true,
          redirectTo: nomineeLanding
        });
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: nomineeLanding
      });
    }
  };

  const HandleEditNominee = (index) => {
    if (redirectTo === "P") {
      void router.push({
        pathname: addNominee,
        query: { edit: index + 1, redirect: redirect },
      })
    }
    else {
      void router.push({
        pathname: addNominee,
        query: { edit: index + 1 },
      });
    }
  };

  const ErrorAllocation = (
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
      {ErrorAllocation}
      {nomineeList &&
        nomineeList.map(
          ({ name, relation, nominee_share, address, dob }, index) => (

            <div
              key={index}
              className={`${redirectTo === "P" && `previewNomineeCard`
                } animate__animated ${style.nomineeCard} `}
            >

              <div className={style.nomineeHeader}>
                <div className={style.headLeft}>
                  <h3 className={style.nomineeTitle}>{name}</h3>
                  <p>
                    <strong>{relation},</strong> {calculateAge(dob)}
                  </p>
                </div>

                <div className={style.headRight}>{nominee_share}%</div>
              </div>

              <div className={style.nomineeBody}>
                <div className={style.cardBodyLeft}>
                  <p className={style.addressLabel}>Address</p>
                  <p className={style.address}>{address}</p>
                </div>

                <div className={style.cardBodyRight}>
                  <button
                    aria-label="Edit Nominee"
                    onClick={() => HandleEditNominee(index)}
                    className={style.editButton}
                  >
                    <a className={`icon-Edit`}></a>
                  </button>
                </div>
              </div>

              {nomineeList.length > 1 && (
                <div className={style.nomineeFooter}>
                  <button
                    aria-label="Remove Nominee"
                    onClick={() => HandelRemoveNominee(index)}
                    className={style.btnRemove}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NomineeAllocation);
