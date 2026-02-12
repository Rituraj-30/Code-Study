import axios, { type AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({});

export const apiConnector = (
  method: string,
  url: string,
  bodyData?: any,
  headers?: any,
  params?: any
) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};