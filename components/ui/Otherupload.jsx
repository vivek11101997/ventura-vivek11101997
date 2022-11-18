import React,{useState} from "react";
import styles from "./UploadPopup.module.css";
import GoogleDrive from "./GoogleDrive/GoogleDrive";
import Dropbox from "./Dropbox/Dropbox.component";
const Otherupload = (props) =>{
    const [errorMsg, setErrorMsg] = useState("");
    const compInfo = props.compInfo;
    const fileSizeError = props.compInfo.fileSizeError;
    const shareEncryptpdf = props.compInfo.shareEncryptpdf;

    const pull_drop = (data,filetype,fileName,Encrypt) => {
      if (data.toUpperCase() === "SIZEISSUE") {
        setErrorMsg(fileSizeError);
        setTimeout(function () {
          setErrorMsg("");
        }, 6000);
      }
      else{
        if(filetype.toUpperCase() ==='PDF'){
          if(Encrypt.toUpperCase() === "ENCRYPT"){
            if(shareEncryptpdf !== true){
              setErrorMsg("File is Password Protected");
              setTimeout(function () {
                setErrorMsg("");
              }, 6000);
            }
            if(shareEncryptpdf === true){
              props.func(data,filetype,fileName,"Encrypt");
            }
          }
          if(Encrypt.toUpperCase() === "DECRYPT"){
            props.func(data,filetype,fileName,"Decrypt");
          }
        }
        if(filetype.toUpperCase() !=='PDF'){
          props.func(data,filetype,fileName,"Encrypt");
        }
      }
    };
    return(
        <>
            <div className={styles.orupload}>
                <span className={styles.spanText}>OR upload via</span>
            </div>
            <div className={styles.Others}>
                <GoogleDrive func={pull_drop} compInfo={compInfo} />
                <Dropbox func={pull_drop} compInfo={compInfo} />
            </div>
            <p className={styles.ErrorInfoText}>{errorMsg}</p>
        </>
    )
}
export default Otherupload;