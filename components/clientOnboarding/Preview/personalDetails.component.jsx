import React from "react";
import styles from "./Preview.module.css";
import PersonalDetailPreview from "../../ui/Popups/Preview/PersonalDetail/PersonalDetailPreview.component";
import Modal from "../../ui/Modal/Modal.component";
import { connect } from "react-redux";
import { TOGGLE_MODAL } from "../../../Redux/modal";

const PersonalDetails = (props) => {
  const { PreviewData } = props;
  const handleEditPersonalInfo = () => {
    props.toggleModal();
  };

  return (
    <>
      {props.showModal && (
        <Modal ModalType="" onClick={props.toggleModal}>
          <PersonalDetailPreview />
        </Modal>
      )}
      {PreviewData && (
        <section className={styles.previewWrap}>
          <h2 className={`animate__animated ${styles.title}`}>
            Personal Details
          </h2>
          <button
            aria-label="Edit Personal Details"
            onClick={handleEditPersonalInfo}
            className={`btnLInk ${styles.btnEditPD}`}
          >
            Edit
            <span className={`icon-Arrow ${styles.editArrow}`}></span>
          </button>
          <div className={styles.listWrap}>
            <div className={styles.list}>
              <label>Marital Status</label>
              <span>
                {PreviewData.personal_details.marital_status.marital_status || props.personalData.marital_status}
              </span>
            </div>
            <div className={styles.list}>
              <label>Occupation</label>
              <span>{PreviewData.personal_details.occupation.occupation || props.personalData.occupation}</span>
            </div>
            <div className={styles.list}>
              <label>Income</label>
              <span>{PreviewData.personal_details.income_range.income_range || props.personalData.income}
              </span>
            </div>
            <div className={styles.list}>
              <label>Trading Experience</label>
              <span>
                {PreviewData.personal_details.trading_experience.trading_experience || props.personalData.trade_exp}
              </span>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
    personalData: state.LandingReducer.user.personal_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails);
