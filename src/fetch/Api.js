import Axios from "axios"
import customCode from "./CustomCode"
import qs from "qs"
import Vue from 'vue'
import {Message, Loading} from 'element-ui';

//定义loading变量
let loading

/**
 * 开始加载页面
 */
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

/**
 * 结束加载页面
 */
function endLoading() {
    loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0

export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}


// Axios.defaults.baseURL = 'http://192.168.0.199:3300';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    startLoading()
    return config;
}, function (error) {
    endLoading()
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
    endLoading()

    var code = response.data.code;
    if (code && code == 200) {
        return response.data;
    } else if (code && code == 201) {
        return null;
    } else if (code && code == 403) {
        Message.warning(`没有权限访问 , 需要权限请联系管理员`);
    } else if (code && code == 401) {
        Message.error(`session 失效 , 用户需要重新登录`);
        this.$router.push('/login');
    } else {
        customCode.ValidCode(code)
    }
    return response;
}, function (error) {
    endLoading()
    // 对响应错误做点什么
    return Promise.reject(error);
});

export function postFetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.post(Vue.prototype.HOST + url, params)
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

export function postFetchHeader(url, params, header) {
    return new Promise((resolve, reject) => {
        Axios.post(Vue.prototype.HOST + url,
            qs.stringify(params), {
                headers: header
            })
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
        Axios.put(Vue.prototype.HOST + url, params)
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
        Axios.delete(Vue.prototype.HOST + url, {params: params})
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
        Axios.get(Vue.prototype.HOST + url, {params: params})
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
     * 获取验证码
     */
    getCode(param) {
        return getFetch("/system/code/" + param)
    },
    /**
     * 登录
     */
    loginByUsername(param) {
        var header = {
            'Authorization': 'Basic aG9tZToxMjM0NTY='
        }
        var params = {
            grant_type: 'password',
            scope: 'all',
            username: param.username,
            password: param.password,
            code: param.code,
            random: param.random
        }
        return postFetchHeader('/authorization/oauth/token', params, header)
    },
    /**
     * 获取管理员信息
     */
    getAdminByPrimaryKey(primaryKey) {
        return getFetch("/system/admin/" + primaryKey)
    },
    /**
     * 获取管理员信息
     */
    getAdminByAccount(account) {
        return getFetch("/system/admin/account", {account: account})
    },
    /**
     * 获取管理员列表
     */
    getAdminPage(page, size) {
        return getFetch("/system/admin/page", {page: page, size: size})
    },
    /**
     * 添加管理员
     */
    saveAdmin(param) {
        return postFetch('/system/admin/', param)
    },
    /**
     * 修改管理员
     */
    modifyAdmin(param) {
        return putFetch('/system/admin/', param)
    },
    /**
     * 删除管理员
     */
    deleteAdmin(param) {
        return postFetch('/system/admin/delete', param)
    },
    /**
     * 获取角色列表
     */
    getRoleAll() {
        return getFetch("/system/role/all")
    },
    /**
     * 获取管理员已经分配的角色
     */
    getHasRoleByAccount(account) {
        return getFetch("/system/role/has", {account: account})
    },
    /**
     * 管理员分配角色
     */
    adminAssignRole(param) {
        return postFetch('/system/admin/assign-role', param)
    },
    /**
     * 根据主键Id获取权限信息
     */
    getAuthorizationByPrimaryKey(param) {
        return getFetch('/system/authorization/' + param)
    },
    /**
     * 获取管理员权限
     */
    getAuthorizationByAccount(account) {
        return getFetch("/system/authorization/account", {account: account})
    },
    /**
     * 获取管理员权限
     */
    getAuthorizationTree(parentId, terminalType, childType) {
        return getFetch("/system/authorization/", {
            parentId: parentId,
            terminalType: terminalType,
            childType: childType
        })
    },
    /**
     * 添加权限
     */
    addAuthorization(param) {
        return postFetch("/system/authorization/", param);
    },
    /**
     * 修改权限
     */
    editAuthorization(param) {
        return putFetch("/system/authorization/", param);
    },
    /**
     * 删除权限
     */
    deleteAuthorization(param) {
        return deleteFetch("/system/authorization/", {primaryKey: param});
    },
    /**
     * 获取角色列表
     */
    getRoleList() {
        return getFetch("/system/role/");
    },
    /**
     * 获取角色信息
     */
    getRole(param) {
        return getFetch("/system/role/" + param);
    },
    /**
     * 保存角色信息
     */
    saveRole(param) {
        return postFetch("/system/role/", param);
    },
    /**
     * 修改权限
     */
    editRole(param) {
        return putFetch("/system/role/", param);
    },
    /**
     * 删除角色
     */
    deleteRole(param) {
        return deleteFetch("/system/role/", {primaryKey: param});
    },
    /**
     * 获取角色已经分配的权限Id集合
     */
    getHasAuthorizationByRole(roleId) {
        return getFetch("/system/authorization/has", {roleId: roleId})
    },
    /**
     * 角色分配权限
     */
    roleAssignAuthorization(param) {
        return postFetch("/system/authorization/assign", param);
    },
}

