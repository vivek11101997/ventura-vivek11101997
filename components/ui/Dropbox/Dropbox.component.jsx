import React from "react";
import DropboxChooser from "react-dropbox-chooser";
const Dropbox = (data) => {
  const maxSize = data.compInfo.maxSize;
  const extensions = data.compInfo.extensions;
  function handleSuccess(files) {
    let file = files[0].link.split("?")[0];
    let filesize = files[0].bytes;
    let fileName = files[0].name;
    let filetype = fileName.split('.').pop();
    if (filetype.toUpperCase() === "PDF") {
      try {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", file, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          let files = new Blob([this.response], {type: 'application/pdf'});
          files.text().then(x=> {
            let responseArray = new Uint8Array(this.response);
            let binary = "";
            let len = responseArray.byteLength;
            for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(responseArray[i]);
            }
            const b64 = btoa(binary);
            if(x.includes("Encrypt")){
              data.func("data:application/pdf;base64," + b64,filetype,fileName,'Encrypt');
            }else{
              data.func("data:application/pdf;base64," + b64,filetype,fileName,'Decrypt');
            }
          });
          
        };
        xhr.send();
      } catch (error) {}
    }
    if (filetype.toUpperCase() !== "PDF") {
      const toDataURL = (src, callback) => {
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function () {
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          canvas.height = this.naturalHeight;
          canvas.width = this.naturalWidth;
          context.drawImage(this, 0, 0);
          const dataURL = canvas.toDataURL();
          callback(dataURL);
        };
        image.src = src;
      };
      if (filesize <= maxSize) {
        toDataURL(file, function (dataURL) {  
          data.func(dataURL,filetype,fileName,'Decrypt');
        });
      } else {
        data.func("SizeIssue");
      }
    }
  }
  const prevent = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <DropboxChooser
        aria-label="Drop Box"
        appKey={process.env.DROP_BOX_API_KEY}
        success={handleSuccess}
        multiselect={false}
        isDir={true}
        linkType="direct"
        extensions={extensions}
      >
        <a onClick={prevent}>
          <img src="/images/dropbox.png" alt={"Drop Box"} />
        </a>
      </DropboxChooser>
    </>
  );
};
export default Dropbox;
