// client calls the auth api to get the token from their backend server
const jwtToken = process.env.HYPERVERGE_JWT_TOKEN;
HyperSnapSDK.init(jwtToken, HyperSnapParams.Region.India);
HyperSnapSDK.startUserSession();
let faceImage = "";
let docImage = "";
function runOCR() {
  hvDocConfig = new HVDocConfig();
  hvDocConfig.setOCRDetails(
    "https://ind-docs.hyperverge.co/v2.0/readKYC",
    hvDocConfig.DocumentSide.FRONT,
    {},
    {}
  );
  hvDocConfig.setShouldShowInstructionPage(true);
  HVDocsModule.start(hvDocConfig, callback);
}
function runLiveness() {
  hvFaceConfig = new HVFaceConfig();
  hvFaceConfig.setShouldShowInstructionPage(true);
  hvFaceConfig.setLivenessAPIParameters({
    rejectFaceMask: "yes",
    allowEyesClosed: "no",
    allowMultipleFaces: "no",
  });
  HVFaceModule.start(hvFaceConfig, callback);
}
callback = (HVError, HVResponse) => {
  let HVTextNode = "";
  if (HVError) {
    HVTextNode = HVError;
  } else {
    HVTextNode = HVResponse;
  }
  let para = document.createElement("p");
  let node = document.createTextNode(JSON.stringify(HVTextNode));
  para.appendChild(node)
  let element = document.getElementById("div1");
  element.appendChild(para);
};
