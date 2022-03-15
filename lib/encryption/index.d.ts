export interface ConfigProps {
    /** 默认 */
    key: string;
    /** 默认 */
    iv: string;
}
export default class Encryption {
    static config: ConfigProps;
    /**
     * AES_CBC 加密
     * @param {*} text 加密的明文
     */
    static encCBC: (text: string) => string;
    /**
     * AES_CBC 解密
     * @param {*} text 需要解密
     */
    static decCBC: (text: string) => string;
    /**
     * AES_ECB 加密
     * @param {*} text 加密的明文
     */
    static encECB: (text: string) => string;
    /**
     * AES_ECB 解密
     * @param {*} text 加密的明文
     * @returns
     */
    static decECB: (text: string) => string;
}
/**
 * AES_CBC 加密
 * @param {*} text 加密的明文
 */
export declare const decCBC: (text: string) => string;
/**
 * AES_CBC 解密
 * @param {*} text 需要解密
 */
export declare const decECB: (text: string) => string;
/**
 * AES_ECB 加密
 * @param {*} text 加密的明文
 */
export declare const encCBC: (text: string) => string;
/**
 * AES_ECB 解密
 * @param {*} text 加密的明文
 * @returns
 */
export declare const encECB: (text: string) => string;
