import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Api/Axios/axios";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ButtonUI from "../../ui/Button.component";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import NomineeAllocation from "./NomineeAllocation.component";
import ErrorModal from "../../ui/Modal/ErrorModal.component"
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import {
  addNominee,
  mobileRegister,
  yourSegment,
} from "../../../global/path/redirectPath";

const NomineeListItem = (props) => {
  const router = useRouter();
  const [nomineeList, setNomineeList] = useState([]);
  const [sessionId, setSessionId] = useState("");

  const [user, setUser] = useState();

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
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
    const session = GetSessionIdFromSessionStorage("session");

    session && setSessionId(session.session_id);

    userData && setUser(userData);

    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);

  useEffect(() => {
    sessionId && void getNomineeList();
  }, [sessionId]);

  const getNomineeList = async () => {
    try {
      const getNomineeData = await AxiosInstance.post(
        `/signup/user/nominee/details`,
        { phone: user.phone }
      );
      if (getNomineeData.status === 200) {

        setNomineeList(getNomineeData.data.nominee_data);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getNomineeData.error.message,
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
  const AddNewNominee = () => {
    void router.push(addNominee);
  };

  const handleSegment = () => {
    void router.push(yourSegment);
  };

  const Error = (
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
      <section className="ContainerBG">
        {Error}
        {/* body bg */}
        <div className="containerMini">
          <h2 className="title animate__animated">Your nominee(s)</h2>
          <p className="subTitle animate__animated">
            You can add/remove nominees now or later from your profile.
          </p>

          <NomineeAllocation nomineeList={nomineeList} NomineeAllocation="N" />

          <div className="animate__animated pb20">
            <ButtonUI onClick={handleSegment}>Continue</ButtonUI>
          </div>

          {nomineeList.length < 3 && (
            <div
              className="btnLInk textCenter pb20 animate__animated"
              onClick={AddNewNominee}
            >
              Add another nominee
            </div>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(NomineeListItem);
