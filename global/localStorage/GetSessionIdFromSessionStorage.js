import Router from "next/router";
const CryptoJS = require("crypto-js");
import { TOGGLE_MODAL } from "../../Redux/modal";
import store from "../../Redux/store";
import { mobileRegister } from "../path/redirectPath";

const GetSessionIdFromSessionStorage = function (name) {
  let localData = sessionStorage.getItem(name);
  if (localData !== null) {
    const data = JSON.parse(
      CryptoJS.AES.decrypt(
        localData,
        process.env.LocalStorageEncryptionKey
      ).toString(CryptoJS.enc.Utf8)
    );
    if (!data) {
      if (store.getState().modalReducer.showModal) {
        store.dispatch(TOGGLE_MODAL());
      }
      void Router.push(mobileRegister);
    }
    setTimeout(function () {
      sessionStorage.clear();
    }, 360000000);

    return data;
  }
};

export default GetSessionIdFromSessionStorage;
