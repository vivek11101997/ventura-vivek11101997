

const CryptoJS = require("crypto-js");
const setStorageSessionItem = function (name, value) {
  const EncryptValue = CryptoJS.AES.encrypt(JSON.stringify(value), process.env.LocalStorageEncryptionKey).toString();
  sessionStorage.setItem(name, EncryptValue);
};

export default setStorageSessionItem;
