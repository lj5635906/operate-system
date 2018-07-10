import Axios from "axios"
import customCode from "./CustomCode"
import qs from "qs"

Axios.defaults.baseURL = 'http://192.168.0.199:3300';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    var code = response.data.code;
    if (code == 200) {
        console.log("状态码：" + code)
    } else if (code == 201) {
        console.log("状态码：" + code)
    } else if (code == 400) {
        console.log("状态码：" + code)
    } else if (code == 401) {
        console.log("状态码：" + code)
    } else if (code == 500) {
        console.log("状态码：" + code)
        alert("服务器繁忙，稍后再试")
    } else {
        customCode.ValidCode(code);
        return Promise.reject(error);
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export function postFetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function putFetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.put(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Axios 的删除传参 和 get 一样，所以用 qs 来转换为RequestBody
 */
export function deleteFetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.delete(url, {params: params})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function getFetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.get(url, {params: params})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * 登录请求
 * @param data 登录参数
 * @returns {AxiosPromise}
 */
export default {
    /**
     * 登录
     */
    login(param) {
        return postFetch('/login', param)
    },
    /**
     * 获取管理员信息
     */
    getAdmin(primaryKey) {
        return getFetch("/system/admin", {primaryKey: primaryKey})
    },
    /**
     * 添加角色
     */
    saveRole(param) {
        return postFetch('/system/admin/role', param)
    },
    /**
     * 修改角色
     */
    updateRole(param) {
        return putFetch('/system/admin/role', param)
    },
    /**
     * 修改角色
     */
    deleteRole(param) {
        return deleteFetch('/system/admin/role', param)
    }
}

