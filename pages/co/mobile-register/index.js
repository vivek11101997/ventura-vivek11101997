import React, { useState, useEffect } from "react";
import Head from "next/head";

import SimpleSlider from "../../../components/clientOnboarding/Landing/LeftCarousel.component";
import styles from "../../../components/clientOnboarding/Landing/Landing.module.css";
import AuthContext from "../../../global/AuthContext/Store";
import NumberInputComponent from "../../../components/clientOnboarding/Landing/MobileSignUp/NumberInput.component";
import { useFlags } from "flagsmith/react";
import SetItemToLocalStorage from "../../../global/localStorage/SetItemToLocalStorage";

const MobileRegisterPage = () => {
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);

  const cob_base_url_prod1 = useFlags(["cob_base_url_prod"]);
  const cob_base_url_prod = cob_base_url_prod1["cob_base_url_prod"].value;
  const cob_base_url_stage1 = useFlags(["cob_base_url_stage"]);
  const cob_base_url_stage = cob_base_url_stage1["cob_base_url_stage"].value;
  const cob_base_url_qa1 = useFlags(["cob_base_url_qa"]);
  const cob_base_url_qa = cob_base_url_qa1["cob_base_url_qa"].value;

  useEffect(() => {
    const object = {
      cob_base_url_prod,
      cob_base_url_qa,
      cob_base_url_stage,
    };
    SetItemToLocalStorage("url", object);
  }, [cob_base_url_prod, cob_base_url_stage, cob_base_url_qa]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width <= 767) {
        setRightVisible(false);
      }
    }
  }, []);

  const responsiveHandler = (setRightVisible) => {
    setRightVisible(setRightVisible);
  };

  const mobileSignupHandler = () => {
    setRightVisible(true);
    setLeftVisible(false);
  };

  return (
    <>
      <Head>
        <title>Ventura</title>
        <link rel="shortcut icon" href="/images/fevicon.png" />
      </Head>
      <div className={`row ${styles.fullHeight}`}>
        {leftVisible && (
          <div className={`col-6 ${styles.leftBg}`}>
            <div className="row align-items-center">
              <div className="col">
                <AuthContext.Provider
                  value={{
                    isClicked: false,
                    hideRightDiv: mobileSignupHandler,
                  }}
                >
                  <SimpleSlider />
                </AuthContext.Provider>
              </div>
            </div>
          </div>
        )}
        <div className="col-6">
          <div className="row align-items-center">
            <div className="col">
              {rightVisible && <NumberInputComponent />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileRegisterPage;
