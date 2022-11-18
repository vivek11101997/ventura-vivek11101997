import React, { useState, useEffect } from "react";
import styles from "./Preview.module.css";
import ButtonUI from "../../ui/Button.component";
import PanDetails from "./PanDetails.component";
import AadhaarDetails from "./AadhaarDetails.component";
import BankDetails from "./BankDetails.component";
import PersonalDetails from "./personalDetails.component";
import UploadedDocuments from "./UploadedDocuments.component";
import NomineeDetails from "./NomineeDetails.component";
import Segment from "./Segment.component";
import Loader from "../../ui/Loader/Loader.component";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import ErrorModal from "../../ui/Modal/ErrorModal.component";

import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import { connect } from "react-redux";
import AxiosInstance from "../../../Api/Axios/axios";
import Header from "../../global/Header.component";
import { useRouter } from "next/router";
import { mobileRegister, preview } from "../../../global/path/redirectPath";

const PreviewMaster = (props) => {
  const [Loading, setLoading] = useState(false);
  const [PreviewData, setPreviewData] = useState();
  const [user, setUser] = useState();
  const router = useRouter();
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
    if (localUserData) {
      const userData =
        localUserData && typeof localUserData === "string"
          ? JSON.parse(localUserData)
          : localUserData;
      setUser(userData);
    }
  }, []);

  const getPreviewData = async () => {
    try {
      setLoading(true);
      const getPreview = await AxiosInstance.get(
        `/signup/user/details/get?phone=${user.phone}`
      );
      setLoading(false);
      if (getPreview.status === 200) {

        setPreviewData(getPreview.data);
      } else {
        props.setError({
          isError: true,
          ErrorMsg: getPreview.error.message,
          showHide: true,
          redirectTo: ""
        });
      }
    } catch (error) {
      setLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: ""
      });
    }
  };

  useEffect(() => {
    user && getPreviewData();
  }, [user]);

  const downloadFile = (dataUrl, filename) => {
    let link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const downloadPreviewData = async () => {
    try {
      setLoading(true);
      const { data, status } = await AxiosInstance.get(
        `/signup/user/details/pdf?phone=${user.phone}`
      );
      setLoading(false);
      if (status === 200) {
        downloadFile(data.data, "test.pdf");
      } else {
        props.setError({
          isError: true,
          ErrorMsg: data.message || process.env.errorMessage,
          showHide: true,
          redirectTo: preview

        });
      }
    } catch (error) {
      setLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: preview
      });
    }
  };

  const eSignApplication = async () => {
    try {
      const APIData = {
        phone: user.phone,
      };
      setLoading(true);
      const getESignApplication = await AxiosInstance.post(
        `/signup/user/esign/initate/web`,
        {
          ...APIData,
        }
      );

      if (getESignApplication.status === 200) {
        setLoading(false);
        getESignApplication &&
          getESignApplication.data &&
          getESignApplication.data.url &&
          void router.push(getESignApplication.data.url);
      } else {
        setLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: getESignApplication.error.message,
          showHide: true,
          redirectTo: preview
        });
      }
    } catch (error) {
      setLoading(false);
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
        redirectTo: preview
      });
    }
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
      {Loading && <Loader />}
      {Error}
      <Header />
      {PreviewData && (
        <section className="ContainerBG greenBand">
          <div className="containerLG">
            <h2 className="title animate__animated">You’re almost done</h2>
            <p className="animate__animated subTitle">
              Your application has been successfully created. Please verify all
              the details before eSigning.
            </p>
            <div className={`animate__animated ${styles.outerWrap}`}>
              <div className={styles.innerWrap}>
                {PreviewData && <PanDetails PreviewData={PreviewData} />}
                {PreviewData && <PersonalDetails PreviewData={PreviewData} />}
              </div>
              <div className={styles.innerWrap}>
                {PreviewData && <AadhaarDetails PreviewData={PreviewData} />}
                {PreviewData && <BankDetails PreviewData={PreviewData} />}
              </div>
            </div>
            <div className={`animate__animated ${styles.outerWrap}`}>
              {PreviewData && <UploadedDocuments PreviewData={PreviewData} />}
              {PreviewData && <NomineeDetails PreviewData={PreviewData} />}
              {PreviewData && <Segment PreviewData={PreviewData} />}
            </div>
            <div className={`animate__animated ${styles.esignBtn}`}>
              <ButtonUI onClick={eSignApplication} type={"submit"}>
                eSign application
              </ButtonUI>
            </div>
            <div className={`animate__animated ${styles.outerWrap}`}>
              <a
                onClick={downloadPreviewData}
                className={`btnLInk ${styles.btnPreview}`}
              >
                Preview application
              </a>
            </div>
          </div>
        </section>
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
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewMaster);
