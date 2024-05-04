/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";

const URL_CATEGORIES: string = `${BASE_URL_AUTH}/categories`;

export const listCategories = async (
  pageNumber: number = 1,
  sort: string = "asc",
  keyword: string | undefined
) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_CATEGORIES}/page/${pageNumber}?sort=${sort}${
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
interface categoryRequest {
  name: string;
  alias: string;
}
export const createCategory = async ({
  data,
  image,
}: {
  data: categoryRequest;
  image: File | undefined;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("alias", data.alias);
  if (image) {
    formData.append("file", image);
  }
  try {
    const resp = await instanceAxios.post(URL_CATEGORIES, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getCategory = async (id: string | undefined) => {
  try {
    const resp = await instanceAxios.get(`${URL_CATEGORIES}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async ({
  data,
  image,
  id,
}: {
  data: categoryRequest;
  image: File | undefined;
  id: string | undefined;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("alias", data.alias);
  if (image) {
    formData.append("file", image);
  }
  try {
    const resp = await instanceAxios.put(`${URL_CATEGORIES}/${id}`, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const resp = await instanceAxios.delete(`${URL_CATEGORIES}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};
