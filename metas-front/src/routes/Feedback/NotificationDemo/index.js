import React from 'react'
import {Card,Col,Row,Button,Tooltip,notification,Select} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

class NotificationDemo extends React.Component{
  render(){
    return (
      <div>
        <CustomBreadcrumb arr={['个人中心', '个人关注','关注话题详情']}/>
        <Card hoverable bordered={false} className='card-item' title={this.props.location.state.topic+' 关注话题情感趋势'} style={{minHeight:'136'}}>
        {this.props.location.state.topic}
        </Card>
      </div>
    )
  }
}

export default NotificationDemo