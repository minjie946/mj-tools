import './index.less'
/**
 * 判读是否为空
 * @param {*|*[]} value
 * @param {'all'|'onley'} type
 * @returns true 为空 false 不为空
 */
export const isEmpty = (value: any | any[], type: 'all' | 'onley' = 'onley'): boolean => {
  if (isFunction(value)) {
    if (value.length === 0) return true
    if (type === 'onley') {
      for (let index = 0; index < value.length; index++) {
        const val = value[index]
        if (isEmpty(val)) {
          return true
        }
      }
      return false
    } else {
      let num: number = 0
      for (let index = 0; index < value.length; index++) {
        const val = value[index]
        if (isEmpty(val)) {
          num++
        }
      }
      return num === value.length
    }
  }
  return !value || value === ''
}

/** 判断空对象或者空数组 */
export const isEmptyObjOrArr = function (obj: any) {
  if (!obj && obj !== 0 && obj !== '') {
    return true
  }
  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true
  }
  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true
  }
  return false
}

/** 字符串截取 */
export const subString = (str: string, len: number = 3) => {
  return str && str.length > len ? str.substr(0, len) + '...' : str
}

// 判断是否是Ip请求
export const isIP = (val: string) => {
  return /(http|https):\/\/[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}/.test(
    val
  )
}

/** 判断是否是数组 */
export const isFunction = (data: any) => {
  return Object.prototype.toString.call(data) === '[object Array]'
}

/** 深度对比两个对象是否相同 */
export const compareDeep = (origin: any, target: any) => {
  let p
  if (typeof origin === 'number' && typeof target === 'number' && isNaN(origin) && isNaN(target)) {
    return true
  }
  if (origin === target) {
    return true
  }
  if (typeof origin === 'function' && typeof target === 'function') {
    if ((origin instanceof RegExp && target instanceof RegExp) ||
      (origin instanceof String || target instanceof String) ||
      (origin instanceof Number || target instanceof Number)) {
      return origin.toString() === target.toString()
    } else {
      return false
    }
  }
  if (origin instanceof Date && target instanceof Date) {
    return origin.getTime() === target.getTime()
  }
  if (!(origin instanceof Object && target instanceof Object)) {
    return false
  }
  if (origin.prototype !== target.prototype) {
    return false
  }
  if (origin.constructor !== target.constructor) {
    return false
  }
  for (p in target) {
    if (!origin.hasOwnProperty(p)) {
      return false
    }
  }
  for (p in origin) {
    if (!target.hasOwnProperty(p)) {
      return false
    }
    if (typeof target[p] !== typeof origin[p]) {
      return false
    }
    if (!compareDeep(origin[p], target[p])) {
      return false
    }
  }
  return true
}

/** ---------------------------------表单内容 start --------------------------------- */

/* 只允许输入整数 */
export const parsetInt = (v: string, intLen: number = 8) => {
  return v.substr(0, intLen).replace(/[^\d]/g, '')
}

/* 只允许输入整数且支持可以保留负号 */
export const parsetIntAndKeepMinus = (v: string, intLen: number = 8) => {
  v = v
    .replace(/[^\d-]/g, '')
    .replace(/-{1,}/g, '-')
    .replace(/^-/, '$#$')
    .replace(/-/g, '')
    .replace('$#$', '-')
  if (v.indexOf('-') > -1) intLen += 1
  return v.substr(0, intLen)
}

/**
 * 保留小数点，默认保留两位
 * @param v 待处理字符串
 * @param decimalsLen 小数点位数
 * @param intLen 整数位数
 */
export const toFixed = (v: string, decimalsLen = 2, intLen: number = 8) => {
  v = v
    .substr(0, intLen + decimalsLen + 1)
    .replace(/[^\d.]/g, '')
    .replace(/^\./, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
    .replace(/^\d+/, (match: string) => {
      return (parseFloat(match) + '').substr(0, intLen)
    })
  return v
}

/* 保留小数点和负号，小数点默认保留两位 */
export const toFixedAndKeepMinus = (v: string, decimalsLen = 2, intLen: number = 8) => {
  v = v
    .replace(/[^\d.-]/g, '')
    .replace(/^\./, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(/-{1,}/g, '-')
    .replace(/^-/, '$#$')
    .replace(/-/g, '')
    .replace('$#$', '-')
    .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
  if (v.indexOf('-') > -1) intLen += 1
  v = v
    .replace(/^-?\d+/, (match: string) => {
      return (parseFloat(match) + '').substr(0, intLen)
    })
  return v.substr(0, intLen + decimalsLen + 1)
}

/**
 * 转换限制
 * @param reg 表达式
 * @param val 转换值
 * @param len 长度
 */
export const conversionOf = (reg: any, val: string, len?: number): string => {
  val = val.replace(reg, '')
  if (len) {
    val = val.length > len ? val.substr(0, len) : val
  }
  return val
}

/**
 * 去除空格
 */
export const removeEmpty = (val: any) => {
  return val.replace(/(^\s*)|(\s*$)/g, '')
}

/** ---------------------------------表单内容 end --------------------------------- */

/**
 * 对金额进行格式化
 * @method doubleFormat
 * @param {*} number   要格式化的数字
 * @param {*} decimals 保留几位小数
 * @param {*} interval 几位进行分割
 * @returns            返回格式化之后的金额
 */
export const doubleFormat = (number: any, decimals: number, interval: number = 4) => {
  number = isNaN(Number(number)) || number === null ? 0 : number
  decimals = decimals >= 0 && decimals <= 20 ? decimals : 2
  number = parseFloat((number + '').replace(/[^\d\.-]/g, '')).toFixed(decimals) + ''
  let l = number.split('.')[0].split('').reverse()
  let r = number.split('.')[1]
  r = r == null ? '' : '.' + r
  var t = ''
  if (l[l.length - 1] === '-') { // 负数不需要分隔号,
    for (var i = 0; i < l.length; i++) {
      if (l[i] === '-') {
        t += l[i] + ''
        continue
      }
      t += l[i] + ((i + 1) % interval === 0 && i + 1 !== l.length - 1 ? ',' : '')
    }
  } else {
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % interval === 0 && i + 1 !== l.length ? ',' : '')
    }
  }
  return (t.split('').reverse().join('') + r)
}

/**
 * 自定义事件
 * @param type  事件类型
 * @param name  事件名
 * @param obj   绑定对象
 */
export const throttle = (type: any, name: any, obj: any = window) => {
  let running = false
  let func = function () {
    if (running) { return }
    running = true
    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name))
      running = false
    })
  }
  obj.addEventListener(type, func)
}

/**
 * 异步请求，返回对应的结果
 * * { status: 'fulfilled', value: res } 成功
 * * { status: 'rejected', reason: error } 失败
 * @param promises
 * @returns
 */
export const allSettled = (promises: Promise<any>[]) => {
  return new Promise(resolve => {
    const data: any[] = []
    const len = promises.length
    let count = len
    for (let i = 0; i < len; i += 1) {
      const promise: Promise<any> = promises[i]
      promise.then(res => {
        data[i] = { status: 'fulfilled', value: res }
      }, error => {
        data[i] = { status: 'rejected', reason: error }
      }).finally(() => { // promise has been settled
        if (!--count) resolve(data)
      })
    }
  })
}

/**
 * 对象的拷贝
 * @param {*} obj 需要拷贝的对象
 * @returns {*}
 */
 export const deepCopyObj = (obj: any) => {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  const newobj: any = {}
  for (const key in obj) {
    newobj[key] = deepCopyObj(obj[key])
  }
  return newobj
}

/**
 * 对象或数组拷贝
 * @param {*} obj 需要拷贝的对象或数组
 */
export const objDeepCopy = (source: any) => {
  const sourceCopy: any = source instanceof Array ? [] : {}
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}

/**
 * 判断字母是否相等
 * @param {string} project1 项目1
 * @param {string} project2 项目2
 * @returns {boolean}
 */
export const isProjectEqual = (project1: string, project2: string) => {
  return project1.toLocaleUpperCase() === project2.toLocaleUpperCase()
}

/** 判断是否是电脑或者手机 */
export const isPcOrPhone = () => /(iPhone|iPad|iPod|iOS|Android|Windows Phone)/i.test(navigator.userAgent)

/**
 * 判断浏览器类型
 */
export const getBrowserInfo = (): string => {
  const ua: any = navigator.userAgent.toLocaleLowerCase()
  let browserType: string = ''
  let browserVersion: string = ''
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = 'IE'
    browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1]
  } else if (ua.match(/edge\/([\d.]+)/) || ua.match(/edg\/([\d.]+)/)) {
    browserType = 'Edge'
  } else if (ua.match(/firefox/) != null) {
    browserType = '火狐'
  } else if (ua.match(/ubrowser/) != null) {
    browserType = 'UC'
  } else if (ua.match(/opera/) != null) {
    browserType = '欧朋'
  } else if (ua.match(/bidubrowser/) != null) {
    browserType = '百度'
  } else if (ua.match(/metasr/) != null) {
    browserType = '搜狗'
  } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
    browserType = 'QQ'
  } else if (ua.match(/maxthon/) != null) {
    browserType = '遨游'
  } else if (ua.match(/chrome/) != null) {
    const _mime = (option: string, value: string) => {
      const mimeTypes: any = navigator.mimeTypes
      for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] === value) return true
      }
      return false
    }
    const is360 = _mime('type', 'application/vnd.chromium.remoting-viewer')
    browserType = is360 ? '360' : 'Chrome'
  } else if (ua.match(/safari/) != null) {
    browserType = 'Safari'
  }
  return browserType
}

export default {
  isEmpty,
  isFunction,
  compareDeep,
  parsetInt,
  parsetIntAndKeepMinus,
  toFixed,
  toFixedAndKeepMinus,
  conversionOf,
  removeEmpty,
  doubleFormat,
  throttle,
  subString,
  isIP,
  isEmptyObjOrArr,
  allSettled,
  deepCopyObj,
  objDeepCopy,
  isProjectEqual,
  isPcOrPhone,
  getBrowserInfo
}
