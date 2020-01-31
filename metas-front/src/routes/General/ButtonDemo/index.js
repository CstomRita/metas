import React from 'react'
import {Button, Row, Col, Card, Icon, Radio, Dropdown, Menu, message} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import './style.css'
// 设置个人关注

const cencerTopicList = ['小黄车','医护后盾','在家的我被逼成什么样了']
const cencerTimeList = ['2020-01-10-08','2020-01-10-10','2020-01-10-11']
let formData = new FormData();
formData.append('concernTopicList',cencerTopicList)
let count = -1;
class ButtonDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading: true,
    }

  }


  componentDidMount() {
    this.loadDataFromNet();
  }

  // 拿cencernTopicList的相关封面信息等
  loadDataFromNet() {
    fetch('http://127.0.0.1:8080/getConcernTopicInfo', {
      method: 'POST',
      body:formData
    }).then((response) => response.json())
        .then((responData) => {
          if (responData.code == 200) {
            this.setState({
              listData: responData.data,
              isLoading: false
            })
          }
        }).catch(err=>{

      console.log('程序发生错误')

    })
  }

  getTime(time) {
      let splits = time.split("-");
      var time = splits[0]+'年'
      if (parseInt(splits[1]) < 10){
          time = time + splits[1].slice(-1) + "月"
      } else{
          time = time + splits[1] + "月"
      }

      if (parseInt(splits[2]) < 10){
          time = time + splits[2].slice(-1) + "日"
      } else{
          time = time + splits[2] + "日"
      }

      if (parseInt(splits[3]) < 10){
          time = time + splits[3].slice(-1) + "时"
      } else{
          time = time + splits[3] + "时"
      }
      return time
  }

  cancelconcern(topic) {
    document.getElementById(topic).remove()
  }

  goTrend(topic) {
      var concernTime = document.getElementById(topic+'concern').value.slice(1,-3);
    this.props.history.push({pathname: '/home/feedback/notification', state: {"topic":topic,"concernTime":concernTime}});
  }

  renderRow = (rowData) => {
      count += 1
    return (
        <div class="rowdiv" id = {rowData.topicName}>
          <div class="cover">
            <img src={rowData.coverUrl} style={{height:"100%"}}/>
            <text style={{fontSize:25,color:"black"}}>     {'#'+rowData.topicName+'#'}</text>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span><Button variant="outlined" disabled>阅读量{rowData.readCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              <span><Button variant="outlined" disabled>讨论量{rowData.discussCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              <input type="button" className="ant-btn-gray" id={rowData.topicName+'concern'} value={'于'+this.getTime(cencerTimeList[count])+"关注 "}
                     onClick={() => this.cancelconcern(rowData.topicName)}/>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <input type="button" className="ant-btn-red" value=" 查看趋势 "
                     onClick={() => this.goTrend(rowData.topicName)}/>
          </div>
          <div class="desc">
            <text style={{fontSize:15,color:"gray"}}>{rowData.topicDesc == ''?'暂无导语':'导语：'+rowData.topicDesc}</text>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

          </div>
          <div class="attention">


          </div>
        </div>
    );
  };


  render() {
    if (this.state.isLoading) {
      return (
          <div>
            <text> Loading ...</text>
          </div>
      );
    } else {
      return (
          <div>
            <CustomBreadcrumb arr={['个人中心', '个人关注']}/>
            <Card hoverable bordered={false} className='card-item' title={'我关注的话题'} style={{minHeight:'136'}}>
              <div className="allrows">

                {this.state.listData.map(
                    item => this.renderRow(item)
                )}
              </div>
            </Card>

          </div>
      )
    }
  }
}

export default ButtonDemo