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
      data:{
        '':0,
      }
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
      const data=this.data;
      // const data = {"2000-05-31": 78, "2000-06-01": 99, "2000-06-02": 305, "2000-06-03": 26, "2000-06-04": 31, "2000-06-05": 126, "2000-06-06": 29}
      // const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
      const keyArray = [];
      const valueArray = [];
      let maxVaule = -1;
      let val;
      for(const key in data){
        keyArray.push(key);
        val = data[key];
        valueArray.push(val);
        if (val > maxVaule)
          maxVaule = val;
      }
      // 绘制图表
      myChart.setOption({
        // Make gradient line here
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: maxVaule //最红的点
        },
        title: {
          margin: 15,
          left: 'center',
          text: '\n消    费    趋    势',
          textStyle: {
            fontSize: 22
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: keyArray
        },
        yAxis: { },
        series: {
          type: 'line',
          showSymbol: false,
          data: valueArray
        }
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
        this.data=res.data;
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
        this.data=res.data;
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
