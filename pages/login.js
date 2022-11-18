import styles from "../styles/Home.module.css";
import Layout from "../components/layout/layout";
import { TOGGLE_MODAL } from "../Redux/modal";
import { connect } from "react-redux";
import ButtonUI from "../components/ui/Button.component";
import Modal from "../components/ui/Modal/Modal.component";
import PANAlreadyExistValidation from "../components/ui/Popups/PANValidation/PANAlreadyExistValidation";

const Home = (props) => {
  const { showModal, toggleModal } = props;

  return (
    <div className={styles.container}>
      <Layout>
        {showModal && (
          <Modal ModalType="signature_modal" onClick={toggleModal}>
            <PANAlreadyExistValidation />
          </Modal>
        )}
        <ButtonUI onClick={toggleModal}>Toggle Modal</ButtonUI>
      </Layout>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
