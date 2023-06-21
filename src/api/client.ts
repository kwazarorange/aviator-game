import axios, { AxiosError } from "axios";

const apiClient = axios.create();

apiClient.interceptors.response.use(
  (res) => res,
  (_: AxiosError) => ({ data: { ok: false, data: null } })
);

export default apiClient;
