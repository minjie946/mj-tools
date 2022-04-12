/**
 * 判读是否为空
 * @param {*|*[]} value
 * @param {'all'|'onley'} type
 * @returns true 为空 false 不为空
 */
export const isEmpty = (value: any | any[], type: 'all' | 'onley' = 'onley'): boolean => {
  if (Array.isArray(value)) {
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

export interface AllSettledResponse {
  /** 成功:success 失败:failure */
  status: 'success'|'failure'
  /** 返回的信息 */
  value: any
}

/**
 * 异步请求，返回对应的结果
 * * { status: 'fulfilled', value: res } 成功
 * * { status: 'rejected', reason: error } 失败
 * @param promises
 * @returns
 */
export const allSettled = (promises:Promise<any>[]):Promise<AllSettledResponse[]> => {
  return new Promise(resolve => {
    const data:AllSettledResponse[] = []
    const len = promises.length
    let count = len
    for (let i = 0; i < len; i += 1) {
      const promise:Promise<any> = promises[i]
      promise.then(res => {
        data[i] = { status: 'success', value: res }
      }, error => {
        data[i] = { status: 'failure', value: error }
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
  compareDeep,
  doubleFormat,
  allSettled,
  deepCopyObj,
  objDeepCopy,
  isProjectEqual,
  isPcOrPhone,
  getBrowserInfo
}
