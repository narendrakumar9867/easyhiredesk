import axios, { AxiosInstance} from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
})