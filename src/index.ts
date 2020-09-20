import axios from "axios";
import FormData from "form-data";

const reCaptchaSecret = process.env.RECAPTCHA_SECRET;
export const reCaptchaURL = "https://www.google.com/recaptcha/api/siteverify";

export interface RecaptchaValidation {
  success: boolean;
}

export default async (token: string): Promise<RecaptchaValidation> => {
  const formData = new FormData();

  formData.append("secret", reCaptchaSecret);
  formData.append("response", token);

  const config = {
    headers: formData.getHeaders(),
  };

  const res = await axios.post(reCaptchaURL, formData, config);
  return res.data;
};
