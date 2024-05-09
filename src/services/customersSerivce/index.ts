/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";
const URL_CUSTOMERS: string = `${BASE_URL_AUTH}/customers`;

export const listCustomers = async (
  pageNumber: number = 1,
  sort: string = "asc",
  keyword: string | undefined
) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_CUSTOMERS}/page/${pageNumber}?sort=${sort}${
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

export const enabledCustomer = async ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  try {
    const resp = await instanceAxios.get(
      `${URL_CUSTOMERS}/${id}/enabled/${enabled}`
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
