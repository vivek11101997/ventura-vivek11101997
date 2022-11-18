const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require("next/constants");

module.exports = (phase) => {
  switch (phase) {
    case PHASE_DEVELOPMENT_SERVER:
      return {
        reactStrictMode: true,
        env: {
          errorMessage: "Something went wrong",
          LocalStorageEncryptionKey: "venturaProduction",
          CO_BASE_URL: "https://kyc-stage.ventura1.com/onboarding/v2",
          SSO_Base_URL: "${process.env.SSO_Base_URL}",
          GOOGLE_DRIVE_CLIENT_ID:
            "116016502755-vh5nd15aai5dgbbra9fkj44tfd3fb651.apps.googleusercontent.com",
          GOOGLE_DRIVE_API_KEY: "AIzaSyATlthau1u3x965dha1_FU3FD-lhQyjjYs",
          DROP_BOX_API_KEY: "9pv1fkclw80sdou",
          // Ventura Flagsmith key in not working ,using dummy key  17-11-22
          // FLAGSMITH_KEY: "MjPYC5nGJrbmnQ2UiFNvin",
          FLAGSMITH_KEY: "grRdrXHyUuykUCmKVWtc9H",
          digilockerRedirectUrl: "http://localhost:3000/digilocker-result",
          digilockerClientID: "54291870",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN: "firstlogin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN: "login",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN: "forgotpin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_UNLOCK: "unlock",
          VENTURA_APP_SSO_API_KEY: "e77tz4T4nO3z4XphD7umT9LgIKXqM7db2cr5hDuY",
          FINGERPRINTJS_API_KEY: "W6W4WxrjLiG1bICWGpAp",
          HYPERVERGE_JWT_TOKEN:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkMWUxNiIsImhhc2giOiI3MTZjZDRjMjEyYjAyNGVkM2VkYTM1MWVmZjY1ODhiYzc1N2U4ZWViMmFkMmRiZDdlZTc2M2E1NjhhMTI4ZjQ4IiwiaWF0IjoxNjY4MDc2NTM2LCJleHAiOjE2NjgxMTk3MzYsImp0aSI6IjIyNjBiY2RiLThkZmUtNDE1Ny05ZWU2LTljYTcwYmRjOGQ2NCJ9.RzQD28S4rBrRIzYL6J0CxxyTIXbjkiiqfH80xdO0a_QwIOtMBcX3MkjYDZce4bJ0d_lWdtcRzPEzlAqtklVWd1tg6Tc87kxXY4Rs_0bRdgpLaeQx5M5Nlv_D5UVk3R8htYXTq2WblP33M5gH3VTjuTSvli2VsdSl0XjqsE--Nrs",
          VENTURA_APP_GMAIL_API_KEY: "AIzaSyCrDQB-Q-azf7CSp1g63-_u3dBdGgX09Zk",
          VENTURA_APP_GMAIL_AUTH_DOMAIN: "ventura-2-0.firebaseapp.com",
          VENTURA_APP_GMAIL_DATABASE_URL: "",
          VENTURA_APP_GMAIL_PROJECT_ID: "ventura-2-0",
          VENTURA_APP_GMAIL_STORAGE_BUCKET: "ventura-2-0.appspot.com",
          VENTURA_APP_GMAIL_MESSAGING_SENDER_ID: "307487445108",
          VENTURA_APP_GMAIL_APP_ID: "1:307487445108:web:6ed9f88fa138e1c3eac121",
          VENTURA_APP_GMAIL_MEASUREMENT_ID: "G-TSRZ2QD49F",
        },
      };
    case PHASE_PRODUCTION_SERVER:
      return {
        reactStrictMode: true,
        env: {
          errorMessage: "Something went wrong",
          LocalStorageEncryptionKey: "venturaProduction",
          CO_BASE_URL: "https://kyc-stage.ventura1.com/onboarding/v2",
          SSO_Base_URL: "https://sso-stage.ventura1.com/auth/user",
          DROP_BOX_API_KEY: "9pv1fkclw80sdou",
          FLAGSMITH_KEY: "grRdrXHyUuykUCmKVWtc9H",
          digilockerRedirectUrl:
            "https://web-x-dev.ventura1.com/digilocker-result",
          digilockerClientID: "E7AD0587 ",
          HYPERVERGE_JWT_TOKEN:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkMWUxNiIsImhhc2giOiI3MTZjZDRjMjEyYjAyNGVkM2VkYTM1MWVmZjY1ODhiYzc1N2U4ZWViMmFkMmRiZDdlZTc2M2E1NjhhMTI4ZjQ4IiwiaWF0IjoxNjY3NDc3MTY0LCJleHAiOjE2Njc1MTMxNjQsImp0aSI6ImQ5OGRhYTA4LWZiMWMtNDlkMS05YWVkLTFhZWY5YmYzYzc1YyJ9.C6nNhvmq0j0YX6AJDjuzl3JPjUN3sziuhhJ557YTyfj8oRfofA31YeobIDuLoWXXqXcNNCrHU0XsJPrs1OB1DLbdJaLN2BgTE14N_VI8gRhpRVenzXh28xX5bM2OxWKchopi7TR13wsEobXcoZ_UWOVw3z3ILKe_g_PSQdD5_U4",
          VENTURA_APP_GMAIL_API_KEY: "AIzaSyCrDQB-Q-azf7CSp1g63-_u3dBdGgX09Zk",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN: "firstlogin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN: "login",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN: "forgotpin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_UNLOCK: "unlock",
          VENTURA_APP_SSO_API_KEY: "e77tz4T4nO3z4XphD7umT9LgIKXqM7db2cr5hDuY",
          VENTURA_APP_GMAIL_AUTH_DOMAIN: "ventura-2-0.firebaseapp.com",
          VENTURA_APP_GMAIL_DATABASE_URL: "",
          VENTURA_APP_GMAIL_PROJECT_ID: "ventura-2-0",
          VENTURA_APP_GMAIL_STORAGE_BUCKET: "ventura-2-0.appspot.com",
          VENTURA_APP_GMAIL_MESSAGING_SENDER_ID: "307487445108",
          VENTURA_APP_GMAIL_APP_ID: "1:307487445108:web:6ed9f88fa138e1c3eac121",
          VENTURA_APP_GMAIL_MEASUREMENT_ID: "G-TSRZ2QD49F",
        },
      };

    case PHASE_PRODUCTION_BUILD:
      return {
        reactStrictMode: true,
        env: {
          errorMessage: "Something went wrong",
          LocalStorageEncryptionKey: "venturaProduction",
          CO_BASE_URL: "https://kyc-stage.ventura1.com/onboarding/v2",
          SSO_Base_URL: "https://sso-stage.ventura1.com/auth/user",
          DROP_BOX_API_KEY: "9pv1fkclw80sdou",
          FLAGSMITH_KEY: "grRdrXHyUuykUCmKVWtc9H",
          digilockerRedirectUrl: "http://localhost:3000/digilocker-result",
          digilockerClientID: "54291870",
          FINGERPRINTJS_API_KEY: "W6W4WxrjLiG1bICWGpAp",
          HYPERVERGE_JWT_TOKEN:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkMWUxNiIsImhhc2giOiI3MTZjZDRjMjEyYjAyNGVkM2VkYTM1MWVmZjY1ODhiYzc1N2U4ZWViMmFkMmRiZDdlZTc2M2E1NjhhMTI4ZjQ4IiwiaWF0IjoxNjY3NDc3MTY0LCJleHAiOjE2Njc1MTMxNjQsImp0aSI6ImQ5OGRhYTA4LWZiMWMtNDlkMS05YWVkLTFhZWY5YmYzYzc1YyJ9.C6nNhvmq0j0YX6AJDjuzl3JPjUN3sziuhhJ557YTyfj8oRfofA31YeobIDuLoWXXqXcNNCrHU0XsJPrs1OB1DLbdJaLN2BgTE14N_VI8gRhpRVenzXh28xX5bM2OxWKchopi7TR13wsEobXcoZ_UWOVw3z3ILKe_g_PSQdD5_U4",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN: "firstlogin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN: "login",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN: "forgotpin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_UNLOCK: "unlock",
          VENTURA_APP_SSO_API_KEY: "e77tz4T4nO3z4XphD7umT9LgIKXqM7db2cr5hDuY",
          VENTURA_APP_GMAIL_API_KEY: "AIzaSyCrDQB-Q-azf7CSp1g63-_u3dBdGgX09Zk",
          VENTURA_APP_GMAIL_AUTH_DOMAIN: "ventura-2-0.firebaseapp.com",
          VENTURA_APP_GMAIL_DATABASE_URL: "",
          VENTURA_APP_GMAIL_PROJECT_ID: "ventura-2-0",
          VENTURA_APP_GMAIL_STORAGE_BUCKET: "ventura-2-0.appspot.com",
          VENTURA_APP_GMAIL_MESSAGING_SENDER_ID: "307487445108",
          VENTURA_APP_GMAIL_APP_ID: "1:307487445108:web:6ed9f88fa138e1c3eac121",
          VENTURA_APP_GMAIL_MEASUREMENT_ID: "G-TSRZ2QD49F",
        },
      };
    case PHASE_EXPORT:
      return {
        reactStrictMode: true,
        env: {
          errorMessage: "Something went wrong",
          LocalStorageEncryptionKey: "venturaProduction",
          CO_BASE_URL: "https://kyc-stage.ventura1.com/onboarding/v2",
          SSO_Base_URL: "${process.env.SSO_Base_URL}/",
          DROP_BOX_API_KEY: "9pv1fkclw80sdou",
          FLAGSMITH_KEY: "grRdrXHyUuykUCmKVWtc9H",
          digilockerRedirectUrl: "http://localhost:3000/digilocker-result",
          digilockerClientID: "54291870",
          FINGERPRINTJS_API_KEY: "W6W4WxrjLiG1bICWGpAp",
          HYPERVERGE_JWT_TOKEN:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkMWUxNiIsImhhc2giOiI3MTZjZDRjMjEyYjAyNGVkM2VkYTM1MWVmZjY1ODhiYzc1N2U4ZWViMmFkMmRiZDdlZTc2M2E1NjhhMTI4ZjQ4IiwiaWF0IjoxNjY3NDc3MTY0LCJleHAiOjE2Njc1MTMxNjQsImp0aSI6ImQ5OGRhYTA4LWZiMWMtNDlkMS05YWVkLTFhZWY5YmYzYzc1YyJ9.C6nNhvmq0j0YX6AJDjuzl3JPjUN3sziuhhJ557YTyfj8oRfofA31YeobIDuLoWXXqXcNNCrHU0XsJPrs1OB1DLbdJaLN2BgTE14N_VI8gRhpRVenzXh28xX5bM2OxWKchopi7TR13wsEobXcoZ_UWOVw3z3ILKe_g_PSQdD5_U4",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FIRST_LOGIN: "firstlogin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_LOGIN: "login",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_FORGOT_PIN: "forgotpin",
          VENTURA_APP_SSO_JOURNEY_KEYWORD_UNLOCK: "unlock",
          VENTURA_APP_SSO_API_KEY: "e77tz4T4nO3z4XphD7umT9LgIKXqM7db2cr5hDuY",
          VENTURA_APP_GMAIL_API_KEY: "AIzaSyCrDQB-Q-azf7CSp1g63-_u3dBdGgX09Zk",
          VENTURA_APP_GMAIL_AUTH_DOMAIN: "ventura-2-0.firebaseapp.com",
          VENTURA_APP_GMAIL_DATABASE_URL: "",
          VENTURA_APP_GMAIL_PROJECT_ID: "ventura-2-0",
          VENTURA_APP_GMAIL_STORAGE_BUCKET: "ventura-2-0.appspot.com",
          VENTURA_APP_GMAIL_MESSAGING_SENDER_ID: "307487445108",
          VENTURA_APP_GMAIL_APP_ID: "1:307487445108:web:6ed9f88fa138e1c3eac121",
          VENTURA_APP_GMAIL_MEASUREMENT_ID: "G-TSRZ2QD49F",
        },
      };
  }
};
