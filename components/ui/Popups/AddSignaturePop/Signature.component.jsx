import React,{useState} from "react";
import SignaturePad from "react-signature-canvas";
import ButtonUI from "../../Button.component";
import styles from "./AddSignaturePop.module.css";
const Signature = (data) => {
  let sigPad = {};
  const trim = () => {
    data.func(sigPad.getTrimmedCanvas().toDataURL("image/png"));
  };
  const clear = () => {
    sigPad.clear();
    setIsSigned(false)
  };
  const [isSigned, setIsSigned] = useState(false);
  return (
    <>
      <div className={styles.SignBox}>
        <SignaturePad
          backgroundColor="white"
          canvasProps={{ width: 500, height: 200 }}
          ref={(ref) => {
            sigPad = ref;
          }}
          onEnd={() => { setIsSigned(true) }}
        />
        <button className={styles.resetSignature} onClick={clear}>
          <img src="/images/resetsignature.png" alt={"Reset Signature"} />
        </button>
      </div>
      <div className={styles.btnWrap}>
        <ButtonUI disabled={!isSigned} ariaLabel={"Continue"} onClick={trim} type={"submit"}>
          Continue
        </ButtonUI>
      </div>
    </>
  );
};
export default Signature;
