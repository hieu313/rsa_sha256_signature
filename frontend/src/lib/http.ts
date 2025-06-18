import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import envConfig from "@/constants/env-config";
import axios, { AxiosInstance } from "axios";
import Cookie from "js-cookie";

const baseURL: string = envConfig.NEXT_PUBLIC_API_ENDPOINT;

const http: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

http.interceptors.request.use(
  function (config) {
    const token = Cookie.get(AUTH_COOKIE_NAME);
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
