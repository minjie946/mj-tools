/**
 * @description 描述
 * @author minjie
 * @Date 2022-03-24 17:11
 * @LastEditTime 2022-03-28 14:25
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
/** image: 图片 video: 视频 excel: Excel文件 world: World文档 pdf: PDF html: THML link: 链接 */
export type FileType = 'image'|'video'|'excel'|'world'|'pdf'|'html'|'link'

export interface STSParam {
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
}

export interface OssConfigProps {
  /** Bucket所在的区域 默认值为 oss-cn-hangzhou。 */
  region: string
  /** bucket 总的 */
  bucket: string
  /** 通过阿里云控制台创建的AccessKey ID。 */
  accessKeyId?: string
  /** 通过阿里云控制台创建的AccessKey Secret。 */
  accessKeySecret?: string
  /**
   * 刷新STSToken间隔的使用时间: 默认 280000
   * 需要比更新的实效的时间短
   */
  refreshSTSTokenInterval?: number
  /** 使用临时授权方式 */
  getStsToken?: () => Promise<STSParam>
}

export interface UploadProps {
  /** 上传的文件 */
  file: any
  /** oss 存放路径： 不包含文件名 */
  ossPath: string
  /** bucket */
  bucket?: string
  /** 是否重命名(默认： true) */
  rename?: string | boolean
  /** 返回可访问的链接(默认： false) */
  link?: boolean
  /** 图片操作的信息的信息 */
  process?: string
  /** 默认: imgae */
  type?: FileType
  /** 上传进度 */
  onProgress?: (progress: number, name: string) => void
}

export interface UploadResponse {
  name: string
  /** 上传的文件的链接 */
  url?: string
  /** 视频的截图 */
  coverURL?: string
}

export interface GetLinkProps {
  /** bucket 文件相对路径 含文件名的 */
  bucketName:string|string[]
  /** bucket */
  bucket?: string
  /** 文件类型 */
  type?: FileType
  /** 失效时间 */
  expires?: number
  /** 获取到的文件名 */
  filename?: string
  /** 图片操作等参数 */
  process?: string
}

export interface DowloadProps {
  /** bucket 文件相对路径 含文件名的 */
  bucketName:string
  /** 保存的本地的地址 */
  path: string
  /** bucket */
  bucket?: string
}
