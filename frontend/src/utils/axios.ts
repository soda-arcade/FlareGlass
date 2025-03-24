import axios from 'axios';

// Set axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

/**
 * Make a GET request.
 * 
 * @param url URL to request.
 * @param params Request parameters.
 */
async function get(url: string, params?: any) {
    return await axios.get(url, { params });
};

/**
 * Make a POST request.
 * 
 * @param url URL to request.
 * @param data Request data.
 */
async function post(url: string, data?: any) {
    return await axios.post(url, data);
}

/**
 * Make a PUT request.
 * 
 * @param url URL to request.
 * @param data Request data.
 */
async function put(url: string, data?: any) {
    return await axios.put(url, data);
}

/**
 * Make a DELETE request.
 * 
 * @param url URL to request.
 * @param data Request data.
 */
async function del(url: string, data?: any) {
    return await axios.delete(url, { data: data });
}

export { get, post, put, del };