import React, { useEffect } from "react";
import Header from "../../global/Header.component";
import styles from "../../clientOnboarding/WelcomToVentura/Welcome.module.css";
import ButtonUI from "../../ui/Button.component";
import { useRouter } from "next/router";
import { addMaritalStatus } from "../../../global/path/redirectPath";

const CompletedEKYC = () => {
  const router = useRouter();

  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);
  return (
    <>
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <div className={styles.stepsWrap}>
            <div className={`animate__animated ${styles.completedSteps}`}>
              <div className={styles.stepsIcon}>
                <span
                  className={`icon-Complete-your-e-KYC ${styles.completeIcon}`}
                ></span>
              </div>
              <div>
                <h3 className={styles.caSubtitle}>Complete your e-KYC</h3>
                <p className={styles.caSubTitleText}>
                  Keep your Aadhaar and PAN card handy
                </p>
              </div>
            </div>
            <h2 className="animate__animated title nextUp">Next up...</h2>

            <div className={`animate__animated ${styles.steps}`}>
              <div className={styles.stepsIcon}>
                <span className="icon-Set-up-your-profile"></span>
              </div>
              <div>
                <h3 className={styles.caSubtitle}>Set up your profile</h3>
                <p className={styles.caSubTitleText}>
                  Answer a few questions about yourself
                </p>
              </div>
            </div>

            <div className={`animate__animated ${styles.steps}`}>
              <div className={styles.stepsIcon}>
                <span
                  className={`icon-Complete-your-e-KYC ${styles.completeIcon}`}
                ></span>
              </div>
              <div>
                <h3 className={styles.caSubtitle}>Link your bank a/c</h3>
                <p className={styles.caSubTitleText}>
                  Speed up your deposits and withdrawals
                </p>
              </div>
            </div>

            <div className={`animate__animated ${styles.steps}`}>
              <div className={styles.stepsIcon}>
                <span className="icon-Confirm-its-you"></span>
              </div>
              <div>
                <h3 className={styles.caSubtitle}>Confirm it&apos;s you</h3>
                <p className={styles.caSubTitleText}>
                  Upload your photo and signature
                </p>
              </div>
            </div>

            <div className={`animate__animated ${styles.steps}`}>
              <div className={styles.stepsIcon}>
                <span className="icon-eSign-and-Login"></span>
              </div>
              <div>
                <h3 className={styles.caSubtitle}>eSign and Login</h3>
                <p className={styles.caSubTitleText}>
                  Sign your application and start investing
                </p>
              </div>
            </div>
          </div>
          <div className="animate__animated pb20">
            <ButtonUI
              onClick={() => router.push(addMaritalStatus)}
              type={"submit"}
            >
              Continue
            </ButtonUI>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompletedEKYC;
