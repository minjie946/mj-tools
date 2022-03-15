import e from"../node_modules/crypto-js/index.js";
/**
 * @description 加密
 * @author minjie
 * @Date 2022-03-15 14:52
 * @LastEditTime 2022-03-15 15:46
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */var n={mode:e.mode.ECB,padding:e.pad.Pkcs7},t=function(){function t(){}return t.encCBC=function(n){var c=e.enc.Utf8.parse(t.config.key),r={iv:e.enc.Utf8.parse(t.config.iv),mode:e.mode.CBC,padding:e.pad.Pkcs7};return e.AES.encrypt(n,c,r).ciphertext.toString().toUpperCase()},t.decCBC=function(n){var c=e.enc.Hex.parse(n),r=e.enc.Base64.stringify(c),i=e.enc.Utf8.parse(t.config.key),o={iv:e.enc.Utf8.parse(t.config.iv),mode:e.mode.CBC,padding:e.pad.Pkcs7};return e.AES.decrypt(r,i,o).toString(e.enc.Utf8)},t.encECB=function(c){var r=e.enc.Utf8.parse(t.config.key);return e.AES.encrypt(c,r,n).ciphertext.toString().toUpperCase()},t.decECB=function(c){var r=e.enc.Hex.parse(c),i=e.enc.Base64.stringify(r),o=e.enc.Utf8.parse(t.config.key);return e.AES.decrypt(i,o,n).toString(e.enc.Utf8)},t}(),c=t.decCBC,r=t.decECB,i=t.encCBC,o=t.encECB;export{c as decCBC,r as decECB,t as default,i as encCBC,o as encECB};
//# sourceMappingURL=index.js.map
