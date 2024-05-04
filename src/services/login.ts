import axios from "axios";

const BASE_URL_LOGIN: string = "http://localhost:5248/api/login";

interface loginRequest {
  email: string;
  password: string;
}

export const loginUser = async (dataUser: loginRequest) =>
  axios.post(BASE_URL_LOGIN, dataUser);
