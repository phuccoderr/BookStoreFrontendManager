import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const BASE_URL_AUTH: string = "http://localhost:5248/api/auth";

type nsType = string | null;
const instanceAxios = axios.create({
  baseURL: `${BASE_URL_AUTH}`,
});

instanceAxios.interceptors.request.use((config) => {
  const access_token: nsType = localStorage.getItem("access_token");
  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode<JwtPayload>(access_token ?? "");

  if (!access_token) {
    window.location.href = "/login";
  }
  if (decoded?.exp && decoded.exp < currentTime) {
    window.location.href = "/login";
    localStorage.removeItem("info");
    localStorage.removeItem("access_token");
  }

  config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

export default instanceAxios;
