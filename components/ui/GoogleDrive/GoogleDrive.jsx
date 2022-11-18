import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import { connect } from "react-redux";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import { mobileRegister } from "../../../global/path/redirectPath";
import { HIDE_ERROR_MODAL, SET_ERROR } from "../../../Redux/Landing";
import { TOGGLE_MODAL } from "../../../Redux/modal";

const removeFile = (url) => {
  fetch(url, {
    method: "GET",
  })
    .then((response2) => response2)
    .catch((error) => { });
};
const GoogleDrive = (props) => {
  const [openPicker] = useDrivePicker();
  const [image, setImage] = useState("");
  const [user, setuser] = useState("");
  let fileName, filetype;
  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
      developerKey: process.env.GOOGLE_DRIVE_API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data) => {
        if (data.action === "cancel") {
        }
        if (data.docs && data.docs[0].url) {
          let file = data.docs[0];
          fileName = data.docs[0].name;
          filetype = fileName.split(".")[1];
          const fileId = data.docs[0].id;
          fetch(
            `/api/googleDrive/drive?id=${fileId}&url=${data.docs[0].url}&mimeType=${data.docs[0].mimeType}&name=${data.docs[0].name}`,
            {
              method: "GET",
            }
          )
            .then((response) => {
              if (response.status === 200) {
                setImage(`/temp_drive/${fileId + fileName}`);
                let xhr = new XMLHttpRequest();
                xhr.open("GET", `/temp_drive/${fileId + fileName}`, true);
                xhr.responseType = "blob";
                xhr.onload = function (e) {
                  let reader = new FileReader();
                  reader.onload = function (event) {
                    const res = event.target.result;
                    if (filetype.toUpperCase() === "PDF") {
                      const reader = new FileReader();
                      reader.readAsArrayBuffer(file);
                      reader.onload = () => {
                        let files = new Blob([reader.result], {
                          type: "application/pdf",
                        });
                        files.text().then((x) => {
                          if (x.includes("Encrypt")) {
                            props.func(res, filetype, fileName, "Encrypt");
                          } else {
                            props.func(res, filetype, fileName, "Decrypt");
                          }
                        });
                      };
                    } else {
                      props.func(res, filetype, fileName, "Decrypt");
                    }
                  };
                  const file = this.response;
                  reader.readAsDataURL(file);
                };
                xhr.send();
                removeFile(
                  `/api/googleDrive/removeDriveImg?path=./public/temp_drive/${fileId + fileName
                  }`
                );
                return response.data;
              } else {
                alert("Allow permission to the file: Anyone with the link");
              }
            })
            .catch((error) => { });
        }
      },
    });
  };
  useEffect(() => {
    let localUserData = GetUserDataFromLocalStorage("user") || "";
    (!localUserData || localUserData === "") &&
      props.setError({
        isError: true,
        ErrorMsg: process.env.errorMessage,
        showHide: true,
        redirectTo: mobileRegister
      });
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    userData && setuser(userData);
  }, []);
  return (
    <>
      <Link href="" aria-label="Google drive button">
        <a onClick={() => handleOpenPicker()}>
          <img src="/images/google.png" alt="socail_media_icons" />
        </a>
      </Link>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    // Error Message For Api Fail
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(TOGGLE_MODAL()),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: path })),
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleDrive);
