import axios from "axios";
import Router from "next/router";
import { mobileRegister } from "../../global/path/redirectPath";
import GetSessionIdFromSessionStorage from "./../../global/localStorage/GetSessionIdFromSessionStorage";
import GetUserDataFromLocalStorage from "./../../global/localStorage/GetUserDataFromLocalStorage";
let AxiosInstance, session, urls, baseURL;

if (typeof window !== "undefined") {
  const localUserData = GetUserDataFromLocalStorage("url");
  urls = window.onload = localUserData || "/";
  baseURL = urls.cob_base_url_stage;
  if (window.location.href.includes("/sso/")) {
    // due to some reason hard coded value here once
    baseURL = process.env.SSO_Base_URL;
  }
  AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 0,
    headers: {
      Accept: `application/json`,
    },
  });
  if (window.location.href.includes("/sso/")) {
    session = window.onload = GetSessionIdFromSessionStorage("ssoSessionId");
    AxiosInstance.defaults.headers.common["x-api-key"] =
      process.env.VENTURA_APP_SSO_API_KEY;
  } else {
    session = window.onload = GetSessionIdFromSessionStorage("session");
  }

  if (session !== undefined) {
    AxiosInstance.defaults.headers.common["session_id"] = session.session_id;
  } else {
    window.location.href = mobileRegister;
  }

  AxiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return error.response.data.hasOwnProperty("attempts_left")
          ? { error: { message: error.response.data } }
          : { error: { message: error.response.data.message } };
      } else if (error.message) {
        return { error: { message: error.message } };
      } else {
        return { error: { message: process.env.errorMessage } };
      }
    }
  );
}

export default AxiosInstance;
