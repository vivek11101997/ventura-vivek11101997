import React ,{ useState,useEffect } from "react";

const BlockBrowser = ({param}) => {

  const { blockTiming, blockCount, warning, timer } = param;
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(true);
  
  useEffect(() => {
    let timerId;

    if (runTimer) {

      setCountDown(timer*60);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);
  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);
  return (
    <>
      <div className={"container blockTimerWrap"}>
        <div className="iconWrap">
          <span className="icon-blocked"></span>
        </div>
        <h1 className={"title"}>
          Ventura access temporarily blocked on this browser
        </h1>
        <p className={"subTitle "}>
          This <strong className="blockTiming">{blockTiming}</strong>-block is a
          precaution to ensure the safety of your account. We will notify you
          once it gets unblocked.
        </p>
        <p className="blockCounter">{blockCount} Wait for {minutes}:{seconds}</p>
        {warning && (
          <div className="otpTimerResend errorMsgOtp blockErrorMsg">
            <span className="attempts" aria-label="Invalid OTP">
              <strong>Warning : </strong>Multiple temporary blocks will lead to
              permanent device blacklist.
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default BlockBrowser;
