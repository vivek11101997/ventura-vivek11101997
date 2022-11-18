import React, { useState, useEffect } from "react";
import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import Modal from "../../../components/ui/Modal/Modal.component";
import { connect } from "react-redux";
import styles from '../../../components/clientOnboarding/TakeSelfie/TakeSelfie.module.css';
import { TOGGLE_MODAL } from "../../../Redux/modal";
import AccessDenied from "../../../components/ui/Popups/Accessdenied/Accessdenied";
import HyperVerge from "../../../pages/try.jsx";

import ShareLink from "../../../components/ui/Popups/Sharelink/Sharelink.component";
import Script from "next/script";
import { useRouter } from 'next/router'
import SelfiePreviewComponent from "../../../components/clientOnboarding/TakeSelfie/SelfiePreview.component";
import { welcome } from "../../../global/path/redirectPath";

const SelfieSendLink = (props) => {
  const router = useRouter();
  const [upload, setUpload] = useState(false);
  const [uploadLink, setUploadLink] = useState(false);
  const [base64ImageReceived, setBase64ImageReceived] = useState(false);
  const [base64Image, setBase64Image] = useState("");

  const { showModal, toggleModal } = props;
  const [access, setAccess] = useState(false);

  const jwtToken = process.env.HYPERVERGE_JWT_TOKEN;

  function hyperSnapSDKInit() {
    window.HyperSnapSDK.init(
      jwtToken,
      window.HyperSnapParams.Region.AsiaPacific
    );
  }

  const handler = (HVError, HVResponse) => {
    if (!HVError) {
      setBase64Image(HVResponse.imgBase64);
      setBase64ImageReceived(true);
      toggleModal();
    }
  };

  const openCamera = () => {
    //liveness module

    hyperSnapSDKInit();
    window.HyperSnapSDK.startUserSession("test");

    const hvFaceConfig = new window.HVFaceConfig();
    hvFaceConfig.setShouldShowInstructionPage(true);

    window.HVFaceModule.start(hvFaceConfig, handler);
  };

  const pullAccessData = (data) => {
    let dataval = data.toUpperCase();
    switch (dataval) {
      case "PERMISSION":
        setUpload(true);
        setUploadLink(false);
        setAccess(false);
        break;
      case "SHARELINK":
        setUpload(false);
        setUploadLink(true);
        setAccess(false);
        break;
    }
  };
  const ShareLinkFc = () => {
    toggleModal();
    setUpload(false);
    setUploadLink(true);
    setAccess(false);
  };

  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
    router.beforePopState(() => router.push(welcome));
  }, []);

  return (
    <>
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate__animated">Take a Selfie</h2>
          <p className="subTitle animate__animated">
            Ensure your face appears clearly within the frame
          </p>
          <div className={`animate__animated ${styles.RememberList}`}>
            <h3 className={styles.ListTitle}>Please remember to:</h3>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Glass"></span>
              </div>
              <p className={styles.stepText}>
                Avoid caps, hats, glasses, sunglasses.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-face"></span>
              </div>
              <p className={styles.stepText}>‍Keep your face straight.</p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-clear-picture"></span>
              </div>
              <p className={styles.stepText}>Take a clear picture.</p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-bright-area"></span>
              </div>
              <p className={styles.stepText}>Be in a bright area.</p>
            </div>
          </div>
          <p className={` animate__animated ${styles.info}`}>
            These details are required by SEBI to open your demat account.
          </p>
          <div className="animate__animated btn-sticky">
            <ButtonUI type={"submit"} onClick={openCamera}>
              Open camera
            </ButtonUI>
          </div>

          {showModal && (
            <>
              {upload && (
                <Modal ModalType="signature_modal" onClick={toggleModal}>
                  <HyperVerge />
                </Modal>
              )}
              {uploadLink && (
                <Modal ModalType="signature_modal" onClick={toggleModal}>
                  <ShareLink />
                </Modal>
              )}
              {base64ImageReceived && (
                <Modal ModalType="signature_modal" onClick={toggleModal}>
                  <SelfiePreviewComponent base64Image={base64Image} />
                </Modal>
              )}

              {access && (
                <Modal ModalType="panValidation" onClick={toggleModal}>
                  <AccessDenied func={pullAccessData} journey="takeselfie" />
                </Modal>
              )}
            </>
          )}
          {showModal && base64Image && (
            <Modal ModalType="signature_modal" onClick={toggleModal}>
              <SelfiePreviewComponent base64Image={base64Image} />
            </Modal>
          )}
        </div>
        <Script src="https://hv-camera-web-sg.s3.ap-southeast-1.amazonaws.com/hyperverge-web-sdk@5.2.4/src/sdk.min.js"></Script>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelfieSendLink);
