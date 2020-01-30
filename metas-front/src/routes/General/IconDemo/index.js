import React from 'react'
import {Icon, Card, BackTop, Anchor, Affix, Form, Input, message} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import PromptBox from "../../Login/RegisterForm";
import {calculateWidth} from "../../../utils/utils";
import { inject, observer } from 'mobx-react/index'
import '../../Login/style.css'


class IconDemo extends React.Component {
  render() {
    return (
      <div>
        <CustomBreadcrumb arr={['个人中心','个人信息']}/>
        <Card hoverable bordered={false} className='card-item' title={'个人信息维护'} style={{minHeight:'136'}}>
          <Form>
            <Form.Item style={styles.form} >
              用户名: <Input
                maxLength={1}
                value='admin'
            />
            </Form.Item>
            <Form.Item style={styles.form}>
              密码: <Input
                maxLength={1}
                type='password'
                value='admin'
            />
            </Form.Item>

              <Form.Item style={styles.form} >
                确认密码: <Input
                  maxLength={1}
                  type='password'
                  value='admin'/>
            </Form.Item>

            <Form.Item style={styles.form}>
              电子邮箱: <Input
                maxLength={1}
               value='cstttaa@126.com'/>
            </Form.Item>

            <Form.Item style={styles.form} >
                 联系方式: <Input
                      maxLength={1}
                      placeholder='联系方式 (选填)'/>
            </Form.Item>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </Form>
          <div style={styles.div1}>
            <input className='ant-btn-gray' type="submit" value='撤销'/>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input className='ant-btn-red' type="submit" value='提交'/>
          </div>
        </Card>
      </div>
    )
  }
}

const styles = {
  div1:{
    textAlign:'center',
    width:'100%'
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    width: '17%'
  },
  icon: {
    fontSize: 18,
    marginBottom: 10
  },
  affixBox: {
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  },
  form:{
    height:'65px'
  }
}

export default IconDemo