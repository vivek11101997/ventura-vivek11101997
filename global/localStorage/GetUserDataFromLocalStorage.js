const CryptoJS = require("crypto-js");
const GetUserDataFromLocalStorage = (key) => {
  const EncryptedData = localStorage.getItem(key) || "";
  if(EncryptedData ){
    const data = CryptoJS.AES.decrypt(
      EncryptedData,
      process.env.LocalStorageEncryptionKey
    ).toString(CryptoJS.enc.Utf8);
    return data && data !== "" ? JSON.parse(data) : "";
  }else{
    return ""; 
  }
 
};

export default GetUserDataFromLocalStorage;
