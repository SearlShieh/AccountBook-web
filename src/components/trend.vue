<template>
  <div style="width:100%;height:100%;" ref="chart"></div>
</template>

<script>
import Qs from 'qs';
const echarts = require('echarts')
export default {
  name: 'trend',
  props:{
    type1:{
      type:Number,
    },
    type2:{
      type:String,
    }
  },
  data () {
    return {
      userid:sessionStorage.getItem('userid'),
      date:[],
      data:[],
      maxData:0,
    }
  },
  watch: {
    type2(newV,oldV){
      if(newV=='0')
        this.getDataForDay();
      else{
        this.getDataForMonth();
      }
    }
  },
  methods: {
    initCharts () {
      let myChart = echarts.init(this.$refs.chart);
      if (  myChart!= null &&  myChart!= "" &&  myChart != undefined ) {
        myChart.dispose();
        myChart = echarts.init(this.$refs.chart);
      }
      // 绘制图表
      myChart.setOption({
        title: {
          text: '消  费  趋  势',
          x: 'center',
          top:'4%',
          textStyle: {
            fontSize: 22,
          }
        },

        legend: {
          orient: 'horizontal',
          x: 'left',
          y: 'top',
        },

        grid: {
            top: '16%',   // 等价于 y: '16%'
            left: '3%', 
            right: '8%',
            bottom: '3%',
            containLabel: true
        },

        // 提示框
        tooltip: {
          trigger: 'axis'
        },

        xAxis: {
          name: this.type2=='0' ? '日期':'月份',
          type: 'category',
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: this.type2=='0'? '#E4AEC5':'#F68989'
            }
          },
          // 设置X轴数据旋转倾斜
          axisLabel: {
            rotate: 30, // 旋转角度
            interval: 0  //设置X轴数据间隔几个显示一个，为0表示都显示
            },
          // boundaryGap值为false的时候，折线第一个点在y轴上
          boundaryGap: false,
          data: this.date
        },

        yAxis: {
          name: '金额',
          type: 'value',
          min:0, // 设置y轴刻度的最小值
          max:this.maxData,  // 设置y轴刻度的最大值
          splitNumber:9,  // 设置y轴刻度间隔个数
          axisLine: {
            lineStyle: {
              // 设置y轴颜色
              color: this.type2=='0'?'#F190B7':'#FFB2A6'
            }
          },
        },

        series: [
          {

            data: this.data,
            type: 'line',
            // 设置小圆点消失
            // 注意：设置symbol: 'none'以后，拐点不存在了，设置拐点上显示数值无效

            // 设置折线弧度，取值：0-1之间
            smooth: 0.5,
            itemStyle:{
              normal:{
                // 拐点上显示数值
                label : {
                show: true
                },
                lineStyle:{                 
                  width:5,  // 设置线宽
                  type:'solid'  //'dotted'虚线 'solid'实线
                }
              }
            }
          },
        ],
        
        color: this.type2=='0'? ['FFAAA7']:['#FF8080']
      });
    },
    getDataForMonth(){
      const mydata = {
        userid:this.userid,
      }
      this.axios({
        method: 'post',
        url: '/api/user/getTrendForMonth/',
        data: Qs.stringify(mydata)
      })
      .then(res=>{         
        this.date=res.data.date;
        this.data=res.data.value;
        this.maxData=res.data.maxData;
        this.initCharts();
      })
    },
    getDataForDay(){
      const mydata = {
        userid:this.userid,
      }
      this.axios({
        method: 'post',
        url: '/api/user/getTrendForDay/',
        data: Qs.stringify(mydata)
      })
      .then(res=>{         
        this.date=res.data.date;
        this.data=res.data.value;
        this.maxData=res.data.maxData;
        this.initCharts();
      })
    }
  },
  mounted() {
    this.getDataForDay();
  }
}
</script>

<style scoped>

</style>
