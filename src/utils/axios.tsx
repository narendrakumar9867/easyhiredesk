import axios, { AxiosInstance} from "axios";

const backendServerUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "";
const normalizedBackendServerUrl = backendServerUrl.replace(/\/+$/, "");
const hasApiSuffix = /\/api$/i.test(normalizedBackendServerUrl);

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: normalizedBackendServerUrl
        ? hasApiSuffix
            ? normalizedBackendServerUrl
            : `${normalizedBackendServerUrl}/api`
        : "/api",
    withCredentials: true,
})