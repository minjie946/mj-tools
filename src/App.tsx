import { useState } from 'react'
import { Row, Col, Button } from 'antd'
import { Content } from 'mj-tools'
import './App.css'

function App () {
  return (<Content>
    <Content.HeaderItem isline> sss</Content.HeaderItem>
    <Row gutter={[10, 10]}>
      <Col>
        <Button type='primary'>测试</Button>
      </Col>
    </Row>
  </Content>)
}

export default App
