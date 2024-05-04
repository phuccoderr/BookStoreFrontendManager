/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";
const URL_USERS: string = `${BASE_URL_AUTH}/users`;

interface userRequest {
  email: string;
  name: string;
  password?: string;
  confirmPassword?: string;
  enabled: boolean;
  role: string;
}
type file = File;
type userId = string | undefined;

export const listUsers = async (
  pageNumber: number = 1,
  sort: string = "asc",
  keyword: string | undefined
) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_USERS}/page/${pageNumber}?sort=${sort}${
        keyword === undefined ? "" : "&keyword=" + keyword
      }`
    );
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string | undefined) => {
  try {
    const resp = await instanceAxios.get(`${URL_USERS}/${userId}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const saveUser = async ({
  data,
  image,
}: {
  data: userRequest;
  image: file | undefined;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("name", data.name);
  if (data.password) {
    formData.append("password", data.password);
  }
  formData.append("enabled", data.enabled ? "true" : "false");
  formData.append("role", data.role);
  if (image) {
    formData.append("file", image);
  }
  try {
    const resp = await instanceAxios.post(URL_USERS, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const putUser = async ({
  data,
  image,
  id,
}: {
  data: userRequest;
  image: file | undefined;
  id: userId;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("name", data.name);
  formData.append("enabled", data.enabled ? "true" : "false");
  if (image) {
    formData.append("file", image);
  }
  try {
    const resp = await instanceAxios.put(`${URL_USERS}/${id}`, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const resp = await instanceAxios.delete(`${URL_USERS}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};
