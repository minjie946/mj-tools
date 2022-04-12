/**
 * @description OSS 文件上传
 * @author minjie
 * @Date 2022-03-24 16:51
 * @LastEditTime 2022-04-12 10:36
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import OSS from 'ali-oss'
import { OssConfigProps, UploadProps, STSParam, UploadResponse, GetLinkProps, DowloadProps } from './index.info'

/** oss 配置 */
let OssConfig: OssConfigProps
/** 实例对象 */
let OssClient: OSS
/** 记录上一次使用的bucket名字，如果bucket不一样需要重新获取实例 */
let fristBucket:string

/** 获取请求的实列 */
export const getClien = (bucketMethod?: string): Promise<OSS> => {
  const {
    accessKeyId,
    accessKeySecret,
    bucket,
    region = 'oss-cn-hangzhou',
    refreshSTSTokenInterval = 280000,
    getStsToken
  }: OssConfigProps = OssConfig
  // 当前的bucket
  const nowBucket:string = bucketMethod || bucket
  if (!nowBucket) {
    console.error('请配置bucket')
    return Promise.reject(new Error('请配置bucket'))
  } else {
    if (!fristBucket) fristBucket = nowBucket
    if (OssClient && nowBucket === fristBucket) {
      return Promise.resolve(OssClient)
    } else {
      // 存在key 则直接使用这种形式进行创建实列
      if (accessKeyId && accessKeySecret) {
        OssClient = new OSS({
          region,
          accessKeyId,
          accessKeySecret,
          bucket: nowBucket
        })
        return Promise.resolve(OssClient)
      } else if (typeof getStsToken === 'function') {
        return new Promise((resolve, reject) => {
          getStsToken().then(({ accessKeyId, accessKeySecret, stsToken }: STSParam) => {
            OssClient = new OSS({
              region,
              accessKeyId,
              accessKeySecret,
              bucket: nowBucket,
              stsToken,
              secure: true,
              refreshSTSTokenInterval,
              refreshSTSToken: async ():Promise<STSParam> => await getStsToken()
            })
            resolve(OssClient)
          }).catch((err) => reject(err))
        })
      }
    }
  }
}

/** 设置请求 */
export const setConfig = (config: OssConfigProps) => {
  OssConfig = config
}

/**
 * 文件名的设置
 * @param {string} ossPath 文件存放的位置
 * @param {*} file 文件
 * @param {boolean|string} rename 是否重命名
 * @returns 
 */
const createName = (ossPath:string, file:any, rename:boolean|string):string => {
  // 后缀
  let suffer:string
  if (typeof file === 'string') {
    suffer = file.substring(file.lastIndexOf('.'))
  } else {
    suffer = file.name.substring(file.name.lastIndexOf('.'))
  }
  if (typeof rename === 'boolean' && rename) {
    const timestamp = new Date().getTime() + Math.random().toString(36).slice(2)
    return `${ossPath}/${timestamp + suffer}` 
  } else if (typeof rename === 'string') {
    return `${ossPath}/${rename + suffer}`
  }
  return `${ossPath}/${file.name}`
}

/** 分片上传的信息 */
let checkpoint: any
/**
 * 文件上传: 单个文件去上传
 */
export const upload = (option: UploadProps): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const { file, ossPath, rename = true, type = 'image', link = false, process, bucket, onProgress }: UploadProps = option
    getClien(bucket).then(async (client:OSS) => {
      const bucketName:string = createName(ossPath, file, rename)
      // 分片上传
      const { name } = await client.multipartUpload(bucketName, file, {
        checkpoint: checkpoint,
        progress: (percentage: any, checkpoint: any) => {
          checkpoint = checkpoint
          if (onProgress) onProgress(percentage, name)
        }
      })
      checkpoint = null
      const response:UploadResponse = { name }
      if (link && type === 'video') { // 需要返回封面
        response.url = await onGetLink({ bucket, bucketName, type: 'link' }, client) as string
        response.coverURL = await onGetLink({ bucket, bucketName, type, process }, client) as string
      } else if (link){
        response.url = await onGetLink({ bucket, bucketName, type, process }, client) as string
      }
      resolve(response)
    }).catch((err) => reject(err))
  })
}

/** 获取可访问的链接 */
export const onGetLink = async ({ bucket, bucketName, type = 'image', expires = 3600, filename, process }:GetLinkProps, client?:OSS):Promise<string|string[]> => {
  const header:any = { expires }
  if (filename) {
    header['response'] = { 'content-disposition': `attachment; filename=${encodeURIComponent(filename)}` }
  }
  if (type === 'video') {
    header['process'] = process || 'video/snapshot,t_1000,f_jpg,w_750,h_368' // 封面截图的
  }
  if (process) {
    header['process'] = process
  }
  if (!client) client = await getClien(bucket)
  if (typeof bucketName === 'string') {
    return await client.signatureUrl(bucketName, header)
  } else {
    return await bucketName.map((name:string) => client.signatureUrl(name, header))
  }
}

/** 文件下载 */
export const dowload = async ({ bucket, bucketName, path }:DowloadProps, client?:OSS) => {
  if (!client) client = await getClien(bucket)
  if (path) { // 下载本地地址
    return await client.get(bucketName, path)
  }
  return await client.get(bucketName)
}

export default {
  config: setConfig,
  upload,
  dowload,
  onGetLink
}
