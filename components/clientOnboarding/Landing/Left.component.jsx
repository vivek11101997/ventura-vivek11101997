import React, { useContext } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Landing.module.css";
import ButtonUI from "../../ui/Button.component";
import AuthContext from "../../../global/AuthContext/Store";
const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: false,
    prevArrow: false,
    arrows: false,
  };
  const user = useContext(AuthContext);
  return (
    <>
      <div className={styles.landingCarousel}>
        <Slider {...settings}>
          <div className={styles.landingSlides}>
            <img
              src="/images/item1.png"
              alt=""
              className={styles.thumb}
              loading="lazy"
            />
            <h3>
              Open your account in  <br />
              less than 10 minutes
            </h3>
            <p>
              Find and act on market opportunities <br />
              instantly
            </p>
          </div>
          <div className={styles.landingSlides}>
            <img
              src="/images/item2.png"
              alt=""
              className={styles.thumb}
              loading="lazy"
            />
            <h3>
              Partner with <br />
              an experienced advisor
            </h3>
            <p>
              Boost your portfolio’s growth with <br />
              trusted research & recommendations
            </p>
          </div>
          <div className={styles.landingSlides}>
            <img
              src="/images/item3.png"
              alt=""
              className={styles.thumb}
              loading="lazy"
            />
            <h3>
              Pay no <br />
              annual fees
            </h3>
            <p>
              Enjoy lifetime zero <br />
              AMC charges
            </p>
          </div>
          <div className={styles.landingSlides}>
            <img
              src="/images/item4.png"
              alt=""
              className={styles.thumb}
              loading="lazy"
            />
            <h3>
              Investing is now <br />a breeze
            </h3>
            <p>
              Invest in multiple instruments with <br />
              our user-friendly platform
            </p>
          </div>
        </Slider>
        <div className={`row justify-content ${styles.downloadApp}`}>
          <div className="col-auto">
            <a href="">
              <img src="/images/appStore.png" alt="" loading="lazy" />
            </a>
          </div>
          <div className="col-auto">
            <a href="">
              <img src="/images/playStore.png" alt="" loading="lazy" />
            </a>
          </div>
        </div>
        <AuthContext.Consumer>
          {(ctx) => {
            return (
              <div className="displayXs">
                <ButtonUI btnType="btn margin-b" onClick={ctx.hideRightDiv}>
                  Open an account
                </ButtonUI>
                <ButtonUI btnType="btn btn-outline">Sign In</ButtonUI>
              </div>
            );
          }}
        </AuthContext.Consumer>
      </div>
    </>
  );
};

export default SimpleSlider;
