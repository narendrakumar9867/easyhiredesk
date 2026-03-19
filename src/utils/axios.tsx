import axios, { AxiosInstance} from "axios";

const backendServerUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "";
const normalizedBackendServerUrl = backendServerUrl.replace(/\/+$/, "");

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: normalizedBackendServerUrl ? `${normalizedBackendServerUrl}/api` : "/api",
    withCredentials: true,
})