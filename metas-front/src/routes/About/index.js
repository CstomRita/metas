import React from 'react'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'
import {Button, Card} from "antd";
import './style.css'
// import echarts from 'echarts/lib/echarts'
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'


// 这里写搜索话题出情感分析饼状图

export default class About extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.loadDataFromNet();
    }

    loadDataFromNet() {
        fetch('http://127.0.0.1:8080/getTopicAnalysis/'+this.props.location.state.topic, {
            method: 'GET'
        }).then((response) => response.json())
            .then((responData) => {
                if (responData.code == 200) {
                    this.setState({
                        listData: responData.data,
                        isLoading: false
                    })
                }
            }).catch(err=>{
                alert("网络错误")
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
                    <text style={{fontSize:28,color:"black",fontWeight:'bold'}}>    {'#'+rowData.topicName+'#'}</text>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

                    <span><Button variant="outlined" disabled >阅读量{rowData.readCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    <span><Button variant="outlined" disabled>讨论量{rowData.discussCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    <input type="button"  class="ant-btn-red" id = {rowData.topicName} value=" 关注话题 " onClick={()=>this.concern(rowData.topicName)}/>
            </div>
                <div className="desc">
                    <text style={{
                        fontSize: 15,
                        color: "gray"
                    }}>{rowData.topicDesc == '' ? '暂无导语' : '导语：' + rowData.topicDesc}</text>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

                </div>
            </div>
        );
    };

    getOption = (listData)=>{
        var item = listData
        let total = (((((item.analysisResult.Anger + item.analysisResult.Fear ) + item.analysisResult.Happiness) + item.analysisResult.Like) + item.analysisResult.Disgust) + item.analysisResult.Surprise)
        total = total  + item.analysisResult.none
        total = (total + item.analysisResult.Sadness)
        console.log(total);
            let option = {
            title: {
                text: '#'+listData.topicName+'# 情感分布图\n\n\n\n\n',
                x: 'center',
                y: 'top'
            },
            tooltip : {
                trigger: 'item',
                formatter: "情感为{b}的{a}:{c},<br/>占总体"+total+"人"+"的{d}%"
            },
            legend: {
                orient: 'vertical',
                // top: 20,
                right: 5,
                data: ['Anger','Fear','Happiness','Like','Disgust','Surprise','none','Sadness']
            },
            series : [
                {
                    name:'用户数',
                    type:'pie',
                    // radius: ['30%', '80%'],
                    data:[
                        {value:listData.analysisResult.Anger, name:'Anger'},
                        {value:listData.analysisResult.Fear, name:'Fear'},
                        {value:listData.analysisResult.Happiness, name:'Happiness'},
                        {value:listData.analysisResult.Like, name:'Like'},
                        {value:listData.analysisResult.Disgust, name:'Disgust'},
                        {value:listData.analysisResult.Surprise, name:'Surprise'},
                        {value:listData.analysisResult.none, name:'none'},
                        {value:listData.analysisResult.Sadness, name:'Sadness'}
                    ],
                }
            ]
        }
        return option;
    }

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
                  <CustomBreadcrumb arr={['话题搜索']}/>
                  <Card hoverable bordered={false} className='card-item' title={this.props.location.state.topic+' 话题情感分析结果'} style={{minHeight:'136'}}>

                      <div>
                          <div class="allrows">
                              {this.renderRow(this.state.listData)}
                          </div>
                      </div>
                      <ReactEcharts option={this.getOption(this.state.listData)}/>


                  </Card>
                  {/*<TypingCard source = {this.renderRow(this.state.listData)}*/}
                              {/*title=/>*/}

              </div>
          )
      }
  }
}