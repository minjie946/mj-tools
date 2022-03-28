/**
 * @description 接口请求的封装
 * @author minjie
 * @Date 2022-03-07 15:11
 * @LastEditTime 2022-03-24 16:03
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import axios, { AxiosResponse } from 'axios'
import {
  URLInterface, RequestMethodProps, RequestConfigProps, ServiceConfigProps,
  BaseReplaceURLConfig, DomainAryProps, AxiosProps, AxiosResponseData
} from './index.inter'
import qs from 'qs'

/** 请求接口中的参数的替换 */
const baseReplaceURL = ({ path, type }: URLInterface, { version = 'v1', project }: BaseReplaceURLConfig): URLInterface => {
  let url = path
  if (path.includes('{projectName}') && project) url = path.replace('{projectName}', project)
  if (path.includes('{version}') && version) url = path.replace('{version}', version)
  return { path: url, type }
}

/**
 * 根据接口中的服务名返回 请求的域名和header
 * @param {URLInterface} url 请求接口实体
 * @param {RequestConfigProps} requestConfig 请求的配置
 * @returns {{ baseURL, header }}
 */
const headerHandle = ({ path }: URLInterface, { domainAry, ...request }: RequestConfigProps): { baseURL: string, header: any, timeout?: number } => {
  // 请求的域名
  let domain: string | undefined
  let header: any
  let timeout: number | undefined
  if (domainAry) {
    for (let index = 0; index < domainAry.length; index++) {
      const dm: DomainAryProps = domainAry[index] // 整个域名的
      if (!dm.serviceName) {
        continue
      } else {
        const service: string | ServiceConfigProps | undefined = dm.serviceName.find((sn: string | ServiceConfigProps) => {
          return typeof sn === 'string' ? path.includes(sn) : path.includes(sn.name)
        })
        if (service) {
          if (typeof service === 'string') { // 具体服务的
            header = dm.headers
            domain = dm.domainName
            timeout = dm.timeout
          } else {
            header = service.header || dm.headers
            domain = dm.domainName
            timeout = service.timeout || dm.timeout
          }
          break
        }
      }
    }
  }
  return {
    baseURL: domain || request.domainName,
    header: header || request.headers,
    timeout
  }
}

/** 请求错误的时候的处理 */
const responseError = (err: any) => {
  const { message, response } = err
  if (response) {
    const { status, data, config: { url } }: AxiosResponse<AxiosResponseData> = response
    err.code = status
    switch (status) {
      case 400: err.message = `${status} 请求参数有误`; break
      case 401: err.message = `${status} 当前请求需要用户验证`; break
      case 403: err.message = `${status} 服务器已经理解请求，但是拒绝执行它`; break
      case 404: err.message = `${status} 请求路径不存在`; break
      case 405: err.message = `${status} 请求行中指定的请求方法不能被用于请求相应的资源`; break
      case 500: err.message = `${status} 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理`; break
      case 502: err.message = `${status} 网关错误！`; break
      case 503: err.message = `${status} 由于临时的服务器维护或者过载，服务器当前无法处理请求。`; break
      case 504: err.message = `${status} 响应超时`; break
      case 505: err.message = `${status}  HTTP版本不受支持！`; break
      default: err.message = `${status} ${data.message || message}`; break
    }
  }
  if (message.includes('timeout')) {
    err.message = '网络请求超时！'
    err.code = 504
  }
  if (message.includes('Network')) {
    err.message = window.navigator.onLine ? '网络未连接' : '网络错误'
    err.code = -7
  }
  if (axios.isCancel(err)) { // 取消了重复请求
    console.log('(取消请求 >_< ):' + err.message)
    return Promise.reject(err)
  } else {
    return Promise.reject(err)
  }
}

export default class Axios {
  constructor (config: AxiosProps) {
    this.axiosConfig = config
    this.instance = axios.create()
    this.init()
  }

  /** 新的请求实例 */
  private instance
  /** 请求的配置 */
  private axiosConfig: AxiosProps
  /** 存储每个请求的值 */
  private pendingMap = new Map()

  /**
   * 生成每个请求唯一的键
   * @param {*} config
   * @returns string
   */
  private getPendingKey = (config: any) => {
    let { url, method, params, data } = config
    if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**
   * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
   * @param {*} config
   */
  private addPending = (config: any) => {
    const pendingKey = this.getPendingKey(config)
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
      if (!this.pendingMap.has(pendingKey)) {
        this.pendingMap.set(pendingKey, cancel)
      }
    })
  }

  /**
   * 删除重复的请求
   * @param {*} config
   */
  private removePending = (config: any) => {
    const pendingKey = this.getPendingKey(config)
    if (this.pendingMap.has(pendingKey)) {
      const cancelToken = this.pendingMap.get(pendingKey)
      cancelToken('取消请求:' + pendingKey)
      this.pendingMap.delete(pendingKey)
    }
  }

  /** 初始化：注册拦截器 */
  private init () {
    const { cancelRepeatRequest: axiosCancel } = this.axiosConfig
    this.instance.interceptors.request.use((config) => {
      // 请求函数的 全局的
      const { cancelRepeatRequest: methCancel }: any = config.headers
      if (typeof methCancel === 'boolean' && !methCancel) {
        // 取消重复请求: 添加唯一的请求，存在 那么证明正在请求中，直接取消之前的请求 然后添加新的请求
        this.removePending(config)
        this.addPending(config)
      } else if (typeof methCancel === 'undefined' && ((typeof axiosCancel === 'boolean' && !axiosCancel) || !axiosCancel)) {
        // 取消重复请求: 添加唯一的请求，存在 那么证明正在请求中，直接取消之前的请求 然后添加新的请求
        this.removePending(config)
        this.addPending(config)
      }
      if (config.headers?.cancelRepeatRequest) delete config.headers.cancelRepeatRequest
      // 在发送请求之前做些什么
      return config
    })
    this.instance.interceptors.response.use((response: any) => {
      // 请求成成功之后取消当前的请求
      this.removePending(response.config)
      return response
    }, (error: any) => {
      // 请求成成功之后取消当前的请求
      error.config && this.removePending(error.config)
      return responseError(error)
    })
  }

  /**
   * 发送请求
   * @param {URLInterface} url 接口
   * @param {*} params 参数
   * @param {RequestMethodProps} otherConfig 其余配置
   * @returns {Promise<any>}
   */
  request = (url: URLInterface, params: any = {}, otherConfig: RequestMethodProps = {}) => {
    const { instance, axiosConfig: { requestConfig, timeout: AllTimeout, project, handleResponseData, requertDynamicHeader } } = this
    const { config, headers = {}, cancelRepeatRequest }: RequestMethodProps = otherConfig
    // 接口的修改配置等
    const { path, type = 'post' } = baseReplaceURL(url, { project: project })
    // 请求头的处理判断
    const { header = {}, baseURL, timeout } = headerHandle(url, requestConfig)
    // 判断是否存在动态的请求函数，存在则根据函数的返回执行
    const cusrHeader = requertDynamicHeader ? requertDynamicHeader() : {}
    // 发送请求
    const responsePromise = instance.request({
      url: path,
      baseURL,
      method: type,
      data: /(post|POST)/.test(type) ? params : undefined, // post请求方式
      params: /(get|GET)/.test(type) ? params : undefined, // get 请求方式
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      timeout: timeout || AllTimeout,
      headers: { ...header, ...cusrHeader, ...headers, cancelRepeatRequest },
      ...config
    })
    // 判断是否存在 业务请求数据处理函数
    if (handleResponseData) {
      return new Promise((resolve, reject) => {
        responsePromise.then((response) => {
          handleResponseData(response, otherConfig, this).then((res: any) => {
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        })
      })
    }
    return responsePromise
  }

  /**
   * 取消请求
   * * 根据当前的请求数据去取消这个请求
   * * 请求的接口还有参数为唯一的建
   */
  unRequest = (url: URLInterface, params: any = {}, otherConfig: RequestMethodProps = {}) => {
    const { axiosConfig: { project } } = this
    const { config }: RequestMethodProps = otherConfig
    // 接口的修改配置等
    const { path, type = 'post' } = baseReplaceURL(url, { project: project })
    let [baseParam, baseData] = [undefined, undefined]
    if (/(post|POST)/.test(type)) {
      baseData = params
    } else if (/(get|GET)/.test(type)) {
      baseParam = params
    }
    if (config) { // 存在额外的配置
      const { params, data } = config
      baseParam = params || baseParam
      baseData = data || baseData
    }
    if (typeof baseData === 'string') baseData = JSON.parse(baseData) // response里面返回的config.data是个字符串对象
    // 移除请求等
    this.removePending({
      url: path,
      method: type,
      params: baseParam,
      data: baseData
    })
  }

  /** 取消所有的请求 */
  onCancelRequestAll = () => {
    this.pendingMap.forEach((cancelToken: any, key: string) => {
      cancelToken(key)
      this.pendingMap.delete(key)
    })
  }
}
