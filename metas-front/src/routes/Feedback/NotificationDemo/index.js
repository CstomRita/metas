import React from 'react'
import {Card,Col,Row,Button,Tooltip,notification,Select} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import './style.css'
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'


let listData = []

class NotificationDemo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      ListData: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.loadDataFromNet();
  }

  loadDataFromNet() {
    var concernTime = ""
    var times = this.props.location.state.concernTime.split("年")
    concernTime = times[0]+"-"
    var times2 = times[1].split("月")
    concernTime = concernTime + (parseInt(times2[0]) < 10 ? "0"+times2[0] : times2[0]) + "-"
    var times3 = times2[1].split("日")
    concernTime = concernTime + (parseInt(times3[0]) < 10 ? "0"+times3[0] : times3[0]) + "-"
    var times4 = times3[1].split("时")
    concernTime = concernTime + (parseInt(times4[0]) < 10 ? "0"+times4[0] : times4[0])
    var url = 'http://127.0.0.1:8080/getTopicTrend/'+this.props.location.state.topic+'/'+concernTime
    fetch(url, {
      method: 'GET'
    }).then((response) => response.json())
        .then((responData) => {
          if (responData.code == 200) {
              this.setState({
                isLoading: false,
                ListData:responData.data
              })
          }
        }).catch(err=>{
      alert("网络错误"+err)
    })
  }

  renderRow = (rowData) => {
      rowData = rowData[0]
      return (
          <div className="rowdiv" id={rowData.topicName}>
            <div className="cover">
              <img src={rowData.coverUrl} style={{height: "100%"}}/>
              <text style={{fontSize: 25, color: "black",fontWeight:'bold'}}>     {'#' + rowData.topicName + '#'}</text>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span><Button variant="outlined" disabled>阅读量{rowData.readCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              <span><Button variant="outlined"
                            disabled>讨论量{rowData.discussCount}</Button>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              <input type="button" className="ant-btn-gray" id={rowData.topicName}
                     value={'于' + this.props.location.state.concernTime + "关注 "}
                     onClick={() => this.cancelconcern(rowData.topicName)}/>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div className="desc">
              <text style={{
                fontSize: 15,
                color: "gray"
              }}>{rowData.topicDesc == '' ? '暂无导语' : '导语：' + rowData.topicDesc}</text>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

            </div>
            <div className="attention">

            </div>
          </div>
      );

  };
  percentage(num, total) {
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比

  }

  getOptionForTrend = (listDatas) =>{
    var times = []
    var Anger = []
    var Happiness = []
    var Like = []
    var Disgust = []
    var Surprise = []
    var noneCount = []
    var Sadness = []
    var Fear = []
    listDatas.map(function (item) {
      let total = (((((item.analysisResult.Anger + item.analysisResult.Fear ) + item.analysisResult.Happiness) + item.analysisResult.Like) + item.analysisResult.Disgust) + item.analysisResult.Surprise)
      total = total  + item.analysisResult.none
      total = (total + item.analysisResult.Sadness)
      times.push(item.time)
      Anger.push( Math.round(item.analysisResult.Anger / total * 10000)/100.00)
      Fear.push( Math.round(item.analysisResult.Fear / total * 10000)/100.00)
      Happiness.push( Math.round(item.analysisResult.Happiness / total * 10000)/100.00)
      Like.push( Math.round(item.analysisResult.Like / total * 10000)/100.00)
      Disgust.push(Math.round(item.analysisResult.Disgust  / total * 10000)/100.00)
      Surprise.push( Math.round(item.analysisResult.Surprise / total * 10000)/100.00)
      noneCount.push( Math.round(item.analysisResult.none / total * 10000)/100.00)
      Sadness.push( Math.round(item.analysisResult.Sadnes / total * 10000)/100.00)
    })


    let optionForTrend = {
      title: {
        text: '#'+listDatas[0].topicName+'# 情感趋势图\n\n\n\n\n',
        x: 'center',
        y: 'top'
      },
      tooltip : {
        trigger: 'item',
        // formatter: "{a} <br/>{b} : {c}次"
      },
      toolbox: {
        show : true,
        top:10,
        right:10,
        feature : {
          mark : {show: true},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      grid:{
        top:60,
        right:70,
        bottom:30,
        left:60
      },
      legend: {
        top:32,
        left:'center',
        data:['Anger','Fear','Happiness','Like','Disgust','Surprise','none','Sadness']
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          data : times
        }
      ],
      yAxis : [
        {
          type: 'value',
          name:"情\n感\n百\n分\n占\n比\n\n︵\n%\n︶",
          nameLocation:"center",
          nameGap:35,
          nameRotate:0,
          nameTextStyle:{
            fontSize: 16,
          },
          //默认以千分位显示，不想用的可以在这加一段
          axisLabel : {   //调整左侧Y轴刻度， 直接按对应数据显示
            show:true,
            showMinLabel:true,
            showMaxLabel:true,
            formatter: function (value) {
              return value;
            }
          }
        }
          //这里可以再加一列显示在右侧
        // {
        //   type: 'value',
        //   name:"在\n线\n调\n用\n次\n数\n︵\n次\n︶",
        //   nameLocation:"center",
        //   nameGap:35,
        //   nameRotate:0,
        //   nameTextStyle:{
        //     fontSize: 16,
        //   },
        //   //默认以千分位显示，不想用的可以在这加一段
        //   axisLabel : {   //调整左侧Y轴刻度， 直接按对应数据显示
        //     show:true,
        //     showMinLabel:true,
        //     showMaxLabel:true,
        //     formatter: function (value) {
        //       return value;
        //     }
        //   }
        // }
      ],
      series : [
        {
          name:'Anger',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Anger,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Happiness',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Happiness,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Like',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Like,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Disgust',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Disgust,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Surprise',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Surprise,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'none',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:noneCount,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Fear',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Fear,
          itemStyle : { normal: {label : {show: false}}},
        },
        {
          name:'Sadness',
          type:'line',
          smooth: true,
          yAxisIndex: 0,
          data:Sadness,
          itemStyle : { normal: {label : {show: false}}},
        }
      ]
    };
    return optionForTrend
  }
  getOption = (listDatas)=>{
    var listData = listDatas[listDatas.length - 1]

    let option = {
      title: {
        text: '#'+listData.topicName+'# 当前情感分布图\n\n\n\n\n',
        x: 'center',
        y: 'top'
      },
      tooltip : {
        trigger: 'item',
        formatter: "情感为{b}的{a} <br/> {c} ({d}%)"
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
    }
    if (this.state.ListData.length == 0) {
      return (
          <div>
            暂无处理数据，请等待....
          </div>
      );
    } else {
      return (
          <div>
            <CustomBreadcrumb arr={['个人中心', '个人关注', '关注话题详情']}/>
            <Card hoverable bordered={false} className='card-item' title={this.props.location.state.topic + ' 关注话题情感趋势'}
                  style={{minHeight: '136'}}>
              <div>
                <div className="allrows">
                  {this.renderRow(this.state.ListData)}
                </div>
              </div>
              <ReactEcharts style={{height:'250px',fontSize:'12'}} option={this.getOption(this.state.ListData)}/>
              <ReactEcharts option={this.getOptionForTrend(this.state.ListData)}/>
            </Card>
          </div>
      )
    }
  }
}

export default NotificationDemo