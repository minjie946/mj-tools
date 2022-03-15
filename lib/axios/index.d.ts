import { URLInterface, RequestMethodProps, AxiosProps } from './index.inter';
export default class Axios {
    constructor(config: AxiosProps);
    /** 新的请求实例 */
    private instance;
    /** 请求的配置 */
    private axiosConfig;
    /** 存储每个请求的值 */
    private pendingMap;
    /**
     * 生成每个请求唯一的键
     * @param {*} config
     * @returns string
     */
    private getPendingKey;
    /**
     * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
     * @param {*} config
     */
    private addPending;
    /**
     * 删除重复的请求
     * @param {*} config
     */
    private removePending;
    /** 初始化：注册拦截器 */
    private init;
    /**
     * 发送请求
     * @param {URLInterface} url 接口
     * @param {*} params 参数
     * @param {RequestMethodProps} otherConfig 其余配置
     * @returns {Promise<any>}
     */
    request: (url: URLInterface, params?: any, otherConfig?: RequestMethodProps) => Promise<unknown>;
    /**
     * 取消请求
     * * 根据当前的请求数据去取消这个请求
     * * 请求的接口还有参数为唯一的建
     */
    unRequest: (url: URLInterface, params?: any, otherConfig?: RequestMethodProps) => void;
    /** 取消所有的请求 */
    onCancelRequestAll: () => void;
}
