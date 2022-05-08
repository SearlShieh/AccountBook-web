<template>
  <div id="mainapp">
    <div class="add-btn" v-if="isShowAddBook!=0||isShowUpdateBook!=0" @click="isShowAddBook=0;isShowUpdateBook=0;updateInput()">
      <div>添加</div>
      <div>账本</div>
    </div>
    <div class="invite-btn" @click="showInviteVisible(1)">
      <div>邀请</div>
      <div>记录</div>
    </div>
      <div class="invite-btn invite-btn2" @click="showInviteVisible(2)">
        <div v-if="invitedMessageCount<1">受邀</div>
        <el-badge :value="invitedMessageCount" v-else><div>受邀</div></el-badge>     
        <div>消息</div>
      </div>
    
    <el-card class="box-card" style="overflow: hidden;text-align:left" >
      <div v-if="books.length<1" style="font-size: 1.5rem;color: rgb(109, 104, 104);text-align: center;
        margin: 30vh 0;">暂无数据</div>
      <el-carousel indicator-position="none" arrow="hover" :autoplay="false" width="500px" height="520px"
         @change="getRecordByBook" ref="carousel" v-else>
        <el-carousel-item v-for="item in books" :key="item.id">
          <!-- 账本信息 -->
          <div style="margin-bottom:1%;text-align:left;margin-left: 1%;">
            <span style="text-align:left;font-size:1.5rem;display: inline-block;max-width: 47%;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" @click="setActiveItem">{{item.name}}</span>
            <el-button type="info" size="small" circle v-if="item.username==username"
              style="padding:4px 4px 4px 4px;position:relative;top:-9px;">{{item.isPrivate?"私":"共"}}
            </el-button>
            <el-button type="info" size="small" circle v-else
              style="padding:4px 4px 4px 4px;position:relative;top:-9px;">享
            </el-button>
            <el-tooltip effect="light" content="切换账本" placement="bottom-start">
              <el-button type="warning" size="small" circle style="padding:4px;position: relative;top:-10px" 
                @click="bookChangeVisible=true">
                <i class="el-icon-sort"></i>
              </el-button>
            </el-tooltip>
            
            <el-button-group style="float: right;position: relative;right: 1%;top:5px" v-if="item.isMonthly==0&&item.username==username">
              <el-button type="danger" size="mini"  icon="el-icon-edit" @click="updateBook(item.id)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteBook(item.id)">删除</el-button>
            </el-button-group>
            <div style="font-size:12px;color:#686868;" v-if="item.description!=null&&item.description!=''" >
              备注:&nbsp{{item.description}}
            </div>
            <el-tag  size="small" style="float: right;" v-if="item.username2!=''&&item.username2!=username">协作者：{{item.username2}}</el-tag>
            <el-tag  size="small" style="float: right;" v-if="item.username2!=''&&item.username2==username">拥有者：{{item.username}}</el-tag>
            <div style="font-size:12px;color:#686868;" >
              创建时间：{{item.time}}
            </div>
            
            <div style="font-size:12px;color:#686868;" >
              最后修改时间：{{item.lasttime}}
            </div>
          </div>
          <!-- 排序选择框 -->
          <el-select v-model="labelType" size="mini" style="float:right;width: 30%;margin-left: 1%;" placeholder="请选择标签"
            @change="getRecordByBook(bookIndex)">
            <el-option label="所有标签" value="全部"></el-option>
            <el-option v-for="(item,i) in labels"  :label="item" :key="i" :value="item"></el-option>
          </el-select>
          <el-select v-model="isIncomeType" size="mini" style="float:right;width: 18%;" 
            placeholder="请选择消费类型" @change="getRecordByBook(bookIndex)">
            <el-option label="所有" value="1"></el-option>
            <el-option label="支出" value="2"></el-option>
            <el-option label="收入" value="3"></el-option>
          </el-select>

          <el-tooltip effect="light" content="分享账本" placement="bottom-start" >
            <el-button type="success" size="small" circle style="padding:4px;float:right;margin:0 2%;position: relative;top:3px"
              @click="shareBook(item.id)">
              <i class="el-icon-share"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="添加邀请人" placement="bottom-start" v-if="item.isPrivate==0&&item.username==username">
            <el-button type="success" size="small" circle style="padding:4px;float:right;position: relative;top:3px" 
              @click="addInvite(item.id)">
              <i class="el-icon-plus"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="邀请记录" placement="bottom-start" v-if="item.isPrivate==0&&item.username==username">
            <el-button type="success" size="small" circle style="padding:4px;float:right;position: relative;top:3px"
            @click="showBookInviteRecord(item.id,item.name)" >
              <i class="el-icon-document"></i>
            </el-button>
          </el-tooltip>

          <!-- 账单列表 -->
                  <div class="bookapp2">
                    <div v-if="mybook.length<1" style="font-size: 1.4rem;color: rgb(109, 104, 104);text-align: center;
                      margin: 20vh 0;">暂无账单记录</div>
                    <div  v-for="item in mybook" :key="item.recordId" class="bill-box">
                      <div>
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
                        <el-tag size='small' style="margin:5px 5px 0 0;cursor: pointer;" v-for="item2 in item.books" :key="item2"
                        @click="setActiveItem2(item2)">{{item2}}</el-tag>
                      </div>
                      <div style="font-size:12px;color:#686868;" v-if="item.remarks">
                        备注：{{item.remarks}}
                      </div>
                      <el-popconfirm
                     confirm-button-text='仅删除账本内的账单'
                          cancel-button-text='删除所有'
                          title="仅删除账本内的账单，还是删除所有的账单？"
                          @confirm="deleteRecord(item.recordId,bookIndex)"
                          @cancelm="deleteRecord(item.recordId,-1)"
                          icon-color="pink"
                          v-if="books[bookIndex].username==username&&item.isprivate==1"
                    >
                      <el-button slot="reference" size="mini" style="padding:4px 4px 4px 4px;position:relative;top:-7px;
                        float: right;margin-left: 1%;" v-if="books[bookIndex].username==username">删除</el-button>
                    </el-popconfirm>
                    <el-button  size="mini" style="padding:4px 4px 4px 4px;position:relative;top:-7px;float: right;" 
                        @click="changeToSomeBill(item.recordId)" v-if="books[bookIndex].username==username&&item.isprivate==1">编辑</el-button>
                      <div style="font-size:12px;margin-bottom: 5px; color:#686868;">
                        最后修改时间：{{item.bookDate}}
                      </div>
                    <div>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div style="font-size:12px;float: right;margin-top: 5%;color:#918c8c;width: 50%;text-align:right;">
                    总计消费<span style="font-weight: bold;margin: 0 1%;color: #7e7a7a;font-size: 14px;">{{totalMoney}}</span>元
                  </div>
                  <div style="float:right;width: 10%;height: 8%;display: flex;justify-content: center;align-items: center;
                    flex-direction: column;font-size: .8rem;color: pink;
                    border: 1px solid pink;background: #ffffff;border-radius: 100%;cursor: pointer;"
                    @click="showAddRecord">
                    <div>添加</div>
                    <div>账单</div>
                  </div>
                  <div style="font-size:12px;float: left;margin-top: 5%;color:#918c8c;margin-left: 1.5%;">
                    共&nbsp;{{mybook.length}}&nbsp;条记录
                    <i class="el-icon-refresh" style="cursor: pointer;" @click="getRecordByBook(bookIndex);showMessage('刷新成功',1)"></i>
                  </div>
        </el-carousel-item>
        
      </el-carousel>
      
    </el-card>

    <el-card class="box-card3" v-if="isShowAddBook==0">
      <span style="font-size:24px;" v-if="isShowUpdateBook!=0">账本信息</span>
      <span style="font-size:24px;" v-else>添加账本</span>
      <div class="right-main">
        <el-form ref="form" :model="form"  style="text-align:left" label-width="3.5em">
          <el-form-item label="名称" style="margin-top: 5%;">
            <el-input v-model="book.name" size="small" suffix-icon="el-icon-edit" maxlength="10" show-word-limit label="name" 
              style="width:280px;float:left;" placeholder="请输入账本名称"></el-input>
          </el-form-item>
          <hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
          <el-form-item label="权限" >
            <el-radio-group v-model="book.isprivate" size="small" :disabled="isShowUpdateBook==0? false:true">
              <el-radio-button label="个人"></el-radio-button>
              <el-radio-button label="共享"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="book.remark" size="small" suffix-icon="el-icon-edit" maxlength="30" show-word-limit label="name" 
              style="width:280px;float:left" placeholder="请输入备注" ></el-input>
          </el-form-item>
          <hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
          <el-form-item :style="{display: (isPrivate? 'block':'none')}"  label="邀请" v-if="isShowUpdateBook==0">
            <el-input v-model="book.username" size="small" suffix-icon="el-icon-edit" maxlength="10" show-word-limit label="name" 
              style="width:280px;float:left" placeholder="请输入用户昵称"></el-input>
          </el-form-item>
          <hr style="border-style:dashed;color:#C0C0C0" v-if="isPrivate&&isShowUpdateBook==0"  SIZE=1 />
        </el-form>
        <div style="width: 80%;margin:10% auto;text-align: left;">
          <div style="font-size:12px;color:#686868;" >
            注：1. 账本名称不能为空且必须小于10个汉字；<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 备注可不填但不能超过30个汉字；<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 当账本权限为共享时，被邀请的用户昵称不能为空且必须小于10个汉字。
          </div>
        </div>
        <div class="right-bottom">
          <!-- 添加账本 -->
          <el-tooltip effect="light" content="添加账本" placement="bottom-start" v-if="isShowUpdateBook==0">
            <el-button type="primary" size="small" circle @click="addBook">
              <i class="el-icon-check"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="保存账本" placement="bottom-start" v-else>
            <el-button type="primary" size="small" circle @click="updateBookData">
              <i class="el-icon-check"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="清空内容" placement="bottom-start">
            <el-button type="primary" size="small" circle @click="updateInput">
              <i class="el-icon-delete"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </el-card>
    <el-card class="box-card3" v-else>
      <span style="text-align:center;font-size:24px;" v-if="isShowAddRecord==0">账单信息</span>
      <span style="text-align:center;font-size:24px;" v-else>添加账单</span>
      <vue-scroll :ops="ops" style="width:100%;height:410px;margin:20px 0 0 0"> 
      <div class="bookapp">
      <el-form ref="form" :model="form"  style="text-align:left" label-width="42px">
            <el-form-item label="金额">
              <el-input v-model="form.money" size="small" suffix-icon="el-icon-edit" label="money" style="width:180px;float:left" 
                placeholder="请输入数字" maxlength="9" show-word-limit></el-input>
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
              size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" maxlength="5" show-word-limit
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
            style="margin-right: 5px" effect="plain" v-if="isShowAddRecord==0" >
            {{tag}}
          </el-tag>
          <el-radio-group disabled size="small" v-if="isShowAddRecord==1">
            <el-radio-button v-model="form.book">{{books[bookIndex].name}}</el-radio-button>
          </el-radio-group>
          <el-select v-if="selectVisible&&isShowAddRecord==0" v-model="selectValue" placeholder="请选择账本" ref="saveTagSelect" 
            size="small" @keyup.enter.native="handleSelectConfirm" @change="handleSelectConfirm" >
            <el-option v-for="item in form.booksTags" :key="item" :value="item"></el-option>
          </el-select>
          <el-button v-if="!selectVisible&&isShowAddRecord==0" class="button-new-tag" size="small" @click="showSelect" style="margin:5px 5px 5px 0">+ 添加至其他账本
          </el-button>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0"  SIZE=1/>
        <el-form-item label="备注" size="small" style="position:relative;top:8px;">
          <el-input v-model="form.remark" suffix-icon="el-icon-edit"  placeholder="请输入内容"  maxlength="18" show-word-limit
            style="width:320px"></el-input>
        </el-form-item>
<hr style="border-style:dashed;color:#C0C0C0;position:relative;top:15px;"  SIZE=1/>
      </el-form>
      </div> </vue-scroll><span style="position:relative;top:20px">
      <!-- <span>{{form.money}}、{{form.typeRadio}}、{{form.bookLabel}}、{{form.bookData}}、{{form.remark}}、{{form.bookTags}}</span> -->
      <el-tooltip effect="light" content="保存修改" placement="bottom-start" v-if="isShowAddRecord==0">
        <el-button type="primary" size="small" circle  @click="updateRecord">
          <i class="el-icon-check"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="添加账单" placement="bottom-start" v-else>
        <el-button type="primary" size="small" circle  @click="addRecord">
          <i class="el-icon-check"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="清空内容" placement="bottom-start">
        <el-button type="primary" size="small" circle @click="updateInput2">
          <i class="el-icon-delete"></i>
        </el-button>
      </el-tooltip>
      </span>
      </el-card>

      <el-dialog
        title="我的邀请记录"
        :visible.sync="inviteVisible"
        width="34%"
        center>
        <div style="max-height: 400px;overflow:auto;">
          <el-card shadow="hover" v-for="item in inviteRecord" :key="item.id" style="margin-bottom: 12px;">
            <el-button size="mini" style="padding:4px 4px 4px 4px;float: right;" >
              {{item.date}}
            </el-button>    
            <div style="font-size:1.2rem;max-width: 48%;position:relative;top:-2px;
            overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.bookname}}</div>  
            <div style="font-size:12px;color:#686868;margin-top: 3px;" v-if="item.remark">
              备注：{{item.remark}}
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==1">
              <el-tag size="small" type="success" style="margin-right:6px;" effect="dark">邀请中</el-tag>
              <!-- <el-button type="warning" size="small" style="padding: 5px 12px;" @click="deleteInvite(item.id)">撤回邀请</el-button> -->
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==2">
              <el-tag size="small" effect="dark" >用户已接受</el-tag>
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==3">
              <el-tag size="small" type="danger" effect="dark">用户已拒绝</el-tag>
            </div>
            <el-tag size="small" style="margin-top:8px;" >受邀人：{{item.username}}</el-tag>
          </el-card>
        </div>
      </el-dialog>

      <el-dialog
        title="我的受邀消息"
        :visible.sync="invitedVisible"
        width="34%"
        center>
        <div style="max-height: 400px;overflow:auto;margin-bottom: 14px;" >
          <el-card shadow="hover" v-for="item in invitedRecord" :key="item.id" style="margin-bottom: 12px;position: relative;">
            <el-badge  value="new" style="position: absolute;right: -5px;top:-5px" v-if="item.status==1"></el-badge>
            <el-button size="mini" style="padding:4px 4px 4px 4px;float: right;">
              {{item.date}}
            </el-button>    
            <div style="font-size:1.2rem;max-width: 48%;position:relative;top:-2px;
            overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.bookname}}</div>  
            <div style="font-size:12px;color:#686868;margin-top: 3px;" v-if="item.remark">
              备注：{{item.remark}}
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==1">
              <el-button type="primary" size="small" style="padding: 5px 12px;" @click="updateInvite(item.id,2)">接受邀请</el-button>
              <el-button type="warning" size="small" style="padding: 5px 12px;" @click="updateInvite(item.id,3)">拒绝邀请</el-button>
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==2">
              <el-button type="success" size="small" style="padding: 5px 12px;">已接受</el-button>
            </div>
            <div style="float:right;margin-top: 7px;" v-if="item.status==3">
              <el-button type="danger" size="small" style="padding: 5px 12px;">已拒绝</el-button>
            </div>
            <el-tag size="small" style="margin-top:8px;" >邀请人：{{item.username}}</el-tag>
          </el-card>
        </div>
      </el-dialog>
      <el-dialog
        :title="bookInviteName"
        :visible.sync="bookInviteVisible"
        width="30%"
        center>
      <div style="max-height: 350px;overflow:auto;margin-bottom: 14px;" >
        <el-card shadow="hover" v-for="item in bookInviteRecord" :key="item.id" style="margin-bottom: 12px;position: relative;">
          <el-button size="mini" style="padding:4px 4px 4px 4px;float: right;">
            {{item.date}}
          </el-button>    
          <div style="font-size:1.2rem;max-width: 48%;position:relative;top:-3px;
            overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              <el-tag size="small" type="success">邀请人：{{item.username1}}</el-tag>
          </div>  
          <div style="float:right;margin-top: 7px;" v-if="item.status==1">
            <el-button type="success" size="small" style="padding: 5px 12px;">邀请中</el-button>
          </div>
          <div style="float:right;margin-top: 7px;" v-if="item.status==2">
            <el-button type="success" size="small" style="padding: 5px 12px;">已接受</el-button>
          </div>
          <div style="float:right;margin-top: 7px;" v-if="item.status==3">
            <el-button type="danger" size="small" style="padding: 5px 12px;">已拒绝</el-button>
          </div>
          <el-tag size="small" style="margin-top:8px;" >受邀人：{{item.username2}}</el-tag>
        </el-card>
      </div>
    </el-dialog>
    <el-dialog
        title="添加协作人"
        :visible.sync="addInviteVisible"
        width="30%"
        center>
        <el-button type="success" style="padding: 6px 12px;float: right;margin-right: 15px;margin-top: 2px;"
          @click="addInviteRecord">邀请</el-button>
        <el-input v-model="addInviteName" size="small" suffix-icon="el-icon-edit" maxlength="10" show-word-limit
            style="width:300px;margin-left: 10px;" placeholder="请输入用户昵称"></el-input>
    </el-dialog>
    <el-dialog
      title="选择账本"
      :visible.sync="bookChangeVisible"
      width="40%"
      center>
      <div style="font-size:1.0rem;">月账本</div>  
      <hr style="border-style:dashed;color:#C0C0C0" SIZE=1 />
      <div style="max-height:80px;overflow: auto;">
        <el-tag size='small' style="margin:5px 5px 0 0;cursor: pointer;" v-for="(item,i) in books" :key="item.id"
          v-if="item.isMonthly==1" @click="setActiveItem(i);bookChangeVisible=false">{{item.name}}</el-tag>
      </div>
      <div style="font-size:1.0rem;margin-top: 14px;">私人账本</div>  
      <hr style="border-style:dashed;color:#C0C0C0" SIZE=1 />
      <div style="max-height:100px;overflow: auto;">
        <el-tag size='small' style="margin:5px 5px 0 0;cursor: pointer;" v-for="(item,i) in books" :key="item.id"
        v-if="item.isMonthly==0&&item.isPrivate==1" @click="setActiveItem(i);bookChangeVisible=false">{{item.name}}</el-tag>
      </div>
      <div style="font-size:1.0rem;margin-top: 14px;">共享账本</div>  
      <hr style="border-style:dashed;color:#C0C0C0" SIZE=1 />
      <div style="max-height:60px;overflow: auto;">
        <el-tag size='small' style="margin:5px 5px 0 0;cursor: pointer;" v-for="(item,i) in books" :key="item.id"
        v-if="item.isPrivate==0&&item.username==username" @click="setActiveItem(i);bookChangeVisible=false">{{item.name}}</el-tag>
      </div>
      <div style="font-size:1.0rem;margin-top: 14px;">协作账本</div>  
      <hr style="border-style:dashed;color:#C0C0C0" SIZE=1 />
      <div style="max-height:60px;overflow: auto;">
        <el-tag size='small' style="margin:5px 5px 0 0;cursor: pointer;" v-for="(item,i) in books" :key="item.id"
        v-if="item.isPrivate==0&&item.username!=username" @click="setActiveItem(i);bookChangeVisible=false">{{item.name}}</el-tag>
      </div>
    </el-dialog>


   <div class="step-box" v-if="step>0">
      <div id="mainapp" style="background: transparent;padding: 3%;border: none;position: relative;">
        
        <div style="flex: 1;border: 1px solid pink;margin: 1% 2% 2.5% 2.5%;position: relative;color: pink;" 
        v-bind:style="{'visibility': step>5?'visible':'hidden'}">
          <div style="font-size: 1.5rem;font-weight: bold;position: absolute;left:4%;top:6%;white-space: nowrap;">
            <i class="el-icon-info" style="margin-right: 2%;"></i>在这里可以查看和筛选账本
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:10%;top:15%;white-space: nowrap;width: 80%;white-space:pre-wrap;" >
            <i class="el-icon-warning-outline" style="margin-right: 2%;"></i>共享账本：共享者同时只能邀请一名用户，且成功共享后不可更改协作者<br/>
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:10%;top:26%;white-space: nowrap;width: 80%;white-space:pre-wrap;" >
            <i class="el-icon-warning-outline" style="margin-right: 2%;"></i>协作者只能向账本内添加账单，不能对账本内的账单进行修改和删除操作<br/>
            <br/><el-button type="danger" style="margin-top: 8%;" plain  @click="updateStep(0,0)">留在此页</el-button>
            <el-button type="danger" style="margin-top: 8%;"   @click="updateStep(0,0);changeToBooking()">去记账</el-button>
          </div>
        </div>
        <div style="flex: 1;border: 1px solid pink;;margin: 1% 2.5% 2.5% 1.5%;color: pink;position: relative;"
          v-bind:style="{'visibility': step!=6? 'visible':'hidden' }">
          <div style="font-size: 1.5rem;font-weight: bold;position: absolute;right: -12%;top:4%;white-space: nowrap;">
            <i class="el-icon-info" style="margin-right: 2%;"></i>在这里可以添加账本
            <br/><el-button type="danger" style="margin-top: 8%;" plain v-if="step==1" @click="changeStep(2)">开启手账本之旅</el-button>
            <el-popconfirm
                   confirm-button-text='本次跳过，下次再弹出'
                        cancel-button-text='忽略，以后不再弹出'
                        title="请选择跳过方式："
                        @confirm="updateStep(2,0)"
                        @cancel="updateStep(0,0)"
                        icon-color="pink"
                        v-if="step==1"
                  >
              <el-button type="success" slot="reference" style="margin-top: 8%;margin-left: 5%;" plain  size="mini" >跳过</el-button>
            </el-popconfirm>
            
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:35%;top:15%;white-space: nowrap;" v-if="step==2">
            <i class="el-icon-back" style="margin-right: 2%;"></i>输入账本名称，如海边之旅，<br/>长度限制在10个字符
            <br/><el-button type="danger" size="mini" style="margin-top: 6%;" plain @click="changeStep(3)">下一步</el-button>
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:35%;top:26%;white-space: nowrap;" v-if="step==3">
            <i class="el-icon-back" style="margin-right: 2%;"></i>选择账本类型，选中后不可修改
            <br/><el-button type="danger" size="mini" style="margin-top: 6%;" plain @click="changeStep(4)">下一步</el-button>
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:30%;top:36%;white-space: nowrap;" v-if="step==4">
            <i class="el-icon-back" style="margin-right: 2%;"></i>输入备注，长度限制在30个字符，<br/>可不填
            <br/><el-button type="danger" size="mini" style="margin-top: 6%;" plain @click="changeStep(5);book.isprivate='共享'">下一步</el-button>
          </div>
          <div style="font-size: 1.2rem;position: absolute;left:30%;top:48%;white-space: nowrap;" v-if="step==5">
            <i class="el-icon-back" style="margin-right: 2%;"></i>共享账本：创建时必须输入协作用户的昵称
            <br/><el-button type="danger" size="mini" style="margin-top: 6%;" plain @click="changeStep(6)">下一步</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import Navigation from './Navigation.vue'
export default {
  components: { Navigation},
  data() {
      return {
        userid:sessionStorage.getItem('userid'),
        username:sessionStorage.getItem('username'),
        isShowAddBook:0,   //是否显示添加账本界面
        isShowUpdateBook:0,
        isShowAddRecord:0,
        isIncomeType:'1', //显示收入还是支出
        labelType:'全部',
        labels:[''],
        bookIndex:0,
        recordIndex:0,
        step:0,

        inviteVisible:false,
        invitedVisible:false,
        bookInviteVisible:false,
        addInviteVisible:false,
        bookChangeVisible:false,
        bookInviteName:'',
        addInviteName:'',
        invitedRecord:[
          {
            id:0,
            bookname:'',
            remark:'',
            date:'',
            username:'',
            status:1,
          },
        ],
        inviteRecord:[
          {
            id:1,
            bookname:'',
            remark:'',
            date:'',
            username:'',
            status:1,
          },
        ],
        bookInviteRecord:[
          {
            id:0,
            username1:'',
            username2:'',
            date:'',
            status:0,
          },
        ],

        books:[
            {
            id:0,
            name:'',
            isPrivate:1,
            description:'',
            username:'',
            username2:'',
            isMonthly:0,
            time:'',
            lasttime:'',
          },
        ],
        book:{
          name:'',
          isprivate:'个人',
          remark:'',
          username:'',
        },
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

        inputVisible: false,
        selectVisible: false,
        inputValue: '',
        selectValue: '',
        selectLabelVisible:false,
        selectLabelValue:'',
        
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
  computed: {
    totalMoney: function () {
            let money=0;
            for(let i=0;i<this.mybook.length;i++){
              if(this.mybook[i].isIncome=="支"){
                money+=this.mybook[i].money;
              }
            }
            return money.toFixed(2);
    },
    isPrivate:function(){
      return this.book.isprivate=='共享'? true:false;
    },
    invitedMessageCount(){
      let i=0;
      this.invitedRecord.forEach(item=>{
        if(item.status==1)
          i++;
      })
      return i;
    }
  },
  mounted(){
			this.getAllInfo();//在html加载完成后进行，相当于在页面上同步显示后端数据
      this.getAllBooks();
      this.getAllInvite();
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
    shareBook(bookid){
      const mydata = {
        bookid:bookid,
        userid:this.userid
      }
        this.axios({
            method: 'post',
            url: '/api/share/isShared/',
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
                    bookid:bookid,
                    userid:this.userid,
                    content: value,
                  }
                  this.axios({
                    method: 'post',
                    url: '/api/share/add/',
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
     updateInput(){
       this.book.name='';
       this.book.isprivate='个人';
       this.book.remark='';
       this.book.username='';
     },
     showBookInviteRecord(id,name){ 
        const mydata = {
            bookid:id,
        }
        this.axios({
            method: 'post',
            url: '/api/invite/getByBook/',
            data: Qs.stringify(mydata)
            })
        .then( res => {
            this.bookInviteRecord=res.data;
            if(this.bookInviteRecord.length<1){
              this.showMessage("暂无邀请记录！");
            }
            else{  
              this.bookInviteName=name+' - 邀请记录';
              this.bookInviteVisible=true;
            }
           
        })
     },
     getAllInfo(){
      this.step=sessionStorage.getItem('userstep')==2? 1:0;
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
      },
      // 加载所有账本信息
      getAllBooks(){
        const mydata = {
        	username: this.username,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/book/getAllBooks/',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.books=res.data;
          if(this.books.length>0)
            this.getRecordByBook(0);
				})
      },
      //获取所有邀请信息
      getAllInvite(){
        const mydata = {
        	userid:this.userid,
          type:1
      	}
        this.axios({
        	method: 'post',
        	url: '/api/invite/getByUser/',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.inviteRecord=res.data;
				})
        const mydata2 = {
        	userid:this.userid,
          type:2
      	}
        this.axios({
        	method: 'post',
        	url: '/api/invite/getByUser/',
          data: Qs.stringify(mydata2)
      	  })
				.then( res => {
          this.invitedRecord=res.data;
				})
      },
      updateInput2(){
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
      },
     addBook(){
        if(this.book.name==""||this.book.name==null||this.book.name==undefined){
          this.showMessage("账本名称不能为空！");
          return;
        }
        if(this.isPrivate&&(this.book.username==""||this.book.username==null||this.book.username==undefined)){
          this.showMessage("请输入被邀请人昵称！");
          return;
        }
        if(this.book.username==this.username){
          this.showMessage("不能邀请自己！");
          return;
        }
        const mydata = {
        	userid: this.userid*1,
          name:this.book.name,
          isprivate:this.isPrivate?0:1,
          description:this.book.remark,
          username:this.book.username,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/book/addBook',
          data: Qs.stringify(mydata)
      	})
				.then( res => {
          if(res.data=='0'){
            this.showMessage('账本名称不能重复！请重新输入！');   
          }
          else if(res.data=="-1"){
            this.showMessage('用户昵称不存在！请重新输入！');
          }
          else{
            this.updateInput();
            this.form.booksTags.push(this.book.name);
            setTimeout(()=>{
              this.getAllBooks();
            },500) 
            this.showMessage('添加成功！',1);
          }
				})
     },
     addInvite(id){
        this.addInviteName='';
        const mydata = {
            bookid:id,
        }
        this.axios({
            method: 'post',
            url: '/api/invite/getByBook/',
            data: Qs.stringify(mydata)
            })
        .then( res => {
            this.bookInviteRecord=res.data
            if(this.bookInviteRecord.length>0){
              for(let i=0;i<this.bookInviteRecord.length;i++){
                if(this.bookInviteRecord[i].status==1){
                  this.showMessage("已邀请用户，请等待用户回应！");
                  return;
                }
                if(this.bookInviteRecord[i].status==2){
                  this.showMessage("已拥有协作者，请勿重复邀请！");
                  return;
                }
              }
            }
            this.addInviteVisible=true;
        })
        
     },
     addInviteRecord(){
        if(this.addInviteName==''||this.addInviteName==null||this.addInviteName==undefined){
          this.showMessage("请输入用户昵称！");
          return;
        }
        if(username==this.addInviteName){
          this.showMessage("不能邀请自己！");
          return;
        }
        const mydata = {
        	bookid: this.books[bookIndex].id,
          username:this.addInviteName,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/invite/add/',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          if(res.data=="-1"){
            this.showMessage("输入的用户昵称不存在！请重新输入！");
          }
          else{
            this.showMessage("邀请成功！");
            this.getAllInvite();
          }
				})
     },
     showAddRecord(){
      this.updateInput2();
      this.isShowAddBook=1;
      this.isShowAddRecord=1;
     },
     getRecordByBook(index){
        this.bookIndex=index;
        const mydata = {
        	bookid: this.books[index].id,
          incomeType:this.isIncomeType*1,
          labelName:this.labelType,
      	}
        this.axios({
        	method: 'post',
        	url: '/api/record/getAllRecordByBook/',
          data: Qs.stringify(mydata)
      	  })
				.then( res => {
          this.mybook=res.data;
				})
     },
     deleteRecord(recordId,bookIndex){
       let bookid=0;
       if(bookIndex!=-1)
        bookid=this.books[bookIndex].id;
        const mydata = {
        	recordId: recordId,
          bookId:bookid
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
     changeToSomeBill(recordId){
        this.isShowAddBook=recordId;
        this.isShowUpdateBook=0;
        this.isShowAddRecord=0;
        this.updateInput2();
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
                  j--;
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

      changeStep(val){
        this.step=val;
      },

      updateStep(val,val2){
        this.changeStep(0);
        const mydata = {
        	  username: this.username,
            step:val
      	}
        this.axios({
        	    method: 'post',
        	    url: '/api/user/update/step/',
              data: Qs.stringify(mydata)
      	})
        sessionStorage.setItem('userstep',val2);
        if(val2==2){
          this.$emit("changeComponent1Data", "bills",true);
        }
      },
      updateRecord(){
        let regs=/^(\d+)(\.\d+)?$/;
        let newBooks=this.form.bookTags.concat();
        newBooks.push(this.form.bookData.substring(0,4)+"年"+this.form.bookData.substring(5,7)+"月账本");
        if(this.form.money&&regs.test(this.form.money)){
          const mydata = {
            recordid:this.isShowAddBook,
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
              this.getRecordByBook(this.bookIndex);
              this.showMessage("修改成功！",1);
				  })
          
        }
        else{
          this.showMessage("请输入浮点类型的金额数字！");
        }
      },
      showInviteVisible(val){
        if(val==1){
          if(this.inviteRecord.length<1){
            this.showMessage("暂无邀请记录！");
          }
          else{
            this.inviteVisible=true;
          }
        }
        else{
          if(this.invitedRecord.length<1){
            this.showMessage("暂无受邀记录！");
          }
          else{
            this.invitedVisible=true;
          }
        }
      },
      setActiveItem(index){
        this.$refs.carousel.setActiveItem(index);
      },
      setActiveItem2(val){
        for(let i=0;i<this.books.length;i++){
          if(this.books[i].name==val){
            this.setActiveItem(i);
            return;
          }
        }
      },
      updateBook(id){
        this.isShowUpdateBook=id;
        this.isShowAddBook=0;
        for(let i=0;i<this.books.length;i++){
          if(this.books[i].id==id){
            this.book.name=this.books[i].name;
            this.book.remark=this.books[i].description;
            this.book.isprivate=this.books[i].isPrivate==1?"个人":"共享";
            this.book.username=this.books[i].username;
            break;
          }
        }
      },
      updateInvite(id,status){
        const mydata = {
            id:id,
            status:status,
      	}
        this.axios({
            method: 'post',
        	  url: '/api/invite/update/',
            data: Qs.stringify(mydata)
      	})
				.then( res => {
            this.showMessage("处理完成！",1);
            for(let i=0;i<this.invitedRecord.length;i++){
              if(this.invitedRecord[i].id==id)
                this.invitedRecord[i].status=status;
            }
				})
      },
      changeToBooking(){
        this.$emit("changeComponent1Data", "booking",true);
      },
      addRecord(){
        let regs=/^(\d+)(\.\d+)?$/;
        let bookTags=[this.books[this.bookIndex].name];
        let isprivate=1;
        if(this.books[this.bookIndex].username!=this.username)
          isprivate=0;
        if(this.form.money&&regs.test(this.form.money)){
          const mydata = {
        	  userid: sessionStorage.getItem('userid')*1,
            money: this.form.money+'',//金额    
            isincome: this.form.typeRadio,  //支出/收入
            date:this.form.bookData+'', //日期
            booklabel:this.form.bookLabel, //选定标签
            remark:this.form.remark, //备注
            books: bookTags+'',//已添加的自定义账本集
            isprivate:isprivate,
      	  }
          
          this.axios({
            method: 'post',
        	  url: '/api/record/addRecord/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {
              this.showMessage("添加成功！",1);
              this.updateInput2();
              this.getRecordByBook(this.bookIndex);
				  })
          
        }
        else{
          this.showMessage("请输入浮点类型的金额数字！");
        }
      },
      updateBookData(){
        const mydata = {
            id:this.isShowUpdateBook,
            name:this.book.name,
            remark:this.book.remark,
      	}
          this.axios({
            method: 'post',
        	  url: '/api/book/updateBook/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {
            if(res.data=="0"){
              this.showMessage("账本名称不能重复！请重新输入！");
            }
            else{
              for(let i=0;i<this.books.length;i++){
                if(this.books[i].id==this.isShowUpdateBook){
                  
                  let index=this.form.booksTags.indexOf(this.books[i].name);
                  if(index>=0){
                     this.form.booksTags.splice(index,1);
                     this.form.booksTags.push(this.book.name);
                   }
                   index=this.form.bookTags.indexOf(this.books[i].name)
                   if(index>=0){
                     this.form.bookTags.splice(index,1);
                     this.form.bookTags.push(this.book.name);
                   }

                  this.books[i].name=this.book.name;
                  this.books[i].description=this.book.remark;
                  break;
                }
              }
              this.getRecordByBook(this.bookIndex);
              this.showMessage("修改成功！",1);
            }
				  })
      },
      deleteBook(id){
        this.$confirm('删除账本的同时将删除相关的分享，确定删除该账本吗？', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const mydata = {
            bookid:id,
      	  }
          this.axios({
            method: 'post',
        	  url: '/api/book/deleteBook/',
            data: Qs.stringify(mydata)
      	  })
				  .then( res => {})
          this.showMessage("删除成功",1);
          this.getAllBooks();
        }).catch(() => {
          this.showMessage("取消删除！");    
        });
      },

      handleClose(tag) {
        this.form.bookTags.splice(this.form.bookTags.indexOf(tag), 1);
        this.form.booksTags.push(tag);
      },

      showInput() {
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
        let l=0;
        for(let i=0;i<inputValue.length;i++){
          if(inputValue.charCodeAt(i)>=0&&inputValue.charCodeAt(i)<=128){
            l+=1;
          }else{
            l+=2;
          }
        }
        if(l>10){
          this.showMessage("标签长度不能大于5个汉字！");
          return;
        }
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
    position: relative;
    
  }

.right-main{
  padding: .5em 1em;
}
.el-form-item{
  margin: 0;
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

.invite-btn{
  border: 1px solid pink;
  background-color: white;
  border-radius: 50%;
  width: 5%;
  height: 8.3%;
  position: absolute;
  top: 6%;
  z-index: 1;
  font-size: .9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: pink;
  cursor: pointer;
}

.invite-btn2{
  top:15%;
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
    background:#ffe7ea;
    font-size: 2rem;
    padding: 1% .5% 0 .5%;
    box-sizing: border-box;
  }

  .box-card3 {
    margin: 18px 10px 18px 15px;
    width: 460px;
    height: 560px;
    opacity: 0.9;
    overflow:auto;
    background:#ffe7ea;
    font-size: 1rem;
    padding: 0 2%;
    box-sizing: border-box;
  }

.bill-box{
  transition: 1.5s;
}
  .bill-box:hover{
    background:#ffeff5;
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

  .step-box{
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 2;
}

::-webkit-scrollbar { display: none; }
</style>