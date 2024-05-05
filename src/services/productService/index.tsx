/* eslint-disable no-useless-catch */
import { productRequest } from "@/types/product/types";
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";

const URL_PRODUCTS: string = `${BASE_URL_AUTH}/products`;

export const listProducts = async (
  pageNumber: number = 1,
  sort: string = "asc",
  keyword: string | undefined
) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_PRODUCTS}/page/${pageNumber}?sort=${sort}${
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

export const getProduct = async (id: string | undefined) => {
  try {
    const resp = await instanceAxios.get(`${URL_PRODUCTS}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const listProductAuthors = async () => {
  try {
    const resp = await instanceAxios.get(`${URL_PRODUCTS}/authors`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const listProductCategories = async () => {
  try {
    const resp = await instanceAxios.get(`${URL_PRODUCTS}/categories`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const createProduct = async ({
  data,
  image,
  extraImage,
}: {
  data: productRequest;
  image: File | undefined;
  extraImage: File[] | undefined;
}) => {
  const formData = new FormData();

  if (image) {
    formData.append("file", image);
  }

  if (extraImage) {
    extraImage.forEach((file) => {
      formData.append("extraFile", file);
    });
  }

  const json = JSON.stringify(data);
  formData.append("data", json);

  try {
    const resp = await instanceAxios.post(URL_PRODUCTS, formData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async ({
  data,
  image,
  extraImage,
  productId,
}: {
  data: productRequest;
  image: File | undefined;
  extraImage: File[] | undefined;
  productId: string | undefined;
}) => {
  const formData = new FormData();

  if (image) {
    formData.append("file", image);
  }

  if (extraImage) {
    extraImage.forEach((file) => {
      formData.append("extraFile", file);
    });
  }

  const json = JSON.stringify(data);
  formData.append("data", json);

  try {
    const resp = await instanceAxios.put(
      `${URL_PRODUCTS}/${productId}`,
      formData
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

export const deleteProduct = async (id: number) => {
  try {
    const resp = await instanceAxios.delete(`${URL_PRODUCTS}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};
