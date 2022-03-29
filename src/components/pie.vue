<template>
  <div style="width:100%;height:100%;" ref="pie"></div>
</template>

<script>
import Qs from 'qs';
const echarts = require('echarts');
export default {
  name: "pie",
  props:{
    type1:{
      type:Number,
    },
    type2:{
      type:String,
    }
  },
  data() {
    return {
      userid:sessionStorage.getItem('userid'),
      labelData:[
        {
          value:0,
          name:'',
        }
      ],
      months:['所有月份','','','','','',''],
    }
  },
  watch: {
    type1(newV,oldV){
      if(newV==0)
        this.getLabels(0,'');
      else{
        this.getLabels(newV,this.months[newV]);
      }
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
            type: 'pie',
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
      let pie = echarts.init(this.$refs.pie);
      if ( pie != null && pie!= "" && pie != undefined ) {
        pie.dispose();
        pie = echarts.init(this.$refs.pie);
      }
      pie.setOption(this.options);
    },
    getLabels(type,date){
      const mydata = {
        userid:this.userid,
        type:type,
        date:date,
      }
      this.axios({
        method: 'post',
        url: '/api/label/getLabelForReport/',
        data: Qs.stringify(mydata)
      })
      .then(res=>{         
        this.labelData=res.data;
        this.initPieChart();
      })
    },
    getMonths(){
      let year = new Date().getFullYear();
      let month =new Date().getMonth() + 1;
      let str='';
      for(let i=0;i<6;i++){
        if(month<10){
          this.months[i+1]=str.concat(year+'-0'+month);
        }
        else{
          this.months[i+1]=str.concat(year+'-'+month);
        }
        if(month>1){
          month--;
        }else{
          month=12;
          year--;
        }
      }
    }
  },
  mounted() {
    this.getLabels(0,'');
    this.getMonths();
  }
}
</script>

<style scoped>

</style>
