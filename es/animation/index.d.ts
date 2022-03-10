/**
 * @description 动画
 * @author minjie
 * @Date 2022-03-08 17:20
 * @LastEditTime 2022-03-10 18:19
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import './index.less';
export interface AnimationProps {
    x: number;
    y: number;
    /** 终点的ID */
    id?: string;
    /** 动画运行的时间 */
    duration?: number;
    /** 路径或者base64 */
    icon: string;
    /** 动画结束 */
    onEnd?: () => void;
}
declare const _default: ({ x, y, id, icon, duration, onEnd }: AnimationProps) => void;
export default _default;
