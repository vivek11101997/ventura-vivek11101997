import React, { useEffect, useState } from "react";
import ButtonUI from "../../../components/ui/Button.component";
import Header from "../../../components/global/Header.component";
import AxiosInstance from "../../../Api/Axios/axios";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import Loader from "../../../components/ui/Loader/Loader.component";
import { useRouter } from "next/router";
import { HIDE_ERROR_MODAL, SET_ERROR, SHOW_ERROR_MODAL } from "../../../Redux/Landing";
import { connect } from "react-redux";
import { mobileRegister, setupPin } from "../../../global/path/redirectPath";
const AccountCreated = (props) => {
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const downloadFile = (dataUrl, filename) => {
    let link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.target = " ";
    link.click();
  }


  const downloadESignDocument = async () => {
    try {
      setIsLoading(true)
      const APIData = {
        phone: parseInt(user.phone),
      };
      const { data, status } = await AxiosInstance.post(
        `/signup/user/esign/response`,
        { ...APIData }
      );
      if (status === 200) {
        downloadFile(data.message, "test.pdf")
        setIsLoading(false)
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        props.setError({
          isError: true,
          ErrorMsg:
            error.response.data.message,
          showHide: true,
        });
      } else {
        props.setError({
          isError: true,
          ErrorMsg: error && error.response || process.env.errorMessage,
          showHide: true,
        });
      }
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    if (localUserData) {
      const userData = typeof localUserData === "string" ? JSON.parse(localUserData) : localUserData;
      setUser(userData);
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <section className="ContainerBG accountCreatedWrap bgType1">
        <div className="containerMini">
          <div className="rightTick">
            <img
              src="/images/welcome_star.svg"
              alt="star"
              className="star star1"
            />
            <img
              src="/images/welcome_star.svg"
              alt="star"
              className="star star2"
            />
            <img
              src="/images/welcome_star.svg"
              alt="star"
              className="star star3"
            />
            <span className="icon-Done"></span>
          </div>
          <h2 className="title animate__animated acHeading">Account created</h2>
          <p className="animate__animated subTitle acPara">
            Your client ID is&nbsp;
            <span>{(user && user.clientid) || "AM001D"}</span>
            . <br />
            Use this, your mobile number or email ID
            <br />
            to login after setting a login PIN.
          </p>
          <div className="grayBox">
            <span className="icon-setting-up"></span>
            <h2 className="grayBoxHeading">We’re setting up your account</h2>
            <p className="grayBoxPara">
              Transactions for your account will be activated soon.
            </p>
          </div>
          <div className="animate__animated">
            <ButtonUI
              className="btn"
              btnType="btn btn-outline"
              type={"submit"}
              onClick={downloadESignDocument}
            >
              Download eSigned document
            </ButtonUI>
          </div>

          <div className="animate__animated">
            <ButtonUI type={"submit"} onClick={() => router.push(setupPin)}>Set PIN</ButtonUI>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountCreated);
