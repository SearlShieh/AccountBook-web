<template>
    <div>hhhhh</div>
<!-- 账单列表 -->
  <!-- <vue-scroll :ops="ops" style="width:98%;height:400px;margin:9% 1% 0 1%"> 
    <div class="bookapp2">
      <div  v-for="item in mybook" :key="item" class="bill-box" >
        <hr style="border-style:dashed;color:#C0C0C0;margin:0px 0 8px 0 ; clear:both"  SIZE=1/>
        <div>
          <i class="el-icon-coin"></i>
          <span style="font-size:15px">{{item.money}}</span>
          <el-button :type="item.type=='支'? 'danger':'warning'" size="mini" circle 
            style="padding:4px 4px 4px 4px;position:relative;top:-2px;margin-right:5px">{{item.type}}
          </el-button>
          <el-tag effect="dark" size="mini" style="position:relative;top:-2px;" >
            {{item.label}}
          </el-tag>
          <el-button type="info" size="mini" 
            style="padding:4px 4px 4px 4px;position:relative;top:-2px;margin-right:5px">删除
          </el-button>
          <div style="font-size:12px;color:#686868;float: right;">
            消费日期：{{item.date}}
          </div>
        </div>
        <div style="width:98%;overflow: auto;height: 30px;margin-bottom: 3px;margin-top: 0;">
          <el-tag size='small' style="margin:5px 5px 0 0" v-for="item2 in item.books" :key="item2">{{item2}}</el-tag>
        </div>
        <div style="font-size:12px;color:#686868;" v-if="item.remark">
          备注：{{item.remark}}
        </div>
        <div style="font-size:12px;margin-bottom: 5px; color:#686868;">
          最后修改时间：{{item.lastdate}}
        </div>
      <div>
        </div>
      </div>
    </div>
  </vue-scroll> -->
</template>
  
<script>
export default{
    name:'Record',
    props:{

    },
  data(){
    mybook:[
          {
            money:100, //金额
            type2:'-',
            type: '支',  //支出/收入
            date:'2021-04-19', //日期
            label:'无', //标签
            books:['202104月账本','欣欣的账本','欣欣的账本','欣欣的账本','欣欣的账本'],//月账本
            remark:'今天天气真不错！',
            lastdate:'2022-03-11 12:20:55'
          },

          {
            money:100, //金额
            type2:'-',
            type: '收',  //支出/收入
            date:'2021-04-19', //日期
            label:'无', //标签
            books:['202104月账本','欣欣的账本','欣欣的账本','欣欣的账本','欣欣的账本'],//月账本
            remark:''
          },
        ]
  },
}
</script>
  
<style scoped>

</style>