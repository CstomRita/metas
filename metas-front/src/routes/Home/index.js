import React from 'react'
import {Carousel,Button} from 'antd'
import './style.css'


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading : true
    }
    // this.handleClick
    // = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.loadDataFromNet();
  }

  loadDataFromNet() {
    fetch('http://127.0.0.1:8080/getHotTopic', {
      method: 'GET'
    }).then((response) => response.json())
        .then((responData) => {
          console.log('responData')
          this.setState({
            listData: responData.data,
            isLoading: false
          })
        }).catch(err=>{

      console.log('程序发生错误')

    })
  }
  concern(topic) {
      var newtopic = (topic.toString().substr(1,topic.toString().length-2))
      var concern = document.getElementById(topic).value;
      if (concern == " 关注话题 ") {
          // 应该关注
          fetch('http://127.0.0.1:8080/concernTopic/'+newtopic, {
              method: 'GET'
          }).then((response) => response.json())
              .then((responData) => {
                  if (responData.code == 200) {
                      document.getElementById(topic).value = "已关注"
                      document.getElementById(topic).setAttribute("class","ant-btn-gray")
                  }
              }).catch(err=>{
              alert('网络错误')
          })

      } else {
          // 应该取消关注
          fetch('http://127.0.0.1:8080/cancelConcernTopic/'+newtopic, {
              method: 'GET'
          }).then((response) => response.json())
              .then((responData) => {
                  if (responData.code == 200) {
                      document.getElementById(topic).value = " 关注话题 "
                      document.getElementById(topic).setAttribute("class","ant-btn-red")
                  }
              }).catch(err=>{
              alert('网络错误')
          })
      }
  }


  renderRow = (rowData) => {
    return (
        <div class="rowdiv">
          <div class="cover">
              <img src={rowData.coverUrl} style={{height:"100%"}}/>
              <text style={{fontSize:25,color:"black"}}>    {rowData.topicName}</text>
          </div>
            <div class="desc">
                <text style={{fontSize:15,color:"gray"}}>{rowData.topicDesc == ''?'暂无简介':rowData.topicDesc}</text>
            </div>
            <div class="attention">
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span><Button variant="outlined" disabled >阅读量{rowData.readCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                <span><Button variant="outlined" disabled>讨论量{rowData.discussCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                <input type="button"  class="ant-btn-red" id = {rowData.topicName} value=" 关注话题 " onClick={()=>this.concern(rowData.topicName)}/>
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
          <div class="allrows">
              {this.state.listData.map(
                  item=>this.renderRow(item)
              )}
          </div>
      )
    }
  }


}

const styles = {
  bg:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'calc(100vh - 64px)'
  }
}

export default Home