<template>
  <div id="mainapp">
      <div class="left">
        <el-button type="primary" size="small" style="float:right;margin-left: 1.5%;" @click="typeIndex=2;getAllShares(2,0)"
          v-if="typeIndex!=2">查看我的动态</el-button>
        <el-button type="primary" size="small" style="float:right;margin-left: 1.5%;" @click="typeIndex=4;getAllShares(4,0)"
          v-if="typeIndex!=4">我的点赞</el-button>
        <el-button type="primary" size="small" style="float:right;margin-left: 1.5%;" @click="typeIndex=1;getAllShares(1,0)"
          v-if="typeIndex!=1">查看所有</el-button>
          <div style="font-size:12px;float: right;margin-top: 2.5%;color:#918c8c;margin-right: 2%;">
            共&nbsp;{{shares.length}}&nbsp;条结果</div>
        <div style="text-align:left" v-if="typeIndex==1||typeIndex==3">分享动态</div>
        <div style="text-align:left" v-if="typeIndex==4">我的点赞</div>
        <div style="text-align:left" v-if="typeIndex==2">我的分享动态</div>
        
        <hr style="border-style:dashed;color:#C0C0C0;width: 100%;"  SIZE=1/>
        <div style="height: 88.5%;overflow: auto;">
          <el-card  v-for="item in shares" :key="item.id" style="background:rgba(255, 255, 255, 0.3);margin-bottom: 2%;">
            <img src="../img/head-icon.jpg" style="width: 8%;height: 8%;border-radius: 100%;float: left;">
            <div style="float: left;margin-left: 1.5%;position: relative;top:-10px;text-align: left;width:74%;">
              <el-tag size="small" >用户：{{item.user.username}}</el-tag>
              <div style="font-size:12px;margin-top: 4px;color:#918c8c;transform: scale(.9);transform-origin: left;margin-left: 4px;">
                个性签名：{{item.user.sign}}</div>
            </div>
            <el-button type="primary" icon="el-icon-star-off" style="padding: 5px 10px;" @click="update(item.id,item.likes,1,1)"
                v-if="item.isLike==0">{{item.likes}}</el-button>
            <el-button type="primary" icon="el-icon-star-on" style="padding: 5px 10px;" @click="update(item.id,item.likes,1,-1)"
                v-if="item.isLike==1">{{item.likes}}</el-button>
            <div style="float: left;font-size:.9rem;margin-left: 11%;margin-bottom: 8px;">{{item.content}}</div>
            <el-card shadow="hover" style="width: 86%;margin-left: 10%;cursor: pointer;background:rgba(255, 255, 255, 0.5);padding: 0;">
              <div @click="showBookDetail(item.id,item.views,item.book.id)">
                <el-tag size="mini" style="padding:0px 4px;float: right;" effect="plain" type="info">
                  最后修改时间：{{item.book.lastdate}}
                </el-tag> 
                <div style="font-size:1.2rem;position:relative;top:-2px;text-align: left;">{{item.book.name}}</div>  
                <el-button size="mini" style="padding:4px 4px 4px 4px;float: right;">
                  创建时间：{{item.book.date}}
                </el-button>   
                <div style="font-size:12px;color:#918989;margin-top: 3px;text-align: left;" v-if="item.book.remark">
                  备注：{{item.book.remark}}
                </div>
              </div>
            </el-card>
            <el-tag size="mini" style="padding:0px 4px;float: right;margin-right: 3.6%;margin-top: 2%;" effect="plain" >
               时间：{{item.date}}
            </el-tag> 
            <el-button type="primary" icon="el-icon-view" style="padding: 5px 10px;float:left;margin: 1.5% 0% 2.5% 10%;" disabled>{{item.views}}</el-button>
            <el-button type="info" style="padding: 5px 10px;float:left;margin: 1.6% 2%" v-if="item.isMe==1" 
              @click="deleteShare(item.id)">删除</el-button>
          </el-card>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="right">
        <div style="height:280px;width:100%">
          <div style="text-align:left">点赞排行榜</div>
          <hr style="border-style:dashed;color:#C0C0C0;width: 100%;"  SIZE=1/>
          <div v-for="item in rankForLike" :key="item.id" style="cursor: pointer;transition: .5s;" class="rank-box"
            @click="typeIndex=3;getAllShares(3,item.id)">
            <el-button type="primary" plain icon="el-icon-star-on" style="padding: 2px 5px;float: right;
              background:rgba(255, 255, 255, 0.1);border: none;margin-right: 1%;" >{{item.likes}}</el-button>
                  <el-button  size="mini" circle style="padding:0px 3px;float: left;margin-top: 2px;" plain
                    :type="item.number==1? 'success':'info'" >{{item.number}}</el-button>
            <span style="width:50%;overflow:hidden;font-size: .8rem;display: inline-block;float:left;
              white-space: nowrap;text-overflow: ellipsis;margin-left: 3%;text-align: left;">{{item.content}}</span>
            <hr style="border-style:dashed;color:#e2dddd;width:100%;margin: 2px auto;"  SIZE=1/>
          </div>
        </div>
        <div style="text-align:left;margin-top: 10%;">浏览排行榜</div>
        <hr style="border-style:dashed;color:#C0C0C0;width: 100%;"  SIZE=1/>
        <div v-for="item in rankForView" :key="item.id" style="cursor: pointer;transition: .5s;" class="rank-box"
          @click="typeIndex=3;getAllShares(3,item.id)">
          <el-button type="primary" plain icon="el-icon-view" style="padding: 2px 5px;float: right;
            background:rgba(255, 255, 255, 0.1);border: none;margin-right: 1%;" >{{item.views}}</el-button>
                <el-button  size="mini" circle style="padding:0px 3px;float: left;margin-top: 2px;" plain
                  :type="item.number==1? 'success':'info'" >{{item.number}}</el-button>
          <span style="width:50%;overflow:hidden;font-size: .8rem;display: inline-block;float:left;text-align: left;
            white-space: nowrap;text-overflow: ellipsis;margin-left: 3%;">{{item.content}}</span>
          <hr style="border-style:dashed;color:#e2dddd;width:100%;margin: 2px auto;"  SIZE=1/>
        </div>
      </div>

      <el-dialog
        :visible.sync="bookDetailVisible"
        width="34%"
        center>
            <el-button size="mini" style="padding:4px;float: right;" >
              最后修改时间：{{bookDetail.lastdate}}
            </el-button> 
            <div style="font-size:1.2rem;position:relative;top:-2px;text-align: left;" >{{bookDetail.name}}</div>  
            <el-tag size="mini" style="padding:0px 4px;float: right;margin-top: 1px;" effect="plain" type="info">
              创建时间：{{bookDetail.date}}
            </el-tag>   
            <div style="font-size:12px;color:#918989;margin-top: 3px;text-align: left;" v-if="bookDetail.remark">
              备注：{{bookDetail.remark}}
            </div>
        <div style="max-height: 300px;width:100%;overflow: auto;margin-top: 10px;">
          <el-card v-for="item in bookDetail.records" :key="item.id" style="margin-top: 10px;" shadow="hover">
                        <i class="el-icon-coin" style="position:relative;top:-5px;"></i>
                        <span style="font-size:15px;position:relative;top:-5px;">{{item.money}}</span>
                        <el-button :type="item.isIncome==1? 'danger':'warning'" size="mini" circle 
                          style="padding:4px 4px 4px 4px;position:relative;top:-7px;margin-right:5px">
                          {{item.isIncome==1?"收":"支"}}
                        </el-button>
                        <el-tag effect="dark" size="mini" style="position:relative;top:-2px;" v-if="item.label!=''" >
                          <span style="max-width: 50px;display: inline-block;overflow: hidden;white-space: nowrap;
                            text-overflow: ellipsis;position:relative">
                            {{item.label}}
                          </span>
                        </el-tag>
                        <el-tag size="mini" style="padding:0px 6px;float: right;margin-top: -2px;" effect="plain" >
                          消费日期：{{item.date}}
                       </el-tag> 
                        <div style="font-size:12px;color:#686868;" v-if="item.remarks">
                          备注：{{item.remarks}}
                        </div>
          </el-card>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import Qs from 'qs';
export default {
  data() {
    return {
      userid:sessionStorage.getItem('userid'),
      bookDetailVisible:false,
      typeIndex:1,
    
      shares:[
        {
          id:1,
          user:{
            username:'',
            sign:'',
          },
          book:{
            id:1,
            name:'',
            remark:'',
            date:'',
            lastdate:'',
          },
          content:"",
          date:'',
          likes:0,
          views:0,
          isLike:0,
          isMe:0,
        },
      ],
      bookDetail:{
        name:'欣欣的账本',
        remark:'今天天气真好天气真好今天天气真好天气',
        date:'2022-03-5 15:16:20',
        lastdate:'2022-03-12 16:20:30',
        records:[
          {
            id:0,
            money:0, //金额
            isIncome: 0,  //支出/收入
            date:'', //日期
            label:'', //标签
            remarks:''
          },
        ]
      },
      rankForLike:[
        {
          id:0,
          number:0,
          content:'',
          likes:0,
        },
      ],
      rankForView:[
        {
          id:0,
          number:0,
          content:'',
          views:0,
        },
      ]
      
    }
  },
  mounted(){
			this.getAllShares(1,0);
      this.getAllRanks();
	},
  methods:{
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
    getAllRanks(){
      this.axios({
        	method: 'post',
        	url: '/api/share/getRankForLike/',
      })
			.then( res => {
          this.rankForLike=res.data
			})
      this.axios({
        	method: 'post',
        	url: '/api/share/getRankForView/',
      })
			.then( res => {
          this.rankForView=res.data
			})
    },
    getAllShares(type,id){
      const mydata = {
        	userid:this.userid,
          type:type,
          id:id,
      }
      this.axios({
        	method: 'post',
        	url: '/api/share/getAll/',
          data: Qs.stringify(mydata)
      })
			.then( res => {
          this.shares=res.data;
			})
    },
    showBookDetail(id,num,bookid){
      const mydata = {
        	bookid:bookid,
      }
      this.axios({
        	method: 'post',
        	url: '/api/share/getRecordByBook/',
          data: Qs.stringify(mydata)
      })
			.then( res => {
          this.bookDetail=res.data;
          this.bookDetailVisible=true;
          this.update(id,num,2,1);
			})
    },
    update(id,num,type,isAdd){
      const mydata = {
        	id:id,
          num:num+isAdd,
          type:type,
          userid:this.userid,
      }
      this.axios({
        	method: 'post',
        	url: '/api/share/update/',
          data: Qs.stringify(mydata)
      })
			.then( res => {
          if(type==1){
            if(isAdd==1){
              this.showMessage("点赞成功！",1);
            }
            else{
              this.showMessage("取消点赞！",1);
            }
            for(let i=0;i<this.shares.length;i++){
              if(this.shares[i].id==id){
                this.shares[i].likes=num+isAdd;
                if(isAdd==1)
                  this.shares[i].isLike=1;
                else
                  this.shares[i].isLike=0;
                break;
              }
            }
          }
          else{
            for(let i=0;i<this.shares.length;i++){
              if(this.shares[i].id==id){
                this.shares[i].views=num+1;
                break;
              }
            }
          }
          this.getAllRanks();
			})
    },
    deleteShare(id){
        this.$confirm('确定删除该分享吗？', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const mydata = {
            id:id,
      	  }
          this.axios({
            method: 'post',
        	  url: '/api/share/delete/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {
            this.showMessage("删除成功",1);
            for(let i=0;i<this.shares.length;i++){
              if(this.shares[i].id==id){
                this.shares.splice(i,1);
                break;
              }
            }
          })
        }).catch(() => {
          this.showMessage("取消删除！");    
        });
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
      font-size: 1.6rem;
  }
.left,.right{
  margin: 1.5vw ;
  background: #ffe7ea;
  filter: drop-shadow(2px 2px 5px rgb(223, 209, 209));

  padding: 1.5vw;
  flex:3;
}
.left{
  margin-right: .5vw;
}
.right{
  flex: 1;
}

.rank-box:hover{
  background:rgba(255, 255, 255, 0.3);
}

::-webkit-scrollbar { display: none; }
</style>