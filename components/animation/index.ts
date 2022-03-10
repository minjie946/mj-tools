/**
 * @description 动画
 * @author minjie
 * @Date 2022-03-08 17:20
 * @LastEditTime 2022-03-10 17:43
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
 export interface AnimationProps {
   x: number
   y: number
   /** 终点的ID */
   id?: string
   /** 动画运行的时间 */
   duration?: number
   /** 路径或者base64 */
   icon: string
   /** 动画结束 */
   onEnd?: () => void
 }
 
 /**
  * 贝塞尔曲线计算
  * @param start 起点
  * @param end   终点
  * @param t     控制因子
  * @return [x, y] 返回坐标
  */
 const cubicBezier = (start: number[], end: number[], t: number) => {
   const [ax, ay] = start
   const [bx, by] = end
   // 控制点
   const px = Number((bx - ax).toFixed(2)) / 5
   const py = Number((ay - by).toFixed(2)) / 6
   const [px1, py1] = [ax + px, ay - (4 * py)]
   const [px2, py2] = [ax + (2 * px), ay - (5 * py)]
   const [cx, cy] = [px1, py1]
   const [dx, dy] = [px2, py2]
   const x = ax * (1 - t) * (1 - t) * (1 - t) +
     3 * cx * t * (1 - t) * (1 - t) +
     3 * dx * t * t * (1 - t) +
     bx * t * t * t
   const y = ay * (1 - t) * (1 - t) * (1 - t) +
     3 * cy * t * (1 - t) * (1 - t) +
     3 * dy * t * t * (1 - t) +
     by * t * t * t
   return [x, y]
 }
 
 export default ({ x, y, id = 'sjmian-move-di', icon, duration = 900, onEnd }: AnimationProps) => {
   let progress = 0 // 进度
   // 结束的点 和 大小
   const point: any = document.getElementById(id)?.getBoundingClientRect()
   const [endY, endX] = [point.y, point.x]
   // 开始的点
   const [clientY, clientX] = [y, x]
   const [startY, startX, startS] = [clientY, clientX, 1.8]
   // 创建动画的图标
   const iconId: string = 'animation_zindex_top_icon'
   let div: any = document.getElementById(iconId)
   if (!div) { // 不存在则创建图片
     div = document.createElement('div')
     div.setAttribute('id', 'animation_zindex_top_icon')
     div.style.position = 'fixed'
     div.style.top = '-100px'
     div.style.left = '-100px'
     div.style.zIndex = '1002'
     // 图标
     const img = document.createElement('img')
     img.src = icon
     img.style.width = '90px'
     div.appendChild(img)
     document.body.appendChild(div) // 添加
   }
   if (progress === 0) {
     // 初始的位置
     div.style.top = startY + 'px'
     div.style.left = startX + 'px'
     div.style.transform = `scale(${startS})`
     div.style.display = 'block'
     let startTime = 0 // 开始时间
     // window 对象
     const win = window as any
     // Chromium  Webkit (Mozilla Geko) (Opera Presto) (IE Trident)
     const requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame
     // 曲线
     const anim = (time: any) => {
       // 根据时间计算进度
       progress = ((time - startTime) / duration)
       if (progress >= 1) {
         div.style.display = 'none'
         progress = 0
         if (onEnd) onEnd()
       } else {
         requestAnimationFrame(anim)
       }
       const [x, y] = cubicBezier([startX, startY], [endX, endY], progress)
       const scale = startS * (1 - progress)
       div.style.left = x + 'px'
       div.style.top = y + 'px'
       div.style.transform = `scale(${scale < 0.3 ? 0.3 : scale})`
     }
     const startMove = () => {
       startTime = performance.now()
       requestAnimationFrame(anim)
     }
     startMove()
   }
 }
 