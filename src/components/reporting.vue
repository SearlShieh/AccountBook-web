<template>
  <div id="mainapp">
    <div class="button-wrapper-left">
      <svg @click="index=(index+3)%2" t="1618407750634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="611" width="50" height="50">
        <path d="M469.504 512l267.264 450.048L286.72 512l450.56-450.048L469.504 512z" p-id="612"></path>
      </svg>
    </div>
    <div style="width:89%;height:100%;background:transparent;">
      <component :is=getComName(index) :type1="selectType" :type2="radioType"></component>
    </div>
    <div class="button-wrapper-right">
      <svg @click="index=(index+1)%2" t="1618408292224" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="756" width="50" height="50">
        <path d="M563.751385 512L236.307692 1024l551.384616-512L236.307692 0z" p-id="757"></path>
      </svg>
    </div>
    <el-select v-model="selectType" placeholder="请选择" style="position: absolute;right: 3%;top:3%;width: 20%;" size="small" v-if="index!=0">
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
    <el-tooltip effect="light" content="分享报告" placement="bottom-start" v-if="index!=0&&selectType!=0">
      <el-button type="success" size="small" circle style="position: absolute;right: 25%;top:3%;" @click="shareReport">
        <i class="el-icon-share"></i>
      </el-button>
    </el-tooltip>
    <el-button style="position: absolute;top: 3%;left: 3%;" type="primary" size="mini"  plain @click="isShowReport=1"
      v-if="isShowReport==0&&report.avg!=0">
      个性化的消费分析
      <i class="el-icon-arrow-right el-icon--right"></i>
    </el-button>
    
    <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;background: #ffffff;" v-if="isShowReport==1">
      <el-button style="position: absolute;top: 3%;left: 3%;" type="primary" size="mini"  plain @click="isShowReport=0">
        返回
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
      <div style="padding: 5% 10%;height: 100%;width: 100%;box-sizing: border-box;
        overflow: hidden;display: flex;justify-content: center;align-items: center;" class="report-box">
        <div style="width: 100%;max-height: 100%;overflow: auto;">
          <div>自开通账户以来，您平均消费价格在<span>{{report.avg}}</span>左右</div>
          <div>您最贵的一笔在<span>{{report.maxDay.date}}</span>，<br/>共消费了
            <span>{{report.maxDay.money}}</span>元<i v-if="report.maxDay.label!=''||report.maxDay.remark!=''">在<span>{{report.maxDay.label}}</span>
            <span>（{{report.maxDay.remark}}）</span></i></div>
        <div>您消费最贵的一个月在<span>{{report.maxMonth.date}}</span>，<br/>共消费了
            <span>{{report.maxMonth.money}}</span>元<span>{{report.maxMonth.num}}</span>笔</div>
        <div>您最常消费的类型是<i><span>{{report.oftenLabel.name}}</span></i>，共消费了<span>{{report.oftenLabel.num}}</span>笔</div>
        <div>您最贵的消费类型是<i><span>{{report.maxLabel.name}}</span></i>，共消费了<span>{{report.maxLabel.money}}</span>元</div>
        <div>您平均每日消费<span>{{report.avgDay}}</span>元，平均每月消费<span>{{report.avgMonth}}</span>元</div>
          <div style="font-size: 1rem;margin-top: 2%;" class="report-box2">
          <div v-if="report.day.money==0" >您今天还未消费，忘记记账？
            <el-link icon="el-icon-d-arrow-right"  size="mini" style="margin-right: 2%;margin-top: -.5%;" @click="changeToBooking">
              去记账</el-link>
            真的没有消费！继续保持！
          </div>
          <div v-else>
            您今天已消费<span>{{report.day.money}}</span>元<span>{{report.day.num}}</span>笔，
            <span v-if="report.day.money<=report.avgDay">低于日常消费水平，继续加油哦！</span>
            <span v-else>高于过往消费水平，注意消费！</span>
          </div>

          <div v-if="report.month.money==0">您半月还未消费，忘记记账？
            <el-link icon="el-icon-d-arrow-right"  size="mini" style="margin-right: 2%;" @click="changeToBooking">去记账</el-link>
            真的没有消费！继续保持！
          </div>
          <div v-else>
            您本月已消费<span>{{report.month.money}}</span>元<span>{{report.month.num}}</span>笔，
            <span v-if="report.month.money<=report.avgMonth">低于日常消费水平，继续加油！</span>
            <span v-else>高于过往消费水平，注意消费！</span>
          </div>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>


<script>
import Qs from 'qs';
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
      userid:sessionStorage.getItem('userid'),
      isShowReport:0,
      comName: '',
      index: 0,
      selectType:0,
      radioType:'0',
      months:['所有月份','','','','','',''],
      monthsTwo:['','','','','',''],
      report:{
        avg:'',
        maxDay:{
          date:'',
          money:0,
          label:'',
          remark:'',
        },
        maxMonth:{
          date:'',
          money:0,
          num:0,
        },
        oftenLabel:{
          name:'',
          num:0,
        },
        maxLabel:{
          name:'',
          money:0,
        },
        avgDay:0,
        avgMonth:0,
        day:{
          money:0,
          num:0,
        },
        month:{
          money:0,
          num:0
        }
      }
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
          this.monthsTwo[i]=str.concat(year+'-0'+month);
        }
        else{
          this.months[i+1]=str.concat(year+'年'+month+'月');
          this.monthsTwo[i]=str.concat(year+'-'+month);
        }
        if(month>1){
          month--;
        }else{
          month=12;
          year--;
        }
      }
    },
    changeToBooking(){
        this.$emit("changeComponent1Data", "booking",true);
      },
    showMessage(str,type=2){
      if(type==1){
        this.$message({
          type: 'success',
          message: str
        });
      }else{
        this.$message({
          type: 'error',
          message: str
        });
      }
    },
    shareReport(){
      const mydata = {
        date:this.monthsTwo[this.selectType-1]+'',
        userid:this.userid
      }
        this.axios({
            method: 'post',
            url: '/api/share/isSharedForReport/',
            data: Qs.stringify(mydata)
        })
        .then( res => {
            if(res.data=="-1"){
              this.showMessage("请勿重复分享！");
            }
            else{
              this.$prompt('请输入分享文案：', '提示', {
                confirmButtonText: '确认分享',
                cancelButtonText: '取消',
              }).then(({ value }) => {
                  const mydata = {
                    date:this.monthsTwo[this.selectType-1],
                    userid:this.userid,
                    content: value,
                  }
                  this.axios({
                    method: 'post',
                    url: '/api/share/addForReport/',
                    data: Qs.stringify(mydata)
                  })
                  .then( res => {
                    this.showMessage("分享成功！",1);
                  })
              }).catch(() => {
              });
            }
        })
    },
    getReport(){
      const mydata={
        userid:this.userid,
      }
      this.axios({
        method:'post',
        url:'/api/user/getReport/',
        data:Qs.stringify(mydata)
      })
      .then(res=>{
        this.report=res.data;
      })
    }
  },
  mounted() {
    this.getMonths();
    this.getReport();
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
      overflow: hidden;
  }
.button-wrapper-left {
  width: 5%;
  height: 100%;
  position: relative;
  top:250px;
  left: 0;
}
.button-wrapper-right {
  width: 5%;
  height: 100%;
  position: relative;
  top:250px;
  right: 0;
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

.report-box > div{
  margin-bottom: 2%;
}

.report-box span{
  color: pink;
  font-weight: bold;
  margin: 0 1%;
  font-size: 2rem;
}

.report-box2 span{
  font-size: 1.2rem;
  font-weight: normal;
}

::-webkit-scrollbar { display: none; }
</style>
