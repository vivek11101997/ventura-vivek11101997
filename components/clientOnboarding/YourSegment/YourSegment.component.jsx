import React, { useEffect, useState } from "react";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import styles from "./yourSegment.module.css";
import Loader from "./../../ui/Loader/Loader.component";
import AxiosInstance from "../../../Api/Axios/axios";
import { useRouter } from "next/router";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { connect } from "react-redux";
import { mobileRegister, preview, segmentUploadProof, welcome } from "../../../global/path/redirectPath";
const YourSegment = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [user, setUser] = useState("");
  const [segmentList, setSegmentList] = useState([]);
  const [checkedVal, setCheckedVal] = useState([]);
  const [checkedValDefault, setCheckedValDefault] = useState(["Cash", "Mf"]);
  const [postSegmentArray, setCheckedValDefaultd] = useState();
  const [isDisabled, setisDisabled] = useState(false);
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("");
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
  useEffect(() => {
    setCheckedValDefaultd([...checkedValDefault, ...checkedVal]);
  }, [checkedValDefault, checkedVal]);

  useEffect(() => {
    if (postSegmentArray?.length < 1) {
      setisDisabled(true);
    } else {
      setisDisabled(false);
    }
  }, [postSegmentArray]);

  const getSegment = async () => {
    try {
      setIsLoading(true);
      const getData = await AxiosInstance.get("/signup/static/mkt/segments");
      const response = await getData.data;
      if (getData.status === 200) {
        setSegmentList(response.segments);
        setIsLoading(false);
      } else {
        setIsLoading(false);
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
    const session = GetSessionIdFromSessionStorage("session") || "";
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    if (!localUserData || localUserData === "") {
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
      })
    }

    session && session.session_id && setSessionId(session.session_id);
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }

  }, []);

  useEffect(() => {
    sessionId && void getSegment();
  }, [sessionId]);

  const handleCheckBoxOnChange = (e, segment) => {
    if (e.target.checked) {
      setCheckedVal((checkedVal) => [...checkedVal, segment]);
    } else {
      setCheckedVal((checkedVal) =>
        checkedVal.filter((checkedVal) => checkedVal !== segment)
      );
    }
  };
  const handleDefaultCheckBoxOnChange = (e, segment) => {
    if (e.target.checked) {
      setCheckedValDefault((checkedVal) => [...checkedVal, segment]);
    } else {
      setCheckedValDefault((checkedVal) =>
        checkedVal.filter((checkedVal) => checkedVal !== segment)
      );
    }
  };

  const getMatch = (a, b) => {
    let matches = [];
    for (let i = 0; i < a.length; i++) {
      for (let e = 0; e < b.length; e++) {
        if (a[i] === b[e]) matches.push(a[i]);
      }
    }
    return matches;
  };
  const postSegment = async () => {
    let arraySeg = segmentList.slice(2, 8);
    let arrayPostSeg = postSegmentArray;
    const checksegment = getMatch(arraySeg, postSegmentArray);

    if (checksegment.length > 0) {
      setIsLoading(true);
      const data = {
        phone: user.phone,
        "mkt-segments": postSegmentArray,
      };
      const postData = await AxiosInstance.put(
        "/signup/user/mkt-segment/update",
        data
      );
      if (postData.status === 200) {
        redirectTo === "P" ? void router.push(`${segmentUploadProof}?redirect=P`) : void router.push(segmentUploadProof);
      }
    } else if (checksegment.length === 0) {
      let object = user;
      object["step"] = 4;
      SetItemToLocalStorage("user", object);
      void router.push(welcome);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      {Error}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="animate__animated title">Your segments</h2>
          <p className="subTitle animate__animated">
            We've added these segments to get you started.
          </p>
          <div className={styles.defaultsegments}>
            {segmentList.slice(0, 2).map((segment, index) => {
              return (
                <div
                  key={index}
                  className={`animate__animated checkBox ${styles.chkSegment} ${styles.typeEquity}`}
                >
                  <div className={styles.iconWrap}>
                    <span className="icon-Mutual-Funds"></span>
                  </div>
                  <span className={styles.title}> {segment} </span>
                  <input
                    type="checkbox"
                    id={segment}
                    defaultChecked="checked"
                    onChange={(e) => handleDefaultCheckBoxOnChange(e, segment)}
                  />
                  <label aria-label={segment} htmlFor={segment}></label>
                </div>
              );
            })}
          </div>

          <h3 className={`animate__animated ${styles.subTitle}`}>
            Wait, there's more
          </h3>
          <p className={`animate__animated ${styles.subPara}`}>
            You can add this segment now or later from your profile section.
          </p>

          {segmentList.slice(2, 8).map((segment, index) => {
            return (
              <div
                key={index}
                className={`animate__animated checkBox ${styles.chkSegment} ${styles.typeFutureOption}`}
              >
                <div className={styles.iconWrap}>
                  <span className="icon-Futures-and-Options"></span>
                </div>
                <span className={styles.title}>{segment}</span>
                <input
                  type="checkbox"
                  id={index}
                  onChange={(e) => handleCheckBoxOnChange(e, segment)}
                />
                <label aria-label={segment} htmlFor={index}></label>
              </div>
            );
          })}

          <div className="animate__animated pb20">
            <ButtonUI
              onClick={postSegment}
              ariaLabel={"Continue"}
              type={"submit"}
              disabled={isDisabled}
            >
              Continue
            </ButtonUI>
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
    redirectTo: state.LandingReducer.error.redirectTo,
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

export default connect(mapStateToProps, mapDispatchToProps)(YourSegment);
