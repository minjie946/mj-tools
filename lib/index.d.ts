/** axios 请求的封装 */
export { default as Axios } from './axios';
export type { URLInterface, ServiceConfigProps, DomainListProps, RequestConfigProps, RequestMethodProps, AxiosProps } from './axios/index.inter';
/** 贝塞尔曲线移动动画 */
export { default as animation } from './animation';
export type { AnimationProps } from './animation';
/** 公共的一些方法 */
export { default as utils, isEmpty, isFunction, compareDeep, parsetInt, parsetIntAndKeepMinus, toFixed, toFixedAndKeepMinus, conversionOf, removeEmpty, doubleFormat, throttle, subString, isIP, isEmptyObjOrArr, allSettled, deepCopyObj, objDeepCopy, isProjectEqual, isPcOrPhone, getBrowserInfo } from './utils';
/** 全局配置 */
export { default as globalConfig, initConfig } from './global-config';
