import React , { useEffect,useState }  from "react";
import ButtonUI from "../../Button.component";
import { useRouter } from "next/router";
import Link from "next/link";

const AccountBlockedTemp = ({param}) => {
  const router = useRouter();
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
      <div className={"container popupAccBlockedTemp"}>
        <div className="iconWrap">
          <span className="icon-blocked"></span>
        </div>
        <h1 className={"title"}>
        Account blocked temporarily
        </h1>
        <p className={"subTitle "}>
          Due to suspicious activity, your account <br/>has been blocked for 
          <strong className="blockTiming"> {blockTiming}</strong>.
            We will <br/>notify you once it gets unblocked. 
        </p>
        <p className="blockCounter"> {blockCount} Wait for {minutes}:{seconds}</p>
        <div className="btnWrap">
            <ButtonUI
            btnType="btn"
            type={"submit"}
            ariaLabel="Forgot PIN?"
            onClick={() => router.push('/sso/forgot-pin')}
            >
            Forgot PIN?
            </ButtonUI>
            <Link href={'/sso/sign-in'}>
                <a className="txtLink">Switch account</a>
            </Link>
        </div>
      </div>
    </>
  );
};

export default AccountBlockedTemp;
