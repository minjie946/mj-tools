import { useEffect } from 'react'
import { Row, Col, Button } from 'antd'
import Axios from '../components/axios/index'
import encryption, { encCBC } from '../components/encryption/index'
import ServiceConfig from './config'
import './App.css'

function App () {
  useEffect(() => {
    encryption.config = {
      key: '7oNdxx*6A7oDri4Mb}r9wPTm',
      iv: '0102030405060708'
    }
  }, [])

  /** 请求数据 */
  const onRequestData = () => {
    const url: any = { // 根据userId 查询当前用户基本信息
      type: 'get',
      path: 'stallone/user/getUserBasicInfoById/{projectName}'
    }
    const axios = new Axios(ServiceConfig)
    axios.request(url).then(() => {
      console.log('222')
    }).catch((err) => {
      console.log('2223', err)
    })
    setTimeout(() => {
      axios.unRequest(url)
    }, 200)
  }

  /** 加密 */
  const onEnc = () => {
    console.log(encCBC('123456'))
  }

  return (
    <Row gutter={[10, 10]}>
      <Col>
        <Button type='primary' onClick={onRequestData}>测试</Button>
      </Col>
      <Col>
        <Button type='primary' onClick={onEnc}>加密</Button>
      </Col>
    </Row>
  )
}

export default App
