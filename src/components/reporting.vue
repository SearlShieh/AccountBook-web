<template>
  <div id="mainapp">
    <div class="button-wrapper-left">
      <svg @click="index=(index+3)%2" t="1618407750634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="611" width="50" height="50">
        <path d="M469.504 512l267.264 450.048L286.72 512l450.56-450.048L469.504 512z" p-id="612"></path>
      </svg>
    </div>
    <div style="float: left;width:89%;height:100%;background:transparent;">
      <component :is=getComName(index) :type1="selectType" :type2="radioType"></component>
    </div>
    <div class="button-wrapper-right">
      <svg @click="index=(index+1)%2" t="1618408292224" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="756" width="50" height="50">
        <path d="M563.751385 512L236.307692 1024l551.384616-512L236.307692 0z" p-id="757"></path>
      </svg>
    </div>
    <el-select v-model="selectType" placeholder="请选择" style="position: absolute;right: 3%;top:3%" size="small" v-if="index!=0">
      <el-option
        v-for="(item,i) in months"
        :key="i"
        :label="item"
        :value="i">
      </el-option>
    </el-select>
    <div style="position: absolute;right: 3%;top:2%" size="small" v-else>
      <el-radio v-model="radioType" label="0">一周的消费趋势</el-radio>
      <el-radio v-model="radioType" label="1">半年的消费趋势</el-radio>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation'
import trend from './trend'
import pie from './pie'

const comNameArray = ['trend', 'pie'];
export default {
  components: {
    Navigation,
    trend,
    pie
  },
  data () {
    return {
      comName: '',
      index: 0,
      selectType:0,
      radioType:'0',
      months:['所有月份','','','','','',''],
    }
  },
  methods: {
    getComName(index) {
      return comNameArray[index];
    },
    getMonths(){
      let year = new Date().getFullYear();
      let month =new Date().getMonth() + 1;
      let str='';
      for(let i=0;i<6;i++){
        if(month<10){
          this.months[i+1]=str.concat(year+'年0'+month+'月');
        }
        else{
          this.months[i+1]=str.concat(year+'年'+month+'月');
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
    this.getMonths();
  }
}
</script>

<style scoped>
#mainapp{
  text-align: center;
    margin:0 auto;
    width: 1000px;
    height: 600px;
    overflow-y: auto; /* 当内容过多时y轴出现滚动条 */
    border:0px solid rgb(255, 253, 253);
    border-radius:5px;
    background:#ffffff;
      border: 10px solid rgba(255,255,255,.5);
      background-clip: padding-box;

      display: flex;
      justify-content: center;
      align-content: center;
      font-size: 1.6rem;
      position: relative;
  }
.button-wrapper-left {
  width: 5%;
  height: 100%;
  float: left;
  margin-top:250px;
}
.button-wrapper-right {
  width: 5%;
  height: 100%;
  float: right;
  margin-top:250px;
}
.icon {
  margin: 0px;
  float: left;
  cursor:pointer;
}
.icon:hover {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;  /*36 07 19 97*/
}
@keyframes shake {
  /*
  10%, 90% {transform: translate3d(-3px, 0, 0);}
  20%, 80% {transform: translate3d(5px, 0, 0);}
  */
  30%, 50%, 70% {transform: translate3d(-4px, 0, 0);}
  40%, 60% {transform: translate3d(4px, 0, 0);}
}
::-webkit-scrollbar { display: none; }
</style>
