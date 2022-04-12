# mj-tools

封装的axios 请求 工具等

### 安装
```
npm install mj-tools

或

yarn mj-tools

```

## animation 函数
参数名|类型|是否必填|默认值|备注|
---:|:---:|:---:|:---:|:---:|
x|number|必填|-|-|
y|number|必填|-|-|
icon|string|必填|-|路径或者base64|
id|string|非必填|sjmian-move-di|终点的ID|
duration|number|非必填|900|动画运行的时间|
onEnd|() => void|非必填|-|动画结束|

```jsx
() => {

  const onMove = (e: any) => {
    const [clientY, clientX] = [e.target.getBoundingClientRect().top, e.target.getBoundingClientRect().left]
    animation({ x: clientX, y: clientY, id: 'animation-id' })
  }

  return <div>
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Button type='primary' disabled={disabled} onClick={onClick}>防止重复提交</Button>
      </Col>
    </Row>
  </div>
}

```
