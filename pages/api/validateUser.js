import axios from "axios";

export default async function handler(req, handleResponse) {
  try {
    const { id, application, application_version, meta, uuid } = JSON.parse(
      req.body
    );
    const data = JSON.stringify({
      id: id,
      application: application,
      application_version: application_version,
      meta: meta,
      uuid: uuid,
    });
    const config = {
      method: "post",
      url: `https://sso-stage.ventura1.com/auth/user/v3/validateuser`,
      headers: {
        "x-api-key": process.env.VENTURA_APP_SSO_API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        let responseData = response.data;
        responseData["sessionId"] = response.headers.session_id || "";
        handleResponse.json(responseData);
      })
      .catch(function (error) {
        handleResponse.json({ error: error });
      });
  } catch (error) {
    handleResponse.json({ error: error });
  }
}
