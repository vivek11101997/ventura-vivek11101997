import React, { useState, useEffect } from "react";
import styles from "../../UploadPopup.module.css";
import ButtonUI from "../../Button.component";
import GetUserDataFromLocalStorage from "../../../../global/localStorage/GetUserDataFromLocalStorage";
import { mobileRegister } from "../../../../global/path/redirectPath";
const ShareLink = () => {
  const fcShareLink = () => { };
  const [user, setuser] = useState("");
  useEffect(() => {
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setuser(userData);
  }, []);

  return (
    <>
      <div className="textCenter">
        <h2 className="title">Send link</h2>
        <p className="subTitle">
          You can send a link to a camera-enabled device to upload your photo
          easily.
        </p>
      </div>
      <div className={styles.ShareLinkWrap}>
        <p className={styles.ShareLinkp}>
          Share link to your camera-enabled device
        </p>
        <div className={styles.ShareLinkComp}>
          <input className="form-control" type="text" placeholder="link" />
          <button className={styles.ShareLinkBtn}>
            <span className="icon-Arrow"></span>
          </button>
        </div>
        <div className={styles.badgewrap}>
          <span className={styles.badge}>{user.phone}</span>
          <span className={styles.badge}>{user.email}</span>
        </div>
      </div>
      <div className={styles.btnWrap}>
        <ButtonUI type={"submit"} onClick={fcShareLink}>
          Continue
        </ButtonUI>
      </div>
    </>
  );
};

export default ShareLink;
