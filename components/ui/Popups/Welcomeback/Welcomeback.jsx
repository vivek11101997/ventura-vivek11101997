import React,{useState,useEffect} from "react";

import ButtonUI from "../../Button.component";
import Styles from "./Welcomeback.module.css";
import { useRouter } from 'next/router'
import GetUserDataFromLocalStorage from './../../../../global/localStorage/GetUserDataFromLocalStorage';


const Welcomeback = (props) => {
  const { redirectUrl,userName } = props;
    const router = useRouter()
  const HandelRedirect = () => {
    router.push(redirectUrl);
  }
  
    return (
      <div className={Styles.alertContainer}>
        <img
          src="/images/profile_icon.png"
          alt="alert icon"
          className={Styles.alertImg}
        />
        <h1 className={Styles.alertTitle}>Welcome back, {userName}!</h1>
        <p className={Styles.alertSubTitle}>
          Just a few steps left to complete your application.
        </p>
        <ButtonUI onClick={HandelRedirect}>Continue</ButtonUI>
      </div>
    );
}

export default Welcomeback