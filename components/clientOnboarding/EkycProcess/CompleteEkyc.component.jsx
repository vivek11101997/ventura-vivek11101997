import React, { useState, useEffect } from "react";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./CompleteEkyc.module.css";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import { kra, mobileRegister, panDetails } from "../../../global/path/redirectPath";
import ErrorModal from "../../ui/Modal/ErrorModal.component";

const CompleteEkyc = (props) => {
  const router = useRouter();
  const [user, setUserData] = useState();

  useEffect(() => {

    const localUserData = GetUserDataFromLocalStorage("user") || ""
    if (localUserData === "" || !localUserData) {
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

    userData && setUserData(userData);
  }, []);


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

  const handleDigiLocker = () => {
    user &&
      void router.push({
        pathname: `https://api.digitallocker.gov.in/public/oauth2/1/authorize`,
        query: {
          client_id: process.env.digilockerClientID,
          redirect_uri: process.env.digilockerRedirectUrl,
          state: user.phone,
        },
      });
  };
  const startKRA = () => {
    void router.push(kra);
  };
  useEffect(() => {
    router.beforePopState(() => {
      void router.push(panDetails);
    });
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);
  return (
    <>
      {/* header start */}
      <Header />
      {Error}
      {/* header end */}

      {/* container start */}
      <section className="ContainerBG ">
        {/* body bg */}

        {/* mini container */}
        <div className="containerMini pb20">
          <h2 className="title animate__animated">Complete your e-KYC</h2>
          <p className="subTitle animate__animated">
            Make sure your mobile number is linked to your Aadhaar card.
          </p>

          <p className="animate__animated">
            <a
              aria-label="How To Link Aadhaar With Mobile"
              href=""
              className="btnLInk"
            >
              <u>How to link Aadhaar with mobile?</u>
            </a>
          </p>

          <div className={`${styles.card} animate__animated`}>
            <h3 className={styles.cardTitle}>How this works?</h3>

            <ul className={styles.iconList}>
              <li>
                <div className={styles.iconListPic}>
                  <img src="/images/digi_locker.svg" alt="DigiLocker Icon" />
                </div>
                You will be redirected to Digilocker for e-KYC.
              </li>

              <li>
                <div className={styles.iconListPic}>
                  <img
                    src="/images/members.svg"
                    alt="Member Logo"
                    className={styles.membersIcon}
                  />
                </div>
                It is a Govt of India initiative with 92.28 million trusted
                users.
              </li>

              <li>
                <div className={styles.iconListPic}>
                  <img src="/images/aadhar-icon.svg" alt="Aadhaar icon" />
                </div>
                You won’t need to enter your details manually as the required
                documents will be fetched.
              </li>
            </ul>
          </div>

          <div className={`${styles.my} animate__animated`}>
            <ButtonUI ariaLabel="Start e-KYC" onClick={handleDigiLocker}>
              Start e-KYC
            </ButtonUI>
          </div>

          <Link href={kra}>
            <a
              aria-label="Mobile Not Linked With Aadhaar"
              onClick={startKRA}
              className={`${styles.textPrimary}  btnLInk animate__animated`}
            >
              Mobile not linked with Aadhaar
            </a>
          </Link>
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
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteEkyc);
