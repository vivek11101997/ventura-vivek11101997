import React from "react";
import Header from "../../../global/Header.component";
import styles from "./PickAPlan.module.css";
import ButtonUI from "../../../ui/Button.component";

const PickAPlan = () => {
  return (
    <>
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <h2 className="title">Pick a plan</h2>
          <p className="subTitle">
            Save 12% extra in year 1 by choosing to pay at once.
          </p>

          <div className={styles.plans}>
            <label className={styles.plan} htmlFor="complete">
              <input type="radio" id="complete" name="plan" defaultChecked/>
              <div className={styles.planContent}>
                <div className={styles.planDetails}>
                  <h4>Pay at once</h4>
                  <p>One time account opening <br />charge + AMC</p>
                  <div className={styles.amount}>500/-</div>
                </div>
                <img src="/images/rightBottomLines.png" alt="rightBottomLines" />
              </div>
            </label>

            <label className={styles.plan} htmlFor="basic">
              <input type="radio" name="plan" id="basic"  />
              <div className={styles.planContent}>
                <div className={styles.planDetails}>
                  <h4>Only account opening</h4>
                  <p>One time account opening <br />charge </p>
                  <div className={styles.amount}>200/-</div>
                </div>
                <img src="/images/rightBottomLines.png" alt="rightBottomLines" />
              </div>
            </label>
          </div>

          <ButtonUI type={"submit"}>Continue</ButtonUI>
        </div>
      </section>
    </>
  );
};

export default PickAPlan;
