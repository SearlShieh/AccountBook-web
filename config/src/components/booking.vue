<template>
  <div id="mainapp">
    <div class="add-btn" v-if="isShowAddRecord!=0" @click="updateInput();isShowAddRecord=0;">
      <div>记录</div>
      <div>账单</div>
    </div>
    <el-card class="box-card" style="overflow: hidden;text-align:left" >
      <div style="margin-bottom:10px;text-align:center">
        <span style="text-align:center;font-size:24px;">近期账单记录</span>
      </div>

                <!-- 排序选择框 -->
                <el-select v-model="sortType" size="mini" placeholder="请选择排序方式" style="float: right;width: 40%;margin-left: 1%;"
                  @change="getallBook()">
                  <el-option label="按消费日期排序" value='1'></el-option>
                  <el-option label="按最后修改时间排序" value='2'></el-option>
                </el-select>
                <el-select v-model="labelType" size="mini" style="float:right;width: 30%;margin-left: 1%;" placeholder="请选择标签"
                  @change="getallBook()">
                  <el-option label="所有标签" value="全部"></el-option>
                  <el-option v-for="(item,i) in labels"  :label="item" :key="i" :value="item"></el-option>
                </el-select>
                <el-select v-model="isIncomeType" size="mini" style="float:right;width: 18%;" 
                  placeholder="请选择消费类型" @change="getallBook()">
                  <el-option label="所有" value="1"></el-option>
                  <el-option label="支出" value="2"></el-option>
                  <el-option label="收入" value="3"></el-option>
                </el-select>

                  <el-date-picker v-model="dateSelect" align="right" type="date" size="mini" placeholder="选择日期" 
                    :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="getallBook()" 
                    style="float: right;margin-top: 1%;">
                  </el-date-picker>
                <el-select v-model="bookType" size="mini" style="float:right;width: 40%;margin-top: 1%;margin-right: 2%;" placeholder="请选择账本"
                  @change="getallBook()">
                  <el-option label="所有账本" value="0"></el-option>
                  <el-option v-for="(item,i) in books"  :label="item.name" :key="i" :value="item.id"></el-option>
                </el-select>
      
                <!-- 账单列表 -->
                <!-- <vue-scroll :ops="ops" style="width:98%;max-height:400px;margin:0% 1% 0 1%">  -->
                  <div class="bookapp2">
                    <div  v-for="item in mybook" :key="item.recordId" class="bill-box">    
                      <hr style="border-style:dashed;color:#C0C0C0;margin:0px 0 10px 0 ; clear:both"  SIZE=1/>
                      <div>
                        <i class="el-icon-coin" style="position:relative;top:-5px;"></i>
                        <span style="font-size:15px;position:relative;top:-5px;">{{item.money}}</span>
                        <el-button :type="item.isIncome=='支'? 'danger':'warning'" size="mini" circle 
                          style="padding:4px 4px 4px 4px;position:relative;top:-7px;margin-right:5px">
                          {{item.isIncome}}
                        </el-button>
                        <el-tag effect="dark" size="mini" style="position:relative;top:-2px;" v-if="item.label!=''" >
                          <span style="max-width: 50px;display: inline-block;overflow: hidden;white-space: nowrap;
                            text-overflow: ellipsis;position:relative">
                            {{item.label}}
                          </span>
                        </el-tag>
                        
                        <div style="font-size:12px;color:#686868;float: right;">
                          消费日期：{{item.date}}
                        </div>
                      </div>
                      <div style="width:98%;overflow: auto;height: 30px;margin-top: 0;position: relative;top:-6px">
                        <el-tag size='small' style="margin:5px 5px 0 0" v-for="item2 in item.books" :key="item2">{{item2}}</el-tag>
                      </div>
                      <div style="font-size:12px;color:#686868;" v-if="item.remarks">
                        备注：{{item.remarks}}
                      </div>
                      <el-popconfirm
                          title="确定删除这条账单吗？"
                          @confirm="deleteRecord(item.recordId)"
                          icon-color="pink"
                          v-if="item.isprivate==1"
                        >
                          <el-button slot="reference" size="mini" style="padding:4px 4px 4px 4px;position:relative;top:-7px;
                            float: right;margin-left: 1%;">删除</el-button>
                        </el-popconfirm>
                        <el-button  size="mini" style="padding:4px 4px 4px 4px;position:relative;top:-7px;float: right;" 
                            @click="changeToSomeBill(item.recordId)" v-if="item.isprivate==1">编辑</el-button>
                      <div style="font-size:12px;margin-bottom: 5px; color:#686868;">
                        最后修改时间：{{item.bookDate}}
                      </div>

                    <div>
                      </div>
                   
                  </div>
                  </div>
                <!-- </vue-scroll> -->
                <div style="font-size:12px;float: left;margin-top: 5%;color:#918c8c;margin-left: 1.5%;">
                  共&nbsp;{{mybook.length}}&nbsp;条记录</div>
    </el-card>

    <el-card class="box-card2" >
      <span style="text-align:center;font-size:24px;" v-if="isShowAddRecord==0">记录你的账单</span>
      <span style="text-align:center;font-size:24px;" v-else>账单信息</span>
      <vue-scroll :ops="ops" style="width:100%;height:410px;margin:20px 0 0 0"> 
      <div class="bookapp">
      <el-form ref="form" :model="form"  style="text-align:left" label-width="42px">
            <el-form-item label="金额">
              <el-input v-model="form.money" size="small" suffix-icon="el-icon-edit" label="money" style="width:180px;float:left" 
                placeholder="请输入数字" maxlength="9" show-word-limit></el-input>
              <el-alert title="请输入金额" v-if="showAlert" type="info" :closable="false" 
                style="height:30px;width:130px;float:left;position:relative;left:5px;top:5px" show-icon>
              </el-alert>
            </el-form-item>
              
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
            <el-form-item label="类型" >
              <el-radio-group v-model="form.typeRadio" size="small">
                <el-radio-button label="支出"></el-radio-button>
                <el-radio-button label="收入"></el-radio-button>
              </el-radio-group>
            </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <el-form-item label="日期">
          <div class="block">
            <el-date-picker v-model="form.bookData" align="right" type="date" size="small" placeholder="选择日期" 
            :picker-options="pickerOptions" value-format="yyyy-MM-dd" >
            </el-date-picker>
          </div>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <el-form-item label="标签">
          <el-radio-group v-model="form.bookLabel">
            <el-radio  :key="radio"  v-for="radio in form.bookLabels" 
              :label="radio" size="small" border style="margin:5px 5px 5px 0" >
              {{radio}}
            </el-radio>
      
            <el-select v-if="selectLabelVisible" v-model="selectLabelValue" placeholder="请选择标签" ref="saveTagselectLabel" 
              size="small" @keyup.enter.native="handleselectLabelConfirm" @change="handleselectLabelConfirm" 
              style="margin:5px 5px 5px 0;width:120px">
              <el-option v-for="item in form.booksLabels" :key="item" :value="item" ></el-option>
            </el-select>
            <el-button v-else class="button-new-tag" size="small" @click="showSelectLabel" style="margin:5px 5px 5px 0;
              width:120px">选择其它标签
            </el-button>

            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" 
              size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"  maxlength="5" show-word-limit
              style="margin:5px 5px 5px 0;width: 100px;">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput" style="margin:5px 5px 0px 0;">+ 添加新标签
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="small" @click="clearLabel" style="margin:0;padding:9px">取消选择</el-button>
          </el-radio-group>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <el-form-item label="账本">
          <el-radio-group disabled size="small" >
            <el-radio-button v-model="form.book">{{form.bookData.substring(0,4)}}年{{form.bookData.substring(5,7)}}月账本</el-radio-button>
          </el-radio-group>
          <el-tag :key="tag" v-for="tag in form.bookTags" closable :disable-transitions="false" @close="handleClose(tag)"
            style="margin-right: 5px" effect="plain"  >
            {{tag}}
          </el-tag>
          <el-select v-if="selectVisible" v-model="selectValue" placeholder="请选择账本" ref="saveTagSelect" 
            size="small" @keyup.enter.native="handleSelectConfirm" @change="handleSelectConfirm" >
            <el-option v-for="item in form.booksTags" :key="item" :value="item"></el-option>
          </el-select>
          <el-button v-else class="button-new-tag" size="small" @click="showSelect" style="margin:5px 5px 5px 0">+ 添加至其他账本
          </el-button>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <el-form-item label="备注" size="small" style="position:relative;top:8px;">
          <el-input v-model="form.remark" suffix-icon="el-icon-edit"  placeholder="请输入内容"  maxlength="18" show-word-limit
            style="width:320px"></el-input>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0;position:relative;top:15px;"  SIZE=1/>
      </el-form>
      </div> </vue-scroll><span style="position:relative;top:20px">{{this.rid}}
      <!-- <span>{{form.money}}、{{form.typeRadio}}、{{form.bookLabel}}、{{form.bookData}}、{{form.remark}}、{{form.bookTags}}</span> -->
      <el-tooltip effect="light" content="添加记录" placement="bottom-start" v-if="isShowAddRecord==0">
        <el-button type="primary" size="small" circle  @click="addBook">
          <i class="el-icon-check"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="保存修改" placement="bottom-start" v-else>
        <el-button type="primary" size="small" circle  @click="updateRecord">
          <i class="el-icon-check"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="清空内容" placement="bottom-start">
        <el-button type="primary" size="small" circle @click="updateInput">
          <i class="el-icon-delete"></i>
        </el-button>
      </el-tooltip>
      </span>
      </el-card>
      
  </div>
</template>

<script>
import Qs from 'qs';
export default {
  data() {
      return {
        sortType:'1',  //排序方式
        isIncomeType:'1', //显示收入还是支出
        labelType:'全部',
        labels:[''],
        bookType:'0',
        books:[
          {
            name:'',
            id:0,
          }
        ],
        isShowAddRecord:0,
        visible:false,
        dateSelect:'',
        mybook:[
          {
            money:0, //金额
            recordId:0,
            isIncome: '',  //支出/收入
            date:'', //日期
            bookDate:'',
            label:'', //标签
            books:[],//月账本
            remarks:'',
            isprivate:1,
          },
        ],

        form: {
          money: '',//金额    
          bookData:'', //日期
          bookLabel:'', //选定标签
          typeRadio: '支出',  //支出/收入
          remark:'', //备注
          book:'',//月账本
          bookTags: [],//已添加的自定义账本集

          booksTags: [],//全部自定义账本集
          bookLabels: [],//显示的标签集
          booksLabels:[],//未显示的标签集
        },

        username:sessionStorage.getItem('username'),
        inputVisible: false,
        selectVisible: false,
        inputValue: '',
        selectValue: '',
        selectLabelVisible:false,
        selectLabelValue:'',
        showAlert:false,
         currentPage4: 4,
        rid:'',

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },

        ops: {  //滚动条样式
          bar: {
            onlyShowBarOnScroll: true, //是否只有滚动的时候才显示滚动条
            background: "	#E0E0E0 ",//滚动条颜色
            "overflow-x": "hidden",
            position:"relative",
            scrollLeft:"10px",
          }
        }

      }
    },
    mounted(){
			this.getAllInfo();//在html加载完成后进行，相当于在页面上同步显示后端数据
      this.getallBook();
		},

    methods: {
      getAllInfo(){
        //获取当前日期
        let year = new Date().getFullYear();
        let month =new Date().getMonth() + 1 < 10? "0" + (new Date().getMonth() + 1): new Date().getMonth() + 1;
        let date =new Date().getDate() < 10? "0" + new Date().getDate(): new Date().getDate();
        this.form.bookData = year+"-" + month + "-" + date;

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
          for(var i = 0;i<res.data.length;i++){
            this.form.booksLabels.push(res.data[i]);
          }
          this.labels=res.data;
				})
        //加载所有账本
        this.axios({
        		method: 'post',
        		url: '/api/book/getBooksWithNoMonthly/',
            data: Qs.stringify(mydata)
      	})
				.then( res => {
            for(var i = 0;i<res.data.length;i++){
              this.form.booksTags.push(res.data[i]);
            }
				})
        this.axios({
        		method: 'post',
        		url: '/api/book/getAllBooksName/',
            data: Qs.stringify(mydata)
      	})
				.then( res => {
            this.books=res.data;
				})
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

      changeToSomeBill(recordId){
        this.isShowAddRecord=recordId;
        for(let i=0;i<this.mybook.length;i++){
          if(this.mybook[i].recordId==recordId){
            this.form.money=this.mybook[i].money;
            this.form.typeRadio=this.mybook[i].isIncome=='支'?'支出':'收入';
            this.form.bookData=this.mybook[i].date;
            this.form.remark=this.mybook[i].remarks;

            this.form.bookLabels.forEach(item => {
              this.form.booksLabels.push(item);
            })
            for(let j=0;j<this.form.booksLabels.length;j++){
              if(this.form.booksLabels[j]==this.mybook[i].label){
                this.form.booksLabels.splice(j,1);
              }
            }
            this.form.bookLabels=[];
            if(this.mybook[i].label==null||this.mybook[i].label==''||this.mybook[i].label==undefined){
              this.form.bookLabel="";
            }
            else{
              this.form.bookLabels.push(this.mybook[i].label);
              this.form.bookLabel=this.mybook[i].label;
            }
           

            let showBooks=[];
            this.mybook[i].books.forEach(item=>{
              if(item!=this.form.bookData.substring(0,4)+"年"+this.form.bookData.substring(5,7)+"月账本")
                showBooks.push(item);
            })

            this.form.bookTags.forEach(item => {
              this.form.booksTags.push(item);
            })

            for(let j=0;j<this.form.booksTags.length;j++){
              for(let k=0;k<showBooks.length;k++){
                if(showBooks[k]==this.form.booksTags[j]){
                  this.form.booksTags.splice(j,1);
                  continue;
                }
              }
            }

            this.form.bookTags=[];
            this.form.bookTags=showBooks;
            return;
          }
        }
      },

      getallBook(){
          const mydata = {
        	  username: this.username,
            incomeType:this.isIncomeType*1,
            sortType:this.sortType*1,
            labelName:this.labelType,
            date:this.dateSelect,
            book:this.bookType,
      	  }
          this.axios({
            method: 'post',
        	  url: '/api/record/getAllRecord/',
            data: Qs.stringify(mydata)
      	  })
          .then(res=>{         
            this.mybook=res.data;
          })
      },

      addBook(){
        let regs=/^(\d+)(\.\d+)?$/;
        if(this.form.money&&regs.test(this.form.money)){
          const mydata = {
        	  userid: sessionStorage.getItem('userid')*1,
            money: this.form.money+'',//金额    
            isincome: this.form.typeRadio,  //支出/收入
            date:this.form.bookData+'', //日期
            booklabel:this.form.bookLabel, //选定标签
            remark:this.form.remark, //备注
            books: this.form.bookTags+'',//已添加的自定义账本集
            isprivate:1,
      	  }
          
          this.axios({
            method: 'post',
        	  url: '/api/record/addRecord/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {
              this.showMessage("添加成功！",1);
              this.updateInput();
				  })
          
        }
        else{
          this.showMessage("请输入浮点类型的金额数字！");
        }
      },

      updateRecord(){
        let regs=/^(\d+)(\.\d+)?$/;
        let newBooks=this.form.bookTags.concat();
        newBooks.push(this.form.bookData.substring(0,4)+"年"+this.form.bookData.substring(5,7)+"月账本");
        if(this.form.money&&regs.test(this.form.money)){
          const mydata = {
            recordid:this.isShowAddRecord,
            money: this.form.money+'',//金额    
            isincome: this.form.typeRadio,  //支出/收入
            date:this.form.bookData+'', //日期
            booklabel:this.form.bookLabel, //选定标签
            remark:this.form.remark, //备注
            books: newBooks+'',//已添加的自定义账本集
      	  }
          this.axios({
            method: 'post',
        	  url: '/api/record/updateRecord/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {
              this.getallBook();
              this.showMessage("修改成功！",1);
				  })
          
        }
        else{
          this.showMessage("请输入浮点类型的金额数字！");
        }
      },

      updateInput(){
        this.form.money='';
        this.form.bookLabel='';
        this.form.typeRadio='支出';
        this.form.remark='';

        let year = new Date().getFullYear();
        let month =new Date().getMonth() + 1 < 10? "0" + (new Date().getMonth() + 1): new Date().getMonth() + 1;
        let date =new Date().getDate() < 10? "0" + new Date().getDate(): new Date().getDate();
        this.form.bookData = year+"-" + month + "-" + date;

        this.form.bookTags.forEach(item => {
          this.form.booksTags.push(item);
        })
        this.form.bookTags=[];
          
        this.form.bookLabels.forEach(item => {
          this.form.booksLabels.push(item);
        })
        this.form.bookLabels=[];

        this.inputVisible=false;
        this.selectVisible=false;
        this.inputValue= '';
        this.selectValue='';
        this.selectLabelVisible=false;
        this.selectLabelValue='';
        this.showAlert=false;
      },

      deleteRecord(recordId){
        const mydata = {
        	recordId: recordId
      	}
        this.axios({
        	method: 'post',
        	url: '/api/record/deleteRecord',
          data: Qs.stringify(mydata)
      	})
				.then( res => {
          for(let i=0;i<this.mybook.length;i++){
            if(this.mybook[i].recordId==recordId){
              this.mybook.splice(i,1);
              break;
            }
          }
          this.showMessage("删除成功！",1);
				})
      },

      handleClose(tag) {
        this.form.bookTags.splice(this.form.bookTags.indexOf(tag), 1);
        this.form.booksTags.push(tag);
      },

      showInput() {
        if(this.form.bookLabels.length+this.form.booksLabels.length>=20){
          this.showMessage("标签不能多余20个！");
          return;
        }
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      showSelect() {
        this.selectVisible = true;
      },

      handleInputConfirm() {  //添加标签
        let inputValue = this.inputValue;
        if (inputValue) {
          let i=this.form.booksLabels.indexOf(inputValue);
          let j=this.form.bookLabels.indexOf(inputValue);
          if(i<0&&j<0){
            this.form.bookLabels.push(inputValue);
            this.form.bookLabel=inputValue;
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

      handleSelectConfirm() {
        let selectValue = this.selectValue;
        if (selectValue) {
          this.form.bookTags.push(selectValue);
          this.form.booksTags.splice(this.form.booksTags.indexOf(selectValue),1);
        }
        this.selectVisible = false;
        this.selectValue ='';
      },

      
      showSelectLabel() {
        this.selectLabelVisible = true;
      },

      handleselectLabelConfirm() {
        let selectLabelValue = this.selectLabelValue;
        if (selectLabelValue) {
          this.form.bookLabels.push(selectLabelValue);
          this.form.booksLabels.splice(this.form.booksLabels.indexOf(selectLabelValue),1);
        }
        this.form.bookLabel=selectLabelValue;
        this.selectLabelVisible= false;
        this.selectLabelValue ='';
      },
      clearLabel(){
        this.form.bookLabel='';
      },
    }
}
</script>

<style scoped>
 .text {
    font-size: 14px;
  }

  .item {
    margin: 0px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin: 18px 10px 18px 10px;
    width: 435px;
    height: 560px;
    opacity: 0.9;
    overflow:auto;
    float: left;padding:0 15px 0 10px;
    background:#ffe7ea;
  }

  .box-card2 {
    margin: 18px 10px 18px 15px;
    width: 460px;
    height: 560px;
    opacity: 0.9;
    overflow:auto;
    float: left;
    background:#ffe7ea;
  }
  
  .bookapp{
    width: 360px;
    height: 420px;
    background-clip: padding-box;
    margin:2px 0 0 0 ;
    padding: 0px 15px 0px 25px;
    background: none;
  }

  .bookapp2{
    width: 98%;
    height: 360px;
    margin:5px 0 0 0 ;
    padding: 0px 5px;
    background: none;
    overflow: auto;
    position: relative;
    top:8px;
  }

#mainapp{
    text-align: center;
    margin:0 auto;
    width: 1000px;
    height: 600px;
    overflow-y: auto; /* 当内容过多时y轴出现滚动条 */
    border:0px solid rgb(255, 253, 253);
    border-radius:5px;
    background: white;
      border: 10px solid rgba(255,255,255,.5);
      background-clip: padding-box;
      position: relative;
      display: flex;
    justify-content: center;
    align-content: center;
  }
  ::-webkit-scrollbar { display: none; }
  .el-form-item{
    margin-bottom: 12px;
    margin-top: 5px;
  }

  .bill-box{
  transition: 1.5s;
}
  .bill-box:hover{
    background:#ffeff5;
  }

  .add-btn{
  border: 1px solid pink;
  background-color: white;
  border-radius: 50%;
  width: 8%;
  height: 13.4%;
  position: absolute;
  bottom: 15%;
  z-index: 1;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: pink;
  cursor: pointer;
}
</style>