/**
 * @description 全局的一些配置
 * @author minjie
 * @Date 2022-03-08 17:57
 * @LastEditTime 2022-03-10 17:26
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export interface GlobalConfigProps {
    /** 当前的项目 */
    project?: string;
    /** 功能权限 */
    power?: string[];
    /** 数据权限 */
    powerData?: string[];
}
declare const globalConfig: GlobalConfigProps;
export declare const initConfig: (config: GlobalConfigProps) => void;
export default globalConfig;