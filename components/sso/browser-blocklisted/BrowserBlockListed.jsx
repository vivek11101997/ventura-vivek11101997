import React, {useEffect} from "react";
import Header from "../../global/Header.component";
import Loader from "../../ui/Loader/Loader.component";
import styles from "./BrowserBlockListed.module.css";
import ErrorModal from "../../ui/Modal/ErrorModal.component";
import { useState } from "react";
const BrowserBlockListedComponent = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo=""
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );

  useEffect(() => {
    // for animation of fields
    document.querySelectorAll(".animate").forEach((item, index) => {
      item.className +=
        " animate__animated animate__fadeInUp animate__delay_" + index;
    });
  }, [isLoading]);

  return (
    <>
      {isLoading && <Loader />}
      {Error}
      <Header />
      <section className="ContainerBG bgType3">
        <div className={`containerMini ${styles.blockedWrap}`}>
          <div className="textCenter">
            <div className={`animate ${styles.blockedIcon}`}>
              <span className={`icon-blocked ${styles.colorWhite}`}></span>
            </div>
            <h2 className="title animate">
              You can no longer access
              <br />
              Ventura on this browser
            </h2>
            <p className={`subTitle animate ${styles.desc}`}>
              To protect you from suspicious activities, access to Ventura from
              this browser has been permanently blocked. If you think this is an
              error, please reach out to us.
            </p>
            <div className={`animate ${styles.RememberList}`}>
              <h3 className={styles.ListTitle}>
                Is this an error? Contact us at
              </h3>
              <div className={styles.ListText}>
                <div className={styles.iconWrap}>
                  <span className={`icon-blocked ${styles.iconStyle}`}></span>
                </div>
                admin@ventura.com
              </div>
              <div className={styles.ListText}>
                <div className={styles.iconWrap}>
                  <span className={`icon-blocked ${styles.iconStyle}`}></span>
                </div>
                0122-86XXXXXXX26
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrowserBlockListedComponent;
