import React, { useState, useEffect } from "react";
import Header from "../../../global/Header.component";
import ButtonUI from "../../../ui/Button.component";
import Modal from "../../../ui/Modal/Modal.component";
import { connect } from "react-redux";
import styles from "./Signature.module.css";
import AddSignaturePopup from "../../../ui/Popups/AddSignaturePop/AddSignaturePop.component";
import { TOGGLE_MODAL } from "../../../../Redux/modal";
import Loader from "../../../ui/Loader/Loader.component";
const AddSignature = (props) => {
  const { showModal, toggleModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const pull_data = (data) => {
    const dataCase=data.toUpperCase() 
    switch(dataCase)
    {
      case "SHOWLOADER":
        setIsLoading(true);
        break;

        case "HIDELOADER":
          setIsLoading(false);
        break;
    }
  };
  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
  item.className += " animate__fadeInUp animate__delay_" + index;
});
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title animate__animated">Add your signature</h2>
          <p className="subTitle animate__animated">
            Use the signature-box to sign using your mouse/finger/stylus.
          </p>
          <div className={`animate__animated ${styles.RememberList}`}>
            <h3 className={styles.ListTitle}>Please remember:</h3>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Signature-box"></span>
              </div>
              <p className={styles.stepText}>
                Signature-box opens in landscape mode.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-Image"></span>
              </div>
              <p className={styles.stepText}>
                Signature must match with the one on your Aadhaar/PAN card.
              </p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepsIcon}>
                <span className="icon-clear-picture"></span>
              </div>
              <p className={styles.stepText}>
                For uploading photo, the size limit is 5 MB.
              </p>
            </div>
          </div>
          <div className="animate__animated">
            <ButtonUI type={"submit"} onClick={toggleModal}>
              Continue
            </ButtonUI>
          </div>
          {showModal && (
            <Modal ModalType="signature_modal" onClick={toggleModal}>
              <AddSignaturePopup func={pull_data} />
            </Modal>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddSignature);
