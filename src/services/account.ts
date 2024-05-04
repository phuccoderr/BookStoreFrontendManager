import instanceAxios, { BASE_URL_AUTH } from "./accessToken";
const URL_ACCOUNT: string = `${BASE_URL_AUTH}/account`;
/* eslint-disable no-useless-catch */

interface accountRequest {
  email: string;
  name: string;
  password?: string;
  confirmPassword?: string;
  enabled: boolean;
}
export const updateAccount = async ({
  data,
  image,
  id,
}: {
  data: accountRequest;
  image: File | undefined;
  id: number;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("name", data.name);
  if (data.password) {
    formData.append("password", data.password);
  }
  formData.append("enabled", data.enabled ? "true" : "false");
  if (image) {
    formData.append("file", image);
  }
  try {
    const resp = await instanceAxios.post(`${URL_ACCOUNT}/${id}`, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};
