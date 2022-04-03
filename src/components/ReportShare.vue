<template>
  <div style="width:500px;height:500px;">
    <div style="width:100%;height: 100%;" ref="share"></div>
    <div v-if="labelData.length<1" style="font-size: 1.4rem;color: rgb(109, 104, 104);">暂无数据</div>
  </div>
    <!-- <div>{{username}}.{{date}}.{{labelData}}</div> -->
  </template>
  
  <script>
  import Qs from 'qs';
  import echarts from 'echarts';
  // // const echarts = require('echarts');
  export default {
    name: "ReportShare",
    props:{
      username:{
        type:String,
      },
      date:{
        type:String,
      }
    },
    data() {
      return {
        labelData:[
          {
            value:0,
            name:'',
          }
        ],
      }
    },
    watch: {
      date(newV,oldV){
        this.getLabels();
        console.log(date);
      },
      username(newV,oldV){
        this.getLabels();
        console.log(username);
      }
    },
    computed: {
      options() {
        let option={
          backgroundColor: '',   //'#2c343c'
          title: {
            text: '金    钱    流    向',
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 22
            }
          },
  
          tooltip: {
            trigger: 'item'
          },
  
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '标签',
              type: 'share',
              radius: '55%',
              center: ['50%', '50%'],
              data: this.labelData.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                color: 'black',  // rgba(255, 255, 255, 0.3)
                font_size: 15  //not working
              },
              labelLine: {
                lineStyle: {
                  color: 'black'  // rgba(255, 255, 255, 0.3)
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
  
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        };
        return option;
      },
    },
    methods: {
      initPieChart(){
        let share = echarts.init(this.$refs.share);
        if ( share != null && share!= "" && share != undefined ) {
          share.dispose();
          share = echarts.init(this.$refs.share);
        }
        share.setOption(this.options);
      },
      getLabels(){
        const mydata = {
          username:this.username,
          date:this.date,
        }
        this.axios({
          method: 'post',
          url: '/api/label/getLabelForShare/',
          data: Qs.stringify(mydata)
        })
        .then(res=>{         
          this.labelData=res.data;
          this.initPieChart();
        })
      },
    },
    mounted() {
      this.initPieChart();
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  