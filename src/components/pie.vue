<template>
  <div style="width:100%;height:100%;position: relative;">
    <div style="width:100%;height:100%;" ref="pie"></div>
    <div v-if="labelData.length<1" style="position: absolute;left:50%;top:50%;transform: translate(-50%,-50%);
      font-size: 1.4rem;color: rgb(109, 104, 104);">暂无数据</div>
  </div>
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
    },
    type3:{
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
      console.log(newV);
      if(newV==0)
        this.getLabels(0,'',this.type3);
      else{
        this.getLabels(newV,this.months[newV],this.type3);
      }
    },
    type3(newV,oldV){
      console.log(newV);
      if(this.type1==0)
        this.getLabels(0,'',newV);
      else{
        this.getLabels(this.type1,this.months[this.type1],newV);
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

        series: [
          {
            name: '标签',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: this.labelData.sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
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
    getLabels(type,date,radio){
      const mydata = {
        userid:this.userid,
        type:type,
        date:date,
        radio:radio
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
    this.getLabels(0,'',this.type3);
    this.getMonths();
  }
}
</script>

<style scoped>

</style>
