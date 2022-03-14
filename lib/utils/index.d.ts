/**
 * 判读是否为空
 * @param {*|*[]} value
 * @param {'all'|'onley'} type
 * @returns true 为空 false 不为空
 */
export declare const isEmpty: (value: any | any[], type?: 'all' | 'onley') => boolean;
/** 判断空对象或者空数组 */
export declare const isEmptyObjOrArr: (obj: any) => boolean;
/** 字符串截取 */
export declare const subString: (str: string, len?: number) => string;
export declare const isIP: (val: string) => boolean;
/** 判断是否是数组 */
export declare const isFunction: (data: any) => boolean;
/** 深度对比两个对象是否相同 */
export declare const compareDeep: (origin: any, target: any) => boolean;
/** ---------------------------------表单内容 start --------------------------------- */
export declare const parsetInt: (v: string, intLen?: number) => string;
export declare const parsetIntAndKeepMinus: (v: string, intLen?: number) => string;
/**
 * 保留小数点，默认保留两位
 * @param v 待处理字符串
 * @param decimalsLen 小数点位数
 * @param intLen 整数位数
 */
export declare const toFixed: (v: string, decimalsLen?: number, intLen?: number) => string;
export declare const toFixedAndKeepMinus: (v: string, decimalsLen?: number, intLen?: number) => string;
/**
 * 转换限制
 * @param reg 表达式
 * @param val 转换值
 * @param len 长度
 */
export declare const conversionOf: (reg: any, val: string, len?: number | undefined) => string;
/**
 * 去除空格
 */
export declare const removeEmpty: (val: any) => any;
/** ---------------------------------表单内容 end --------------------------------- */
/**
 * 对金额进行格式化
 * @method doubleFormat
 * @param {*} number   要格式化的数字
 * @param {*} decimals 保留几位小数
 * @param {*} interval 几位进行分割
 * @returns            返回格式化之后的金额
 */
export declare const doubleFormat: (number: any, decimals: number, interval?: number) => string;
/**
 * 自定义事件
 * @param type  事件类型
 * @param name  事件名
 * @param obj   绑定对象
 */
export declare const throttle: (type: any, name: any, obj?: any) => void;
/**
 * 异步请求，返回对应的结果
 * * { status: 'fulfilled', value: res } 成功
 * * { status: 'rejected', reason: error } 失败
 * @param promises
 * @returns
 */
export declare const allSettled: (promises: Promise<any>[]) => Promise<unknown>;
/**
 * 对象的拷贝
 * @param {*} obj 需要拷贝的对象
 * @returns {*}
 */
export declare const deepCopyObj: (obj: any) => any;
/**
 * 对象或数组拷贝
 * @param {*} obj 需要拷贝的对象或数组
 */
export declare const objDeepCopy: (source: any) => any;
/**
 * 判断字母是否相等
 * @param {string} project1 项目1
 * @param {string} project2 项目2
 * @returns {boolean}
 */
export declare const isProjectEqual: (project1: string, project2: string) => boolean;
/** 判断是否是电脑或者手机 */
export declare const isPcOrPhone: () => boolean;
/**
 * 判断浏览器类型
 */
export declare const getBrowserInfo: () => string;
declare const _default: {
    isEmpty: (value: any, type?: "all" | "onley") => boolean;
    isFunction: (data: any) => boolean;
    compareDeep: (origin: any, target: any) => boolean;
    parsetInt: (v: string, intLen?: number) => string;
    parsetIntAndKeepMinus: (v: string, intLen?: number) => string;
    toFixed: (v: string, decimalsLen?: number, intLen?: number) => string;
    toFixedAndKeepMinus: (v: string, decimalsLen?: number, intLen?: number) => string;
    conversionOf: (reg: any, val: string, len?: number | undefined) => string;
    removeEmpty: (val: any) => any;
    doubleFormat: (number: any, decimals: number, interval?: number) => string;
    throttle: (type: any, name: any, obj?: any) => void;
    subString: (str: string, len?: number) => string;
    isIP: (val: string) => boolean;
    isEmptyObjOrArr: (obj: any) => boolean;
    allSettled: (promises: Promise<any>[]) => Promise<unknown>;
    deepCopyObj: (obj: any) => any;
    objDeepCopy: (source: any) => any;
    isProjectEqual: (project1: string, project2: string) => boolean;
    isPcOrPhone: () => boolean;
    getBrowserInfo: () => string;
};
export default _default;
