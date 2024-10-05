import { Axios, type AxiosResponse } from "axios"
import axiosErrorDecorator from "@/core/decorators/axiosErrorDecorator"

/**
 * Provides base operations on http api
 */

export interface IApiService {
    /**
     * Base url for http client
     */
    baseUrl: string
    /**
     * GET request
     * @param url resource url
     * @param params query params
     */
    get<T>(url: string, params?: object): Promise<AxiosResponse<T>>,
    /**
     * POST request
     * @param url resource url
     * @param data request body
     */
    post(url: string, data?: object): Promise<AxiosResponse>,
    /**
     * POST request, with created data
     * @param url resource url
     * @param data request body
     */
    post<T>(url: string, data?: object): Promise<AxiosResponse<T>>,
    /**
     * PUT request
     * @param url resource url
     * @param data request body
     */
    put(url: string, data?: object): Promise<AxiosResponse>,
    /**
         * PATCH request
         * @param url resource url
         * @param data request body
         */
    patch(url: string, data?: object): Promise<AxiosResponse>,

    /**
     * DELETE request
     * @param url resource url
     */
    delete(url: string): Promise<AxiosResponse>
}

/**
 * Base class for define Api Services
 */

export class ApiService implements IApiService {
    private _axios: Axios

    constructor(public baseUrl: string) {
        this._axios = new Axios({
            baseURL: baseUrl,
            responseEncoding:'utf-8',
            transformResponse: (response) => {
                try {
                    return JSON.parse(response)
                }
                catch{
                    return response
                }
            },
            transformRequest: (request) => {
                return JSON.stringify(request)
            },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            },
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
    /**@inheritdoc */
    @axiosErrorDecorator()
    async get<T>(url: string, params?: object): Promise<AxiosResponse<T, any>> {
        return await this._axios.get<T>(url, { params })
    }

    /**@inheritdoc */
    async post(url: string, data?: object): Promise<AxiosResponse<any, any>>
    @axiosErrorDecorator()
    async post<T>(url: string, data?: object): Promise<AxiosResponse<T, any>> {
        const response = await this._axios.post<T>(url, data)
        if (response.data == null && response.headers["Location"]) {
            return await this._axios.get(response.headers["Location"])
        }
        return response
    }

    /**@inheritdoc */
    @axiosErrorDecorator()
    put(url: string, data?: object): Promise<AxiosResponse<any, any>> {
        return this._axios.put(url, data)
    }

    /**@inheritdoc */
    @axiosErrorDecorator()
    patch(url: string, data?: object): Promise<AxiosResponse<any, any>> {
        return this._axios.patch(url, data)
    }

    /**@inheritdoc */
    @axiosErrorDecorator()
    delete(url: string): Promise<AxiosResponse<any, any>> {
        return this._axios.delete(url)
    }

    /**
     * Add Bearer token to axios
     * @param token Bearer token
     */
    protected useToken(token: string): void {
        // this._axios.defaults.headers.common["Authorization"] = `Bearer: ${token}`
    }
}

export default ApiService
