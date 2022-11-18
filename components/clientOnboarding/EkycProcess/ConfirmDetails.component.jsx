import React, { useEffect, useState } from "react";
import Header from "../../global/Header.component";
import ButtonUI from "../../ui/Button.component";
import styles from "./CompleteEkyc.module.css";
import { useRouter } from "next/router";
import AxiosInstance from "../../../Api/Axios/axios";
import { connect } from "react-redux";
import Link from "next/link";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import { mobileRegister, uploadPan, welcome } from "../../../global/path/redirectPath";

const ConfirmDetails = (props) => {
  const [nameEditMode, setNameEditMode] = useState(false);
  const [fatherName, setFatherName] = useState("");
  const [userData, setUserData] = useState("");
  const router = useRouter();
  const { data } = props;
  const handleEKYC = () => {
    const object = userData;
    object["step"] = 1;
    SetItemToLocalStorage("user", object);
    void router.push(welcome);
  };

  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });

    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))

    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;

      userData && setUserData(userData);
    }
  }, []);

  const handleNameChange = async () => {
    setNameEditMode(false);
    await AxiosInstance.put(
      `/signup/parent-name/update`,
      {
        phone: userData.phone,
        "new name": fatherName,
      }
    );
  };

  const MoveToUploadPan = () => {
    void router.push(uploadPan);
  };
  return (
    <>
      {/* header start */}
      <Header />
      {/* header end */}

      {/* container start */}
      <section className="ContainerBG">
        {/* body bg */}

        {/* mini container */}
        <div className="containerMini">
          <h2 className="title animate__animated">Confirm your details</h2>
          <p className="subTitle animate__animated">
            We have fetched these details from Digilocker.
          </p>

          <div className={`${styles.card} ${styles.noPad} animate__animated`}>
            <div className={styles.cardHeader}></div>

            <div className={styles.cardBody}>
              <ul className={styles.confirmDetailsList}>
                <li>
                  <div className={styles.label}>Name</div>

                  <div className={styles.data}>
                    <div className={styles.dataValue}>{data.name}</div>
                  </div>
                </li>

                <li className={styles.listItem}>
                  <div className={styles.label}>Father's Name</div>
                  <div className={styles.data}>
                    {nameEditMode ? (
                      <div className={styles.dataValue}>
                        <input
                          type="text"
                          placeholder={"fatherName"}
                          onChange={(e) => setFatherName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className={styles.dataValue}>
                        {data["father’s name"]}
                      </div>
                    )}
                    {nameEditMode ? (
                      <Link href="">
                        <a
                          onClick={handleNameChange}
                          className={styles.editLink}
                        >
                          Save
                        </a>
                      </Link>
                    ) : (
                      <Link href="">
                        <a
                          onClick={() => setNameEditMode(true)}
                          className={styles.editLink}
                        >
                          Edit
                        </a>
                      </Link>
                    )}
                  </div>
                </li>

                <li>
                  <div className={styles.label}>DOB</div>

                  <div className={styles.data}>
                    <div className={styles.dataValue}>{data.dob}</div>
                  </div>
                </li>

                <li>
                  <div className={styles.label}>Gender</div>

                  <div className={styles.data}>
                    <div className={styles.dataValue}>{data.gender}</div>
                  </div>
                </li>

                <li>
                  <div className={styles.label}>Address</div>

                  <div className={styles.data}>
                    <div className={styles.dataValue}>
                      {data["correspondence address"]}
                    </div>
                  </div>
                </li>

                <li>
                  <div className={styles.label}>Aadhaar No.</div>

                  <div className={styles.data}>
                    <div className={styles.dataValue}>XXXX XXXX {Number(String(data["aadhar"]).slice(-4)) || ""}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={`${styles.PDetails} animate__animated `}>
            <div className={styles.PDetailsPic}>
              <img src="/images/personal_card.svg" alt="Personal Card" />
            </div>
            PAN linked with your Aadhaar Card
            {data.pan_found ? (
              <Link href={data.pan_url}>
                <a className={styles.editLink}>View</a>
              </Link>
            ) : (
              <div
                onClick={MoveToUploadPan}
                className={`btnLInk ${styles.editLink}`}
              >
                Link
              </div>
            )}
          </div>
          <div className="animate__animated">
            <ButtonUI onClick={handleEKYC}>Continue</ButtonUI>
          </div>
          <br />
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    dob: state.LandingReducer.user.dob || "",
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDetails);
