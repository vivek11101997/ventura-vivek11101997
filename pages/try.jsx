import Script from "next/script";
import ButtonUI from "../components/ui/Button.component";

export default function Try() {
  const jwtToken =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkMWUxNiIsImhhc2giOiI3MTZjZDRjMjEyYjAyNGVkM2VkYTM1MWVmZjY1ODhiYzc1N2U4ZWViMmFkMmRiZDdlZTc2M2E1NjhhMTI4ZjQ4IiwiaWF0IjoxNjY2NzAxMzYzLCJleHAiOjE2NjY3MzczNjMsImp0aSI6ImFkMGIwZjYzLTk4ZDEtNGI5Ny1iZDMxLWVkMmY4ODQxYWVjYSJ9.iE-TO2HAoaCd9_8daj8aN1ubTGTbLmbEFvyNCV1sONRVT6u1dtL_4kOaS35g39XxoGGe4skflizn-OCZiXzMjJKCzvVhuZvZwWLTF7HtwzerAW1-0tBRnMpYQDdTQO4RryOc0LgcrbLbnSHAJiQ9uBOrb4T-ssGhPJHrDdeef1s"

  function hyperSnapSDKInit() {
    window.HyperSnapSDK.init(jwtToken, window.HyperSnapParams.Region.AsiaPacific);
  }

  const handler = (HVError, HVResponse) => {
    if (HVError) {
      document.getElementById("div1").innerHTML 
    
    } else {
      
      document.getElementById("div1").innerHTML 
    

    }
  };

  // OCR Module

  //liveness module
  function runLiveness() {
    hyperSnapSDKInit();
    window.HyperSnapSDK.startUserSession("test");

    const hvFaceConfig = new window.HVFaceConfig();
    hvFaceConfig.setShouldShowInstructionPage(true);


    window.HVFaceModule.start(hvFaceConfig, handler);
  }

  return (
    <>
      <br />
      <br />
      <ButtonUI onClick={runLiveness}>
        Liveness Flow
      </ButtonUI>
      <br />
      <br />

      <br />
      <br />
      <div id="div1" ></div>
      <Script src="https://hv-camera-web-sg.s3.ap-southeast-1.amazonaws.com/hyperverge-web-sdk@5.2.4/src/sdk.min.js"></Script>
    </>
  );
}
