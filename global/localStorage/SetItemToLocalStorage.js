const CryptoJS = require("crypto-js");
const SetItemToLocalStorage = function (name, value) {
  const EncryptValue = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    process.env.LocalStorageEncryptionKey
  ).toString();
  localStorage.setItem(name, EncryptValue);
};

export default SetItemToLocalStorage;
