import React, { useState } from "react";
import { connect } from "react-redux";
import AxiosInstance from "../../../../Api/Axios/axios";
import { HIDE_ERROR_MODAL, SET_ERROR, SET_SELECTED_BRANCH_IFSC } from "../../../../Redux/Landing";
import styles from "./SearchBankBranch.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import SetItemToLocalStorage from "../../../../global/localStorage/SetItemToLocalStorage";
import Loader from "../../../ui/Loader/Loader.component";
import { addBankAccount, linkBankAccount, mobileRegister, selectBranch } from "../../../../global/path/redirectPath";

const SearchBankBranch = (props) => {
  const [user, setUser] = useState();
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("");
  const [isLoading, setLoading] = useState(false);
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

    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    setUser(userData);

  }, []);

  useEffect(() => {
    (user && !user.selected_bank || user === "") && void router.push(addBankAccount);

    user && router.beforePopState(() => router.push(selectBranch));
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }
  }, [user]);

  const [BranchData, setBranchData] = useState([]);
  const getBankData = async (key) => {
    if (key) {
      const bank = user.selected_bank;
      const { data, status } = await AxiosInstance.get(
        `/signup/user/bank/branches?bank=${bank}&search=${key}`
      );
      if (status === 200 && data && !data.message && data.branches) {
        setBranchData(data.branches);
      } else {
        let arr = [{ message: "Branch data not found" }];
        setBranchData(arr);
      }
    } else {
      setBranchData([]);
    }
  };

  const AfterBranchSelect = (branch_IFSC, location) => {
    props.storeBranchIFSC(branch_IFSC);
    let userFromLocalStorage = user;
    userFromLocalStorage["selected_branch"] = `${branch_IFSC} ${location}`;
    userFromLocalStorage["ifsc"] = `${branch_IFSC}`;
    SetItemToLocalStorage("user", userFromLocalStorage);
    setLoading(true);
    if (redirectTo === "P") {
      void router.push(`${linkBankAccount}?redirect=P`);
    } else {
      void router.push(linkBankAccount);
    }

  };

  return (
    <div className="ContainerBG">
      {isLoading && <Loader />}
      <div className="containerMD">
        <p className={styles.search_branch_name}>Search branch name</p>
        <div className={styles.search_content}>
          <input
            autoFocus
            aria-label="Search Your Branch Name"
            className="form-control"
            placeholder="Search your branch name"
            type="text"
            onKeyUp={(e) => getBankData(e.target.value)}
          />
          <img className={styles.search_icon} src="/images/search.svg" alt="Search Icon" />
        </div>
        {BranchData.length !== 0 && (
          <p className={styles.search_result}>Search Results</p>
        )}
        <div className={styles.branchList}>
          <ul>
            {BranchData.map((branch, i) =>
              branch.message ? (
                <li aria-label={branch.message}>{branch.message}</li>
              ) : (
                <li
                  aria-label={branch.location}
                  onClick={() =>
                    AfterBranchSelect(branch.ifsc, branch.location)
                  }
                  className={styles.branchList}
                  key={i}
                >
                  <div className={styles.listItemWrapper}>
                    <p className={styles.branch_title}>
                      {branch.ifsc}-{branch.location}
                    </p>
                    <p className={styles.branch_subtitle}>
                      {branch.address},{branch.branch_code}
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedBranch: state.LandingReducer.user.bank_details.selected_bank,
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeBranchIFSC: (Ifsc) => dispatch(SET_SELECTED_BRANCH_IFSC(Ifsc)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBankBranch);
