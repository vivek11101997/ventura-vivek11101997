import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../UploadPopup.module.css";

function Dragdrop(data) {
  const maxSize = data.compInfo.maxSize;
  const filesaccept = data.compInfo.filesaccept;
  const fileErrorMsg = data.compInfo.fileErrorMsg;
  const infoMsg = data.compInfo.infoMsg;
  const [errorMsg, setErrorMsg] = useState("");
  const shareEncryptpdf = data.compInfo.shareEncryptpdf;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length === 1) {
      let errorMessage = fileRejections[0].errors[0].code;
      if (errorMessage.toUpperCase() === "FILE-TOO-LARGE") {

        if (maxSize === "5e+6") {
          setErrorMsg("file size should not be greater than 5mb");
        }
      }
      errorMessage.toUpperCase() === "FILE-INVALID-TYPE" && setErrorMsg(fileErrorMsg);
    }
    fileRejections.length > 1 &&
      setErrorMsg(fileRejections[0].errors[0].message);
    if (acceptedFiles.length) {
        const FileType = acceptedFiles[0].type;
        setErrorMsg(null);
        let file = acceptedFiles[0];
        let fileName = file.name;
        if(FileType.toUpperCase()  ==='APPLICATION/PDF'){
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            let files = new Blob([reader.result], { type: "application/pdf" });
            files.text().then((x) => {
              if(x.includes("Encrypt")){
                if(shareEncryptpdf === true){
                  getBase64(file,fileName,"Encrypt");
                }else{
                  setErrorMsg("File is Password Protected");
                }
              }
              else{
                getBase64(file,fileName,"Decrypt");
              }
            });
          };
        }
        else{
          getBase64(file,fileName,"Decrypt");
      }
    }
  }, []);

  const getBase64 = (file,fileName,Encrypt) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      data.func(reader.result,"", fileName,Encrypt);
    };
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: filesaccept,
    maxSize: maxSize,
    onDrop,
    multiple: false,
  });
  return (
    <div className={styles.FileBox} {...getRootProps()}>
      <img
        src="/images/gallery_import.png"
        alt="lines"
        className={styles.DropImg}
      />
      <h3 className={styles.titleText}>
        Drop your file here or &nbsp;
        <button
          className={styles.Browse}
          type="button"
          onClick={open}
          aria-label="Browse"
        >
          Browse
        </button>
      </h3>
      <p className={styles.InfoText}>{infoMsg}</p>
      <input {...getInputProps()} />
      <p className={styles.ErrorInfoText}>{errorMsg}</p>
    </div>
  );
}

export default Dragdrop;
