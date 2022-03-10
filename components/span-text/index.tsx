/**
 * @description 表格的展示的
 * @author minjie
 * @Date 2021-10-13 15:07
 * @LastEditTime 2022-03-10 17:44
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import globalConfig from '../global-config'
import './index.less'

export type SpanTextType = 'warning' | 'info' | 'success' | 'error' | 'gay' | 'default'


const checkPower = (code: string | Array<string>, type: 'contain' | 'must' = 'contain'): boolean => {
  return baseAuthenticated(code, type, globalConfig.power)
}
const checkPowerData = (code: string | Array<string>, type: 'contain' | 'must' = 'contain'): boolean => {
  return baseAuthenticated(code, type, globalConfig.powerData)
}

/**
 * 权限的判断
 * @param code  权限code
 * @param type  验证的类型 'contain' (包含的关系)| 'must' (必须都有) 默认： contain
 * @param auth  权限的集合
 * @returns true | false
 */
export const baseAuthenticated = (code: string | Array<string>, type: 'contain' | 'must' = 'contain', auth: string[] = []): boolean => {
  if (process.env.NODE_ENV === 'development') { // 开发环境
    return true
  } else {
    if (typeof code === 'string') {
      return auth && auth.includes(code)
    } else if (auth) {
      if (type === 'contain') {
        const index = auth.findIndex((el: any) => code.includes(el))
        return index >= 0
      } else {
        for (let index = 0; index < code.length; index++) {
          const pow = code[index]
          if (!auth.includes(pow)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }
}

const ColorObj:any = {
  success: '#6ABF47',
  info: '#1281FF',
  warning: '#FE7A38',
  error: '#F5222D',
  gay: '#CCCCCC',
  default: '#333333'
}

export interface SpanTextProps<T = any> extends React.HTMLAttributes<T> {
  /** 只是在antd form 表格中使用 */
  value?: any
  /** 只是在antd form表格中使用 */
  onChange?: () => void
  /** 是否禁用 */
  disabled?: boolean
  /** 功能权限的code */
  powerCode?: string | string[]
  /** 数据权限的code */
  powerCodeData?: string | string[]
  /** 对应的类型: 或者颜色 */
  type?: SpanTextType | string
  /** 进行路由跳转的 */
  to?: any
  /** 路由跳转是否进行替换 */
  replace?: boolean
  /** 是否需要鼠标变成手指的样式 */
  cursor?: 'pointer' | 'not-allowed'
  /** 没有值的替代 */
  notValueText?: string
  /** 显示为背景颜色 */
  isbackground?: boolean
}

export default ({ value, children, to, cursor, powerCode, notValueText = '---', style = {}, powerCodeData,
  replace, disabled = false, isbackground = false, type = 'info', onChange, onClick, ...props }: SpanTextProps) => {
  /** 跳转到别的路径 */
  const onSpanClick = (e: any) => {
    if (!disabled && onClick) onClick(e)
  }
  /** 正常的权限的判断 */
  const normalSpan = () => {
    const typeAry = ['warning', 'info', 'success', 'error', 'gay', 'default']
    const spanStyle:any = {}
    // 不是指定的值，那么给予自定义的颜色
    spanStyle[isbackground ? 'backgroundColor' : 'color'] = typeAry.includes(type) ? ColorObj[type] : type
    if (cursor) spanStyle['cursor'] = cursor
    // 判断显示的子元素
    const childrenDom = onChange ? (value || notValueText) : children
    return <span
      className={classNames('sjcomon-span', {
        'sjcomon-span-diable': disabled,
        'sjcommon-span-backaground': isbackground
      })}
      style={{ ...spanStyle, ...style }}
      onClick={onSpanClick}
      {...props}
    >
      {to && !disabled && <Link replace={replace} to={to}>
        {childrenDom}
      </Link>}
      {!(to && !disabled) && (childrenDom)}
    </span>
  }

  if (powerCode) { // 功能权限的判断
    return checkPower(powerCode) ? normalSpan() : null
  } else if (powerCodeData) { // 数据权限的判断
    return checkPowerData(powerCodeData) ? normalSpan() : null
  } else {
    return normalSpan()
  }
}
