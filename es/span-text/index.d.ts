/**
 * @description 表格的展示的
 * @author minjie
 * @Date 2021-10-13 15:07
 * @LastEditTime 2022-03-10 17:44
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react';
import './index.less';
export declare type SpanTextType = 'warning' | 'info' | 'success' | 'error' | 'gay' | 'default';
/**
 * 权限的判断
 * @param code  权限code
 * @param type  验证的类型 'contain' (包含的关系)| 'must' (必须都有) 默认： contain
 * @param auth  权限的集合
 * @returns true | false
 */
export declare const baseAuthenticated: (code: string | Array<string>, type?: 'contain' | 'must', auth?: string[]) => boolean;
export interface SpanTextProps<T = any> extends React.HTMLAttributes<T> {
    /** 只是在antd form 表格中使用 */
    value?: any;
    /** 只是在antd form表格中使用 */
    onChange?: () => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 功能权限的code */
    powerCode?: string | string[];
    /** 数据权限的code */
    powerCodeData?: string | string[];
    /** 对应的类型: 或者颜色 */
    type?: SpanTextType | string;
    /** 进行路由跳转的 */
    to?: any;
    /** 路由跳转是否进行替换 */
    replace?: boolean;
    /** 是否需要鼠标变成手指的样式 */
    cursor?: 'pointer' | 'not-allowed';
    /** 没有值的替代 */
    notValueText?: string;
    /** 显示为背景颜色 */
    isbackground?: boolean;
}
declare const _default: ({ value, children, to, cursor, powerCode, notValueText, style, powerCodeData, replace, disabled, isbackground, type, onChange, onClick, ...props }: SpanTextProps) => JSX.Element | null;
export default _default;
