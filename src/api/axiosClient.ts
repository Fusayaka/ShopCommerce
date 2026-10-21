import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '../config';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: CONFIG.API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

const MAX_RETRIES = 3;
const RETRY_METHODS = ['get', 'head', 'options'];
const RETRY_STATUSES = [408, 429, 500, 502, 503, 504];

type RetryConfig = InternalAxiosRequestConfig & { _retryCount?: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error: AxiosError): boolean {
    if (axios.isCancel(error)) return false;

    const method = error.config?.method?.toLowerCase();
    if (!method || !RETRY_METHODS.includes(method)) return false;

    if (!error.response) return true;

    return RETRY_STATUSES.includes(error.response.status);
}

function getRetryDelay(error: AxiosError, attempt: number): number {
    const retryAfter = error.response?.headers?.['retry-after'];
    if (retryAfter) {
        const seconds = Number(retryAfter);
        if (!Number.isNaN(seconds)) return seconds * 1000;
    }
    return 1000 * 2 ** (attempt - 2) + 5000;
}

// TODO: implement Authen first
axiosClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token && config.headers){
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        // Transparently retry transient failures before surfacing an error.
        const config = error.config as RetryConfig | undefined;
        if (config && isRetryable(error)) {
            config._retryCount = config._retryCount ?? 0;
            if (config._retryCount < MAX_RETRIES) {
                config._retryCount += 1;
                await sleep(getRetryDelay(error, config._retryCount));
                return axiosClient(config);
            }
        }

        if (error.response){
            const raw = (error.response.data as { message?: string | string[] })?.message;
            const message = Array.isArray(raw) ? raw.join(", ") : raw;
            const status = error.response.status;

            switch (status){
                case 400:
                    toast.error(message || "Invalid request. Please check your input.");
                    break;
                case 401:
                    toast.error("Your session has expired. Please sign in again.");
                    break;
                case 402:
                    toast.error("Payment is required to continue.");
                    break;
                case 403:
                    toast.error("You don't have permission to perform this action.");
                    break;
                case 404:
                    toast.error(message || "We couldn't find what you were looking for.");
                    break;
                case 408:
                    toast.error("The request timed out. Please try again.");
                    break;
                case 429:
                    toast.error("Too many request. Please try again later!");
                    break;
                case 500:
                    toast.error("Something went wrong on our end. Please try again later.");
                    break;
                case 502:
                    toast.error("The server is temporarily unavailable. Please try again.");
                    break;
                case 504:
                    toast.error("The server took too long to respond. Please try again.");
                    break;
                case 511:
                    toast.error("Network authentication is required to access this resource.");
                    break;
                default:
                    toast.error(message || "Something went wrong. Please try again.");
            }
        }
        else if (error.request){
            toast.error("Internet error. Please check the Internet!");
        }
        else {
            toast.error(`System error: ${error.message}`)
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
