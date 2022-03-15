/**
 * @description 加密
 * @author minjie
 * @Date 2022-03-15 14:52
 * @LastEditTime 2022-03-15 15:46
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import CryptoJS from 'crypto-js'

export interface ConfigProps {
  /** 默认 */
  key: string
  /** 默认 */
  iv: string
}

/* ECB加密 */
const optionsECB = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}


export default class Encryption {
  static config:ConfigProps
  /**
   * AES_CBC 加密
   * @param {*} text 加密的明文
   */
  static encCBC = (text: string) => {
    const keyHex = CryptoJS.enc.Utf8.parse(Encryption.config.key)
    const option = { // 配置
      iv: CryptoJS.enc.Utf8.parse(Encryption.config.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
    const encryptedData = CryptoJS.AES.encrypt(text, keyHex, option)
    return encryptedData.ciphertext.toString().toUpperCase()
  }

  /**
   * AES_CBC 解密
   * @param {*} text 需要解密
   */
  static decCBC = (text: string) => {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(text)
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const keyHex = CryptoJS.enc.Utf8.parse(Encryption.config.key)
    const option = { // 配置
      iv: CryptoJS.enc.Utf8.parse(Encryption.config.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
    const decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, option)
    return decryptedData.toString(CryptoJS.enc.Utf8)
  }

  /**
   * AES_ECB 加密
   * @param {*} text 加密的明文
   */
  static encECB = (text: string) => {
    const keyHex = CryptoJS.enc.Utf8.parse(Encryption.config.key)
    const encryptedData = CryptoJS.AES.encrypt(text, keyHex, optionsECB)
    return encryptedData.ciphertext.toString().toUpperCase()
  }
  /**
   * AES_ECB 解密
   * @param {*} text 加密的明文
   * @returns 
   */
   static decECB = (text: string) => {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(text)
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const keyHex = CryptoJS.enc.Utf8.parse(Encryption.config.key)
    const decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, optionsECB)
    return decryptedData.toString(CryptoJS.enc.Utf8)
  }
}

/**
 * AES_CBC 加密
 * @param {*} text 加密的明文
 */
export const decCBC = Encryption.decCBC
/**
 * AES_CBC 解密
 * @param {*} text 需要解密
 */
export const decECB = Encryption.decECB
/**
 * AES_ECB 加密
 * @param {*} text 加密的明文
 */
export const encCBC = Encryption.encCBC
/**
 * AES_ECB 解密
 * @param {*} text 加密的明文
 * @returns 
 */
export const encECB = Encryption.encECB
