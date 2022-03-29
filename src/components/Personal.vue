<template>
  <div id="mainapp">
    <div class="left">
      <el-card style="background:rgba(255, 255, 255, 0.1);margin-bottom: 2%;">
        
        <img src="../img/head-icon.jpg" style="width: 14%;height: 14%;border-radius: 100%;float: left;
          margin-top: -14px;margin-left: -10px;">
        <div style="float: left;margin-left: 1.5%;position: relative;top:-10px;text-align: left;width:85%;">
          <el-tag size="small">{{username}}</el-tag>
          
          <el-link icon="el-icon-edit"  @click="updatePassword" size="mini" style="font-size: 12px;margin-left: 5%;">修改密码</el-link>
          <el-link icon="el-icon-edit"  @click="updateSign" size="mini" style="font-size: 12px;margin-left: 5%;">修改个性签名</el-link>
        </div>
        <div style="font-size:12px;margin-top: 4px;color:#918c8c;margin-left: 4px;">
          个性签名：{{user.sign}}今天天气真好呀！！！今天天气真好呀！！！
        </div>  
      </el-card>
            
      <el-card style="margin-top: 2%;background:rgba(255, 255, 255, 0.3)">
        <div style="display: flex;">
          <div v-for="(item,i) in user.dataName" style="width: 25%;">
            <div><el-tag size="medium" style="margin-bottom: 6%;padding: 0 14px;">{{item}}</el-tag></div>
            <span style="color:#888585;">{{user.data[i]}}</span>
          </div>
        </div>
      </el-card>
      
      <el-card style="background:rgba(255, 255, 255, 0.1);margin-top: 2%;">
        <div style="width: 350px;height: 50px;">
          <el-tag size="medium" style="margin-bottom: 4%;float: left;">每月的消费预算</el-tag>
          <i class="el-icon-edit-outline" style="float: right;margin-left: 1%;"  @click="updateBudget"/>
          <span style="float: right;color:#888585;;margin-top: 1%;">{{user.budget}}</span>
        </div>
        <div  style="width: 380px;height: 50px;position: relative;float: left;">
          <el-tag size="medium" style="float: left;">每日的记账时间</el-tag>
          <i v-if="!isShowTime" class="el-icon-edit-outline" style="float: right;margin-left: 1%;"  @click="isShowTime=true"/>
          <span v-else >
            <i class="el-icon-success click-icon" @click="updateTime" style="float: right;"/>
            <i class="el-icon-error click-icon" @click="isShowTime=false;showCancel()" style="float: right;"/>
          </span>
          <span v-if="!isShowTime" style="float: right;color:#888585;margin-top: 1%;">{{user.time.hour}}&nbsp：{{user.time.min}}</span>
          <div v-else style="float: right;transform: scale(.7);position: absolute;right: 0;">
            <el-input-number v-model="user.newTime.hour" @change="handleChange" :min="0" :max="23" size="mini"></el-input-number>&nbsp：
            <el-input-number v-model="user.newTime.min" @change="handleChange" :min="0" :max="60" size="mini"></el-input-number>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 2%;text-align: left;background:rgba(255, 255, 255, 0.5);">
        <div style="font-size:12px;float: right;color:#918c8c;margin-top: 1.5%;margin-right: 1%;">
          共&nbsp;{{labels.length}}&nbsp;个标签</div>
        <span style="text-align: left;margin-top: -2%;color:#474545">我的标签</span>
        <el-input  v-if="inputVisible" v-model="inputValue" ref="saveTagInput" maxlength="5" show-word-limit
          size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" 
          style="margin-left: 2%;width: 40%;">
        </el-input>
        <el-button v-else size="mini" @click="showInput" style="padding: 4px 8px;margin-left: 2%;">+ 添加新标签</el-button>
        <hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <div style="max-height: 110px;overflow: auto;">
          <el-tag v-for="(item,i) in labels" :key="i" closable :disable-transitions="false" @close="deleteLabel(item)"
            style="margin:0 2% 1% 0;" effect="plain"  >
            {{item}}
          </el-tag>
        </div>
      </el-card>
    </div>
    <div class="right">
      <span style="text-align:center;font-size:24px;">消息中心</span>
      <div style="text-align: left;margin-top: 5%;padding: 0 4%;max-height: 80%;overflow:auto;">
        <div v-for="item in message" :key="item.id" style="cursor: pointer;" >
          <el-popconfirm
            title="确定删除这条消息吗？"
            @confirm="deleteMessage(item.id)" 
            icon-color="pink"
            style="float: right;" 
          >
            <el-button type="primary" slot="reference" icon="el-icon-delete" size="mini" 
              style="padding: 10px;position: relative;top:4px"></el-button>
          </el-popconfirm>
          <div @click="openMessageBox(item.id,item.type,item.content)" style="margin-top: 2%;">
            <div style="font-size:14px;color:#817e7e;max-height: 5%;max-width:340px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;" 
              v-if="item.isread==1"> 
              <el-button type="success" size="mini" circle style="padding: 3px;float:left;margin-right: 1%;" >
                <i class="el-icon-message-solid"></i>
              </el-button>
              系统提醒：{{item.content}}  
            </div>
            <div style="font-size:14px;color:#070707;max-height: 5%;max-width:340px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;" 
              v-else>
              <el-button type="primary" size="mini" circle style="padding: 3px;float:left;margin-right: 1%;" >
                <i class="el-icon-message-solid"></i>
              </el-button>
              系统提醒：{{item.content}}
            </div>
            <el-tag size="mini" style="margin: 1% 2% 2% 0;float: right;" >{{item.time}}</el-tag>  
            <hr style="border-style:dashed;color:#C0C0C0;margin:2% 0 0% 0 ; clear:both"  SIZE=1/>
          </div>
        </div>
        <div style="font-size:12px;float: left;margin-top: 5%;color:#918c8c;margin-left: 1.5%;">
          共&nbsp;{{message.length}}&nbsp;条记录</div>
      </div>

    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import Navigation from './Navigation.vue'
export default {
  data() {
    return   {
      username:sessionStorage.getItem('username'),
      userid:sessionStorage.getItem('userid'),
      labels:[],
      inputVisible:false,
      inputValue:'',
      user: {
        sign:'',
        data:[0,0,0,0],
        dataName:['总账单数','总账本数','总支出','总收入'],
        budget:0,
        labels:[],
        inputVisible:false,
        inputValue:'',
        time:{
          mim:0,
          hour:0,
        },
        newTime:{
          min:0,
          hour:0,
        },
      },
      message:[
        {
          id:1,
          content:'',
          time:'',
          isread:0,
          type:1,
        },
      ],
      isShowTime:false,
    }
  },
  components: { Navigation },
  mounted(){
			this.getAllInfo();//在html加载完成后进行，相当于在页面上同步显示后端数据
      this.getAllLabels();
      this.getMessage();
	},
  methods: {
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
    handleChange(value) {
        console.log(value);
      },
      changeToBooking(){
        this.$emit("changeComponent1Data", "booking",true);
      },
      changeToBills(){
        this.$emit("changeComponent1Data", "bills",true);
      },
      changeToSharing(){
        this.$emit("changeComponent1Data", "sharing",true);
      },
      changeToReporting(){
        this.$emit("changeComponent1Data", "reporting",true);
      },
      openMessageBox(id,type,content){
        const mydata = {
        	id:id,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/message/updateMessage',
          data: Qs.stringify(mydata)
      	})
				.then( res => {
          this.getMessage();
				})
        let cancel='去记账';
        switch(type){
          case 1:
            cancel='去记账';break;
          case 2:
            cancel="去设置";break;
          case 3:
            cancel="去查看";break;
          case 4:
            cancel="去看看";break;
          case 5:
            cancel="去邀请";break;
        }
        this.$confirm(content, '系统提醒', {
          distinguishCancelAndClose: true,
          confirmButtonText: cancel,
          cancelButtonText: '确定',
        })
        .then(() => {
          switch(type){
            case 1:
              this.changeToBooking();break;
            case 2:
              this.updateBudget();break;
            default:
              this.changeToBills();
          }
        })
        .catch(action => {
        });
      },
      deleteMessage(id){
        const mydata = {
        	id:id,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/message/deleteMessage',
          data: Qs.stringify(mydata)
      	})
				.then( res => {
          this.getMessage();
				})
      },
      getAllInfo(){
        const mydata = {
        	username: this.username,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/user/getInfo',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.user.sign=res.data.sign;
          this.user.data=res.data.data;
          this.user.budget=res.data.budget;
          this.user.time.min=res.data.time%100;
          this.user.newTime.min=this.user.time.min;
          this.user.time.hour=Math.floor(res.data.time/100);
          this.user.newTime.hour=this.user.time.hour;
				})
      },
      getAllLabels(){
        //加载所有标签
        const mydata = {
        	username: this.username,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/label/getLabels/',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.labels=res.data;
				})
      },
      getMessage(){
        const mydata = {
        	userid:this.userid,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/message/getMessage',
          data: Qs.stringify(mydata)
      	})
				.then( res => {
          this.message=res.data;
				})
      },
      showCancel(){
        this.$message({
            type: 'info',
            message: '取消修改'
          }); 
      },
      updateTime(){
        let myTime=this.user.newTime.hour*100+this.user.newTime.min+"";
        const mydata = {
        	username: this.username,
          time:myTime,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/user/update/time',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.$message({
            type: 'success',
            message: '记账时间设置成功！' 
          });
          this.user.time.min= this.user.newTime.min;
          this.user.time.hour=this.user.newTime.hour;
          this.isShowTime=false;
				})
      },
      updateBudget(){
        this.$prompt('请输入消费预算：', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue:this.user.budget,
        }).then(({ value }) => {
          const mydata = {
        	username: this.username,
          budget: value,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/user/update/budget',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.$message({
            type: 'success',
            message: '消费预算设置成功！' 
          });
          this.user.budget=value;
				})

        }).catch(() => {
                this.showCancel();
        });
      },
      updateSign(){
        this.$prompt('请输入个性签名：', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue:this.user.sign,
        }).then(({ value }) => {
          const mydata = {
        	username: this.username,
          sign: value,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/user/update/sign',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.$message({
            type: 'success',
            message: '个性签名修改成功！' 
          });
          this.user.sign=value;
				})

        }).catch(() => {
          this.showCancel();   
        });
      },
      updatePassword(){
        this.$prompt('请输入新密码：', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const mydata = {
        	username: this.username,
          password: value,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/user/update/password',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          if(res.data=='1'){
            this.$message({
            type: 'success',
            message: '新密码设置成功！' 
          });
          }else{
            this.$message({
            type: 'error',
            message: '新密码不能和旧密码一致！' 
          });
          }
				})
        }).catch(() => {
          this.showCancel();       
        });
      },
      deleteLabel(label){
        const mydata = {
        	username: this.username,
          labelName:label,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/label/delete',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.$message({
            type: 'success',
            message: '删除成功！' 
          });
          this.labels.splice(this.labels.indexOf(label),1);
				})
      },

      showInput() {
        if(this.labels.length>=20){
          this.showMessage("标签不能多余20个！");
          return;
        }
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {  //添加标签
        let inputValue = this.inputValue;
        if (inputValue) {
          if(this.labels.indexOf(inputValue)<0){
            this.labels.push(inputValue);
            const mydata = {
        	    username: this.username,
              labelName:inputValue,
      	    }
            this.axios({
        	    method: 'post',
        	    url: '/api/label/addLabel/',
              data: Qs.stringify(mydata)
      	    })
          }
          else{
            this.showMessage("请勿重复添加标签！");
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

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
      color: rgb(66, 57, 57);
   }
.left,.right{
  margin: 1.5vw;
  background: #ffe7ea;
  filter: drop-shadow(2px 2px 5px rgb(223, 209, 209));

  display: flex;
  flex-direction: column;
  padding: 1.5vw;
}
.left{
  margin-right: .5vw;
  flex: 1;
}

img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

.right{
  flex:1;
}

::-webkit-scrollbar { display: none; }

</style>

