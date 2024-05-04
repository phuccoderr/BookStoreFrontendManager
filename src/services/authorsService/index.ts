/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";

const URL_AUTHORS: string = `${BASE_URL_AUTH}/authors`;

export const listAuthors = async (
  pageNumber: number = 1,
  sort: string = "asc",
  keyword: string | undefined
) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_AUTHORS}/page/${pageNumber}?sort=${sort}${
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

interface authorRequest {
  name: string;
  date_of_birth: Date;
}

export const createAuthor = async ({ name, date_of_birth }: authorRequest) => {
  const day = date_of_birth.getDate().toString().padStart(2, "0");
  const month = (date_of_birth.getMonth() + 1).toString().padStart(2, "0");
  const year = date_of_birth.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const data = { name, date_of_birth: formattedDate };
  try {
    const resp = await instanceAxios.post(URL_AUTHORS, data);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateAuthor = async ({
  data,
  id,
}: {
  data: authorRequest;
  id: string | undefined;
}) => {
  const day = data.date_of_birth.getDate().toString().padStart(2, "0");
  const month = (data.date_of_birth.getMonth() + 1).toString().padStart(2, "0");
  const year = data.date_of_birth.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const updateData = { name: data.name, date_of_birth: formattedDate };
  try {
    const resp = await instanceAxios.put(`${URL_AUTHORS}/${id}`, updateData);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getAuthor = async (id: string | undefined) => {
  try {
    const resp = await instanceAxios.get(`${URL_AUTHORS}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteAuthor = async (id: number) => {
  try {
    const resp = await instanceAxios.delete(`${URL_AUTHORS}/${id}`);
    return {
      status: resp?.status,
      statusText: resp?.statusText,
      data: resp?.data,
    };
  } catch (error) {
    throw error;
  }
};
