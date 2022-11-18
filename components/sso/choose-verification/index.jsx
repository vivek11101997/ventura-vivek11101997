import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Header from "../../../components/global/Header.component";
import ButtonUI from "../../../components/ui/Button.component";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { TOGGLE_MODAL } from "../../../Redux/modal";
import Modal from "../../ui/Modal/Modal.component";
import GoogleAuthenticator from "../../ui/Popups/GoogleAuthenticator/GoogleAuthenticator";

const ChooseVerificationComponent = (props) => {
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("userDetails") || "";
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setUser(userData);
  }, []);
  const handleToggleModal = () => {
    props.toggleModal();
  };

  useEffect(() => {
    // for animation of fields
    document.querySelectorAll(".animate").forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
  });

  return (
    <>
      <Header />
      {props.showModal && (
        <Modal
          onClick={props.toggleModal}
          ModalType="popupAuthenticator"
          className="popupGoogleAuth"
        >
          <GoogleAuthenticator />
        </Modal>
      )}
      <section className="ContainerBG">
        <div className="containerMini choosenVerifWrap">
          <div className="welcomeBack animate">Welcome back, {user && user.fname}</div>
          <h2 className="title animate animate">Choose verification method</h2>
          <p className="subTitle animate animate">
            Proceed with your preferred two-factor
            <br /> authentication route.
          </p>
          <div className="animate">
            <ButtonUI
              type={"submit"}
              ariaLabel="Get OTP"
              onClick={() => router.push("/sso/enter-otp")}
            >
              Get OTP
            </ButtonUI>
          </div>
          <div className={`animate or`}>OR</div>
          <div className="animate">
            <ButtonUI
              btnType="btn btn-outline"
              type={"submit"}
              ariaLabel="Use authenticator code"
              onClick={handleToggleModal}
            >
              Use authenticator code
            </ButtonUI>
          </div>
        </div>
        <div className="bottomLabelInfo animate" >
          NRI customers are requested to use <br />
          <a>client ID</a> or <a>email</a> to login.
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseVerificationComponent);
