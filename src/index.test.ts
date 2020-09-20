import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const reCaptchaSecret = "super_duper_secret_string";
process.env = Object.assign(process.env, { RECAPTCHA_SECRET: reCaptchaSecret });

import ValidateRecaptcha, { reCaptchaURL } from ".";

describe("recaptcha-validator", () => {
  const token = "my_validation_token";

  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  test("api error", () => {
    const errMsg = "failed to reach recaptcha";

    mockedAxios.post.mockReturnValue(Promise.reject(errMsg));

    expect(ValidateRecaptcha(token)).rejects.toEqual(errMsg);
  });

  test("hits recaptcha endpoint", async () => {
    let capturedArgs;
    mockedAxios.post.mockImplementation((reCaptchaURL, formData, config) => {
      capturedArgs = {
        reCaptchaURL,
        formData, // TODO testing the values in this one is a pain...
        config,
      };
      return Promise.resolve({
        data: {
          success: true,
        },
      });
    });

    const res = await ValidateRecaptcha(token);

    expect(res.success).toBeTruthy();
    expect(capturedArgs.reCaptchaURL).toEqual(reCaptchaURL);
    expect(capturedArgs.config.headers["content-type"]).toContain(
      "multipart/form-data; boundary="
    );
  });
});
