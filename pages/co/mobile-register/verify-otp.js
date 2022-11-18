import React, { useState, useEffect } from "react";
import SimpleSlider from "../../../components/clientOnboarding/Landing/LeftCarousel.component";
import NumberOTPComponent from "../../../components/clientOnboarding/Landing/MobileSignUp/NumberOTP.component";
import styles from "../../../components/clientOnboarding/Landing/Landing.module.css";
const VerifyMobileOtpPage = () => {
  const [hideCarousel, setHideCarousel] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width <= 767) {
        setHideCarousel(false);
      }
    }
  }, []);
  return (
    <>
      <div className={`row ${styles.fullHeight}`}>
        {hideCarousel && (
          <div className={`col-6 ${styles.leftBg}`}>
            <div className="row align-items-center">
              <div className="col">
                <SimpleSlider />
              </div>
            </div>
          </div>
        )}
        <div className="col-6">
          <div className="row align-items-center">
            <div className="col">
              <NumberOTPComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyMobileOtpPage;
