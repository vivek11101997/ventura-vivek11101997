import React, { useState, useEffect } from "react";
import ButtonUI from "../../ui/Button.component";
import styles from "../WelcomToVentura/AddSignature/Signature.module.css";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Loader from "../../ui/Loader/Loader.component";
import GetUserDataFromLocalStorage from "./../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import AxiosInstance from "./../../../Api/Axios/axios";
import { addNominee, mobileRegister, nomineeList, yourSegment } from "../../../global/path/redirectPath";

const NomineeLanding = (props) => {
  const [addedNomineeCount, setNomineeCount] = useState(0);
  const [user, setUser] = useState();
  const [isLoading, setLoding] = useState(false);
  const router = useRouter();
  const maxNomineeCount = 3;

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || ""
    if (!localUserData || localUserData === "") {
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister
      })
    }


    const userData = localUserData && typeof localUserData === "string"

      ? JSON.parse(localUserData)

      : localUserData;
    setUser(userData);
  }, []);

  const handleSegment = () => {
    void router.push(yourSegment);
  };

  const handleAddNominee = () => {
    void router.push(addNominee);
  };

  const alreadyExistedNomineeData = async () => {
    try {
      setLoding(true);
      const getAlreadyExistNominee = await AxiosInstance.post(
        `/signup/user/nominee/details`,

        { phone: parseInt(user.phone) }
      );
      setLoding(false);
      if (getAlreadyExistNominee.status === 200) {
        const alreadyAddedNomineeCount = getAlreadyExistNominee.data.nominee_data.length;
        setNomineeCount(alreadyAddedNomineeCount);
        if (alreadyAddedNomineeCount === maxNomineeCount) {
          setLoding(true);
          void router.push(nomineeList);
        }
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getAlreadyExistNominee.error.message,
          showHide: true,
        });
      }
    } catch (error) {
      setLoding(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };

  useEffect(() => {
    user && alreadyExistedNomineeData();
  }, [user]);

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
      {Error}
      {isLoading && <Loader />}
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate__animated">Add a nominee</h2>
          <p className="subTitle animate__animated">
            Nominate someone you trust to keep your finances secure.
          </p>
          <div className={`animate__animated ${styles.RememberList}`}>
            <h3 className={styles.ListTitle}>Please remember:</h3>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Signature-box"></span>
              </div>
              <p className={styles.stepText}>You can add upto 3 nominees.</p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Image"></span>
              </div>
              <p className={styles.stepText}>
                PAN or Aadhaar number of the nominee is required.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-clear-picture"></span>
              </div>
              <p className={styles.stepText}>
                You can add nominee(s) now or later from the profile section.
              </p>
            </div>
          </div>
          <div className="animate__animated">
            <ButtonUI onClick={handleAddNominee} type={"submit"}>
              Add nominee
            </ButtonUI>
            <div className="textCenter pt20 animate__animated">
              {addedNomineeCount >= 1 && (
                <a
                  onClick={handleSegment}
                  className="btnLInk"
                  aria-label="Skip For Now"
                >
                  Skip for now
                </a>
              )}
            </div>
          </div>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NomineeLanding);
