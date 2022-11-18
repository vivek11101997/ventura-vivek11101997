import { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';

const removeFile = (url) => {
    fetch(url, {
        method:'GET'
    })
    .then((response2) => response2)
    .catch((error) => {
    
    })
}

const GoogleDrive = () => {
    const [driveImg, setDriveImg] = useState("");
    let fileName; 
    const [openPicker] = useDrivePicker();
    const handleOpenPicker = () => {
        openPicker({
          clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
          developerKey: process.env.GOOGLE_DRIVE_API_KEY, //API Key
          viewId: "DOCS",
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          multiselect: false,
          callbackFunction: async(data) => {
            if (data.action === 'cancel') {
           
            }
            if(data.docs && data.docs[0].url){
        
                fileName = data.docs[0].name;
                const fileId=data.docs[0].id;
                fetch(`/api/googleDrive/drive?id=${fileId}&url=${data.docs[0].url}&mimeType=${data.docs[0].mimeType}&name=${data.docs[0].name}`, {
                    method:'GET'
                })
                .then((response) => {
                    if(response.status === 200){
                        setDriveImg(`/temp_drive/${fileId+fileName}`);
                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", `/temp_drive/${fileId+fileName}`, true);
                        xhr.responseType = "blob";
                        xhr.onload = function () {
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                const res = event.target.result;
                            }
                            const file = this.response;
                            reader.readAsDataURL(file)
                        };
                        xhr.send();
                        removeFile(`/api/googleDrive/removeDriveImg?path=./public/temp_drive/${fileId+fileName}`);
                        return response.data;
                    }else{
                        alert("Allow permission to the file: Anyone with the link");
                    }
                })
                .catch((error) => {
                    alert(error.response || "Something went wrong !!!");
                })
            }
          },
        })
      }
    
    return(
        <>
            <button onClick={() => handleOpenPicker()}>Open picker</button>
            <img src={driveImg} alt="Drive Image" />
        </>
    )
}
export default GoogleDrive;
