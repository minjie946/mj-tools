/** axios 请求的封装 */
export { default as Axios } from './axios'
export type { URLInterface, ServiceConfigProps, DomainAryProps, RequestConfigProps, RequestMethodProps, AxiosProps } from './axios/index.inter'

/** 贝塞尔曲线移动动画 */
export { default as animation } from './animation'
export type { AnimationProps } from './animation'

/** 公共的一些方法 */
export {
  default as utils,
  isEmpty,
  compareDeep,
  doubleFormat,
  allSettled,
  deepCopyObj,
  objDeepCopy,
  isProjectEqual,
  isPcOrPhone,
  getBrowserInfo
} from './utils'
export type { AllSettledResponse } from './utils'

/** AES 加密 */
export { default as encryption, decCBC, decECB, encCBC, encECB } from './encryption'
export type { ConfigProps } from './encryption'

/** OSS 文件上传 */
export { default as OSSUtil, setConfig, upload, dowload, onGetLink } from './oss-util'
export type { OssConfigProps, UploadProps, STSParam, FileType, UploadResponse, GetLinkProps, DowloadProps } from './oss-util/index.info'