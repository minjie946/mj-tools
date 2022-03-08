var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @description 接口请求的封装
 * @author minjie
 * @Date 2022-03-07 15:11
 * @LastEditTime 2022-03-08 15:35
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import axios from 'axios';
import qs from 'qs';
/** 请求接口中的参数的替换 */
var baseReplaceURL = function (_a, _b) {
    var path = _a.path, type = _a.type;
    var _c = _b.version, version = _c === void 0 ? 'v1' : _c, project = _b.project;
    var url = path;
    if (path.includes('{projectName}') && project)
        url = path.replace('{projectName}', project);
    if (path.includes('{version}') && version)
        url = path.replace('{version}', version);
    return { path: url, type: type };
};
/**
 * 根据接口中的服务名返回 请求的域名和header
 * @param {URLInterface} url 请求接口实体
 * @param {RequestConfigProps} requestConfig 请求的配置
 * @returns {{ baseURL, header }}
 */
var headerHandle = function (_a, _b) {
    var path = _a.path;
    var baseDomainName = _b.baseDomainName, baseHeader = _b.baseHeader, domainList = _b.domainList;
    // 请求的域名
    var domain;
    var header;
    if (domainList) {
        for (var index = 0; index < domainList.length; index++) {
            var dm = domainList[index];
            if (!dm.serviceName) {
                continue;
            }
            else {
                var service = dm.serviceName.find(function (sn) {
                    return typeof sn === 'string' ? path.includes(sn) : path.includes(sn.name);
                });
                if (service) {
                    if (typeof service === 'string') {
                        header = dm.headerRequest;
                        domain = dm.domainName;
                    }
                    else {
                        header = service.header || dm.headerRequest;
                        domain = dm.domainName;
                    }
                    break;
                }
            }
        }
    }
    return {
        baseURL: domain || baseDomainName,
        header: header || baseHeader
    };
};
/** 请求错误的时候的处理 */
var responseError = function (err) {
    var message = err.message, response = err.response;
    if (response) {
        var status_1 = response.status, url = response.config.url;
        err.code = status_1;
        switch (status_1) {
            case 302:
                err.message = '接口重定向了！';
                break;
            case 400:
                err.message = '参数不正确！';
                break;
            case 401:
                err.message = '您未登录，或者登录已经超时，请先登录！';
                break;
            case 403:
                err.message = '您没有权限操作！';
                break;
            case 404:
                err.message = "\u8BF7\u6C42\u8DEF\u5F84\u4E0D\u5B58\u5728: ".concat(url);
                break; // 在正确域名下
            case 408:
                err.message = '请求超时！';
                break;
            case 409:
                err.message = '系统已存在相同数据！';
                break;
            case 500:
                err.message = '服务器内部错误！';
                break;
            case 501:
                err.message = '服务未实现！';
                break;
            case 502:
                err.message = '网关错误！';
                break;
            case 503:
                err.message = '服务不可用！';
                break;
            case 504:
                err.message = '服务暂时无法访问，请稍后再试！';
                break;
            case 505:
                err.message = 'HTTP版本不受支持！';
                break;
            default:
                err.message = '异常问题，请联系管理员！';
                break;
        }
    }
    if (message.includes('timeout')) {
        err.message = '网络请求超时！';
        err.code = 504;
    }
    if (message.includes('Network')) {
        err.message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
        err.code = -7;
    }
    if (axios.isCancel(err)) { // 取消了重复请求
        // console.log('(取消请求 >_< ):' + err.message)
        return Promise.reject(err);
    }
    else {
        return err;
    }
};
var Axios = /** @class */ (function () {
    function Axios(config) {
        var _this = this;
        /** 存储每个请求的值 */
        this.pendingMap = new Map();
        /**
         * 生成每个请求唯一的键
         * @param {*} config
         * @returns string
         */
        this.getPendingKey = function (config) {
            var url = config.url, method = config.method, params = config.params, data = config.data;
            if (typeof data === 'string')
                data = JSON.parse(data); // response里面返回的config.data是个字符串对象
            return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
        };
        /**
         * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
         * @param {*} config
         */
        this.addPending = function (config) {
            var pendingKey = _this.getPendingKey(config);
            config.cancelToken = config.cancelToken || new axios.CancelToken(function (cancel) {
                if (!_this.pendingMap.has(pendingKey)) {
                    _this.pendingMap.set(pendingKey, cancel);
                }
            });
        };
        /**
         * 删除重复的请求
         * @param {*} config
         */
        this.removePending = function (config) {
            var pendingKey = _this.getPendingKey(config);
            if (_this.pendingMap.has(pendingKey)) {
                var cancelToken = _this.pendingMap.get(pendingKey);
                cancelToken(pendingKey);
                _this.pendingMap.delete(pendingKey);
            }
        };
        /**
         * 发送请求
         * @param {URLInterface} url 接口
         * @param {*} params 参数
         * @param {RequestMethodProps} otherConfig 其余配置
         * @returns {Promise<any>}
         */
        this.request = function (url, params, otherConfig) {
            if (otherConfig === void 0) { otherConfig = {}; }
            var _a = _this, instance = _a.instance, _b = _a.axiosConfig, requestConfig = _b.requestConfig, timeout = _b.timeout, project = _b.project, handleResponseData = _b.handleResponseData, requertDynamicHeader = _b.requertDynamicHeader;
            var config = otherConfig.config, _c = otherConfig.headers, headers = _c === void 0 ? {} : _c, cancelRepeatRequest = otherConfig.cancelRepeatRequest;
            // 接口的修改配置等
            var _d = baseReplaceURL(url, { project: project }), path = _d.path, _e = _d.type, type = _e === void 0 ? 'post' : _e;
            // 请求头的处理判断
            var _f = headerHandle(url, requestConfig), _g = _f.header, header = _g === void 0 ? {} : _g, baseURL = _f.baseURL;
            var cusrHeader = requertDynamicHeader ? requertDynamicHeader() : {};
            var responsePromise = instance.request(__assign({ url: path, baseURL: baseURL, method: type, data: /(post|POST)/.test(type) ? params : undefined, params: /(get|GET)/.test(type) ? params : undefined, paramsSerializer: function (params) { return qs.stringify(params, { arrayFormat: 'repeat' }); }, timeout: timeout, headers: __assign(__assign(__assign(__assign({}, header), cusrHeader), headers), { cancelRepeatRequest: cancelRepeatRequest }) }, config));
            if (handleResponseData) {
                return new Promise(function (resolve, reject) {
                    responsePromise.then(function (response) {
                        handleResponseData(response, otherConfig, _this).then(function (res) {
                            resolve(res);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            }
            return responsePromise;
        };
        /** 取消所有的请求 */
        this.onCancelRequestAll = function () {
            _this.pendingMap.forEach(function (cancelToken, key) {
                cancelToken(key);
                _this.pendingMap.delete(key);
            });
        };
        this.axiosConfig = config;
        this.instance = axios.create();
        this.init();
    }
    Axios.prototype.init = function () {
        var _this = this;
        var axiosCancel = this.axiosConfig.cancelRepeatRequest;
        this.instance.interceptors.request.use(function (config) {
            var _a;
            // 请求函数的 全局的
            var methCancel = config.headers.cancelRepeatRequest;
            if (typeof methCancel === 'boolean' && !methCancel) {
                // 取消重复请求: 添加唯一的请求，存在 那么证明正在请求中，直接取消之前的请求 然后添加新的请求
                _this.removePending(config);
                _this.addPending(config);
            }
            else if (typeof methCancel === 'undefined' && ((typeof axiosCancel === 'boolean' && !axiosCancel) || !axiosCancel)) {
                // 取消重复请求: 添加唯一的请求，存在 那么证明正在请求中，直接取消之前的请求 然后添加新的请求
                _this.removePending(config);
                _this.addPending(config);
            }
            if ((_a = config.headers) === null || _a === void 0 ? void 0 : _a.cancelRepeatRequest)
                delete config.headers.cancelRepeatRequest;
            // 在发送请求之前做些什么
            return config;
        });
        this.instance.interceptors.response.use(function (response) {
            // 请求成成功之后取消当前的请求
            _this.removePending(response.config);
            return response;
        }, function (error) {
            // 请求成成功之后取消当前的请求
            error.config && _this.removePending(error.config);
            return responseError(error);
        });
    };
    return Axios;
}());
export { Axios };
//# sourceMappingURL=index.js.map