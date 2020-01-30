import React from 'react'
import {Icon, Badge, Dropdown, Menu, Modal, Input} from 'antd'
import screenfull from 'screenfull'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { isAuthenticated } from '../../utils/Session'

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter @inject('appStore') @observer
class HeaderBar extends React.Component {
  state = {
    icon: 'arrows-alt',
    count: 100,
    visible: false,
    avatar: require('./img/04.jpg')
  }

  componentDidMount () {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  componentWillUnmount () {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {
    this.props.appStore.toggleLogin(false)
    this.props.history.push(this.props.location.pathname)
  }

  goHome = () => {
    this.props.history.push({ pathname: '/home'});
  }
  searchTopic = (e) => {
    if(e.keyCode==13) {
      var topic = document.getElementById("topicSearch").value;
      this.props.history.push({pathname: '/home/about', state: {topic}});
    }
  }

  render () {
    const {icon, count, visible, avatar} = this.state
    const {appStore, collapsed, location} = this.props
    const notLogin = (
      <div>
        <Link to={{pathname: '/login', state: {from: location}}} style={{color: 'rgba(0, 0, 0, 0.65)'}}>登录</Link>&nbsp;
        <img src={require('../../assets/img/defaultUser.jpg')} alt=""/>
      </div>
    )
    const menu = (
      <Menu className='menu'>
        <Menu.ItemGroup title={isAuthenticated()} className='menu-group'>
          <Menu.Item>个人信息</Menu.Item>
          <Menu.Item>个人关注</Menu.Item>
          <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
        <img onClick={() => this.setState({visible: true})} src={avatar} alt=""/>
      </Dropdown>
    )
    return (
      <div id='headerbar' style={styles.title}>
        <div style={{lineHeight: '80px', float: 'left'}}>
          <ul className='header-ul'>
            <li>
              <input type="button" onClick={this.goHome} value="首页" style={{border:0,height:'60px',color:'#FF5A44',fontWeight:'bold'}}/>
            </li>

            <li ></li><li ></li><li ></li>
              <li>
                <div  style={{width:'100%'}}>
                  <div style={{width:'15%',float:'left'}} >
                    <Icon type="search"/>
                  </div>
                  <div style={{width:'85%',float:'left'}} >
                  <Input  placeholder='输入话题 回车搜索'
                          class='search'
                          id = 'topicSearch'
                          onKeyDown={this.searchTopic}
                  />
                  </div>
                </div>
              </li>

            <li ></li><li ></li><li ></li><li ></li>
            <li ></li><li ></li>
            <li>
              {appStore.isLogin ? login : notLogin}
            </li>

          </ul>
        </div>


        <Modal
          footer={null} closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({visible: false})}>
          <img src={avatar} alt="" width='100%'/>
        </Modal>
      </div>
    )
  }
}
const styles = {
  title:{
    fontSize:25,
  }
}
export default HeaderBar