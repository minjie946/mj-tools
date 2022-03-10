import r from"react";import e from"classnames";import{Link as n}from"react-router-dom";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var o=function(){return o=Object.assign||function(r){for(var e,n=1,o=arguments.length;n<o;n++)for(var t in e=arguments[n])Object.prototype.hasOwnProperty.call(e,t)&&(r[t]=e[t]);return r},o.apply(this,arguments)};
/**
 * @description 全局的一些配置
 * @author minjie
 * @Date 2022-03-08 17:57
 * @LastEditTime 2022-03-10 18:19
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
var t={},a=function(r,e,n){if(void 0===e&&(e="contain"),void 0===n&&(n=[]),"development"===process.env.NODE_ENV)return!0;if("string"==typeof r)return n&&n.includes(r);if(n){if("contain"===e)return(o=n.findIndex((function(e){return r.includes(e)})))>=0;for(var o=0;o<r.length;o++){var t=r[o];if(!n.includes(t))return!1}return!0}return!1},i={success:"#6ABF47",info:"#1281FF",warning:"#FE7A38",error:"#F5222D",gay:"#CCCCCC",default:"#333333"},c=function(c){var l=c.value,u=c.children,s=c.to,d=c.cursor,p=c.powerCode,f=c.notValueText,v=void 0===f?"---":f,y=c.style,m=void 0===y?{}:y,g=c.powerCodeData,b=c.replace,C=c.disabled,O=void 0!==C&&C,w=c.isbackground,h=void 0!==w&&w,j=c.type,k=void 0===j?"info":j,x=c.onChange,E=c.onClick,D=function(r,e){var n={};for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&e.indexOf(o)<0&&(n[o]=r[o]);if(null!=r&&"function"==typeof Object.getOwnPropertySymbols){var t=0;for(o=Object.getOwnPropertySymbols(r);t<o.length;t++)e.indexOf(o[t])<0&&Object.prototype.propertyIsEnumerable.call(r,o[t])&&(n[o[t]]=r[o[t]])}return n}(c,["value","children","to","cursor","powerCode","notValueText","style","powerCodeData","replace","disabled","isbackground","type","onChange","onClick"]),F=function(r){!O&&E&&E(r)},P=function(){var t={};t[h?"backgroundColor":"color"]=["warning","info","success","error","gay","default"].includes(k)?i[k]:k,d&&(t.cursor=d);var a=x?l||v:u;return r.createElement("span",o({className:e("sjcomon-span",{"sjcomon-span-diable":O,"sjcommon-span-backaground":h}),style:o(o({},t),m),onClick:F},D),s&&!O&&r.createElement(n,{replace:b,to:s},a),!(s&&!O)&&a)};return p?function(r,e){return void 0===e&&(e="contain"),a(r,e,t.power)}(p)?P():null:g?function(r,e){return void 0===e&&(e="contain"),a(r,e,t.powerData)}(g)?P():null:P()};export{a as baseAuthenticated,c as default};
//# sourceMappingURL=index.js.map
