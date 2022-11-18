import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const initialState = {
  user: {
    PhoneOTPCount: 0,
    MailOTPCount: 0,
    clientid: null,
    existing_user: false,
    new_user: false,
    returning_user: true,
    IsPhoneOTPValidated: false,
    email: "",
    IsEmailOTPSent: false,
    IsEmailOTPValidated: false,
    IsPANValidated: false,
    pan: null,
    dob: null,
    bank_details: {
      selected_bank: null,
      selected_branch_IFSC: null,
    },
    personal_details: {
      trade_exp: "",
      income: "",
      marital_status: "",
      occupation: "",
    },
  },
  error: {
    isError: false,
    ErrorMsg: "SomeThing Went Wrong",
    showHide: false,
    redirectTo: "",
  },
};

const Landing_slice = createSlice({
  name: "landing",
  initialState: initialState,
  reducers: {
    STORE_SESSION: (state, action) => {
      const { clientid, existing_user, new_user, returning_user } =
        action.payload;
      const addedToUser = produce(state.user, (draft) => {
        draft.clientid = clientid;
        draft.existing_user = existing_user;
        draft.new_user = new_user;
        draft.returning_user = returning_user;
      });
      return {
        ...state,
        user: addedToUser,
      };
    },

    SET_MOBILE_OTP_VALIDATED: (state, action) => {
      const { IsPhoneOTPValidated, returning_user } = action.payload;

      const OTPValidated = produce(state.user, (draft) => {
        draft.IsPhoneOTPValidated = IsPhoneOTPValidated;
        draft.returning_user = returning_user;
      });
      return {
        ...state,
        user: OTPValidated,
      };
    },

    STORE_EMAIL: (state, action) => {
      const { email, IsEmailOTPSent } = action.payload;
      const addedToUser = produce(state.user, (draft) => {
        draft.email = email;
        draft.IsEmailOTPSent = IsEmailOTPSent;
      });
      return {
        ...state,
        user: addedToUser,
      };
    },
    STORE_PAN: (state, action) => {
      const { IsPANValidated, UserPANDetails } = action.payload;

      const addedToUser = produce(state.user, (draft) => {
        draft.pan = UserPANDetails;
        draft.IsPANValidated = IsPANValidated;
      });
      return {
        ...state,
        user: addedToUser,
      };
    },

    STORE_DOB: (state, action) => {
      const userWithDob = produce(state.user, (draft) => {
        draft.dob = action.payload;
      });
      return {
        ...state,
        user: userWithDob,
      };
    },

    SET_EMAIL_OTP_VALIDATED: (state, action) => {
      const { isvalidated } = action.payload;
      const OTPValidated = produce(state.user, (draft) => {
        draft.IsEmailOTPValidated = isvalidated;
      });
      return {
        ...state,
        user: OTPValidated,
      };
    },

    SET_SELECTED_BANK: (state, action) => {
      const bankName = action.payload;
      const storeBankName = produce(state.user, (draft) => {
        draft["bank_details"].selected_bank = bankName;
      });
      return {
        ...state,
        user: storeBankName,
      };
    },
    SET_SELECTED_BRANCH_IFSC: (state, action) => {
      const branchIFSC = action.payload;
      const storeBranchName = produce(state.user, (draft) => {
        draft["bank_details"].selected_branch_IFSC = branchIFSC;
      });
      return {
        ...state,
        user: storeBranchName,
      };
    },

    SET_ERROR: (state, action) => {
      const { isError, ErrorMsg, showHide, redirectTo } = action.payload;
      const setError = produce(state.error, (draft) => {
        draft.isError = isError;
        draft.ErrorMsg = ErrorMsg;
        draft.showHide = showHide;
        draft.redirectTo = redirectTo;
      });
      return {
        ...state,
        error: setError,
      };
    },

    SHOW_ERROR_MODAL: (state, action) => {
      const showErrorModal = produce(state.error, (draft) => {
        draft.showHide = true;
      });
      return {
        ...state,
        error: showErrorModal,
      };
    },

    HIDE_ERROR_MODAL: (state, action) => {
      const hideErrorModal = produce(state.error, (draft) => {
        draft.showHide = false;
        draft.redirectTo = action.payload.redirect || "";
      });
      return {
        ...state,
        error: hideErrorModal,
      };
    },

    SET_PERSONAL_DETAILS: (state, action) => {
      const modifiedData = produce(state.user, (draft) => {


        draft["personal_details"].income=action.payload.personal_details.income
        draft["personal_details"].marital_status=action.payload.personal_details.marital_status
        draft["personal_details"].occupation=action.payload.personal_details.occupation
        draft["personal_details"].trade_exp=action.payload.personal_details.trade_exp
      });
      return{
        ...state,
        user:modifiedData
      }
    },
  },
});

export const {
  STORE_SESSION,
  STORE_PAN,
  STORE_DOB,
  SET_SELECTED_BANK,
  SET_SELECTED_BRANCH_IFSC,
  SET_ERROR,
  SHOW_ERROR_MODAL,
  HIDE_ERROR_MODAL,
  SET_PERSONAL_DETAILS
} = Landing_slice.actions;
export default Landing_slice.reducer;
