import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../Api/Axios/axios";
import styles from "./AddBank.module.css";
import { connect } from "react-redux";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SET_SELECTED_BANK,
  SHOW_ERROR_MODAL,
} from "../../../../Redux/Landing";
import { useRouter } from "next/router";
import ErrorModal from "../../../ui/Modal/ErrorModal.component";
import GetSessionIdFromSessionStorage from "../../../../global/localStorage/GetSessionIdFromSessionStorage";
import Loader from "../../../ui/Loader/Loader.component";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import {
  mobileRegister,
  selectBranch,
  welcome,
} from "../../../../global/path/redirectPath";

const AddBank = (props) => {
  const router = useRouter();
  const [bankData, setBankData] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [user, setUserData] = useState("");
  const [redirectTo, setRedirectTo] = useState("");

  const getBankList = async () => {
    try {
      const { data, status } = await AxiosInstance.get(
        `/signup/user/bank/master`
      );

      if (status === 200 && data && !data.message) {
        setBankList(data);
      } else {
        let arr = [{ name: "Bank Details not Found" }];
        setBankList(arr);
      }
    } catch (error) {
      props.setError({
        isError: true,
        ErrorMsg: error.message,
        showHide: true,
      });
    }
  };
  useEffect(() => {
    user && router.beforePopState(() => router.push(welcome));
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }
  }, [user]);

  useEffect(() => {
    const session = GetSessionIdFromSessionStorage("session");
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    if (!localUserData || localUserData === "") {
      props.setError({
        redirectTo: mobileRegister,
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister,
      });
    }

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    if (session) {
      setSessionId(session.session_id);
      setUserData(userData);
    }
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;

      sessionId && getBankList();
    });
  }, [sessionId]);

  const getBankData = async (key) => {
    if (key.trim() !== "") {
      const { data, status } = await AxiosInstance.get(
        `/signup/user/bank/banks?search=${key}`
      );
      if (status === 200 && data && !data.message) {
        data.banks ? setBankData(data.banks) : setBankData([]);
      } else {
        let arr = [{ name: "Bank Details not Found" }];
        setBankData(arr);
      }
    } else {
      setBankData([]);
    }
  };

  const AfterBankSelect = (bankName) => {
    props.storeBankName(bankName);

    setLoading(true);
    const userFromLocalStorage = user;
    userFromLocalStorage["selected_bank"] = bankName;
    SetItemToLocalStorage("user", userFromLocalStorage);
    redirectTo === "P" ? void router.push(`${selectBranch}?redirect=P`) : void router.push(selectBranch);
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
    <section className="ContainerBG">
      {isLoading && <Loader />}
      {/* body bg */}
      {Error}
      <div className="containerMD">
      <h2 className={`animate__animated ${styles.add_bank_account}`}>Add bank account</h2> 
        <p className="animate__animated subTitle" >
          This will be the default account for all your transactions.
        </p>
        <div className={`animate__animated ${styles.success_info}`}>
          <div>
            <img src="/images/strongbox.svg" alt="Bank Details Icon" />
          </div>
          <div>
            Your bank details are secured and
            <b> will not </b>
            be shared with anyone
          </div>
        </div>
        <div className={`animate__animated ${styles.search_content}`}>
          <input
            aria-label="Select Your Bank"
            className="form-control"
            placeholder="Search your bank"
            type="text"
            onKeyUp={(e) => {
              void getBankData(e.target.value);
            }}
          />
          <img
            className={styles.search_icon}
            src="/images/search.svg"
            alt="Search Icon"
          />
        </div>
        {bankData.length !== 0 && (
          <p className={styles.search_result}>Search Results</p>
        )}
        <div className={styles.bankList}>
          <ul>
            {bankData.map((bank, i) => (
              <li
                aria-label={bank.name || ""}
                onClick={() => AfterBankSelect(bank.name)}
                className={styles.bankListItem}
                key={i}
              >
                <img
                  className={styles.bank_icon}
                  src={bank.logo}
                  alt={`${bank.name}`}
                />
                {bank.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={`animate__animated ${styles.row}`}>
          <div className={styles.col}>
            <p className={styles.bankTitle}>POPULAR BANKS</p>
            <div className={styles.card}>
              <ul className={styles.popular_banksList}>
                {bankList
                  .filter((temp) => temp.popular)
                  .map((bank, index) => (
                    <li
                      aria-label={bank.name || ""}
                      onClick={() => AfterBankSelect(bank.name)}
                      key={index}
                    >

                      <img
                        src={`${bank.logo}`}
                        alt={`${bank.name}`}
                        className={styles.bankIcon}
                      />
                      <p>{bank.name}</p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className={styles.col}>
            <p className={styles.bankTitle}>ALL BANKS</p>
            <div className={styles.all_banksCard}>
              <ul className={styles.all_bankList}>
                {bankList.map((bank, index) => (
                  <li
                    aria-label={bank.name || ""}
                    className={styles.bankListItem}
                    onClick={() => AfterBankSelect(bank.name)}
                    key={index}
                  >
                    <img
                      src={`${bank.logo}`}
                      alt={`${bank.name}`}
                      className={styles.bankIcon}
                    />
                    <p>{bank.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    storeBankName: (bankName) => dispatch(SET_SELECTED_BANK(bankName)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBank);
