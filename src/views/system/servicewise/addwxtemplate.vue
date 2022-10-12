<template>
  <div class="div-check">
    <div class="div-part">
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">公众号 :</span>
          <a-select v-model="checkData.gzh" allow-clear placeholder="请选择">
            <a-select-option v-for="(item, index) in wxgzhData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </div>
        <div class="div-right">
          <span class="span-item-name">模板ID :</span>
          <a-select v-model="checkData.gzh" allow-clear placeholder="请选择">
            <a-select-option v-for="(item, index) in wxgzhData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
          <a-button  type="primary" @click="selectTeachBtn" style="margin-left: 3%"> 读取模板信息 </a-button>
        </div>
      </div>
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">内部编码 :</span>
          <a-input
            v-model="checkData.mbid"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内部编码 "
          />
        </div>
        <div class="div-right">
          <span class="span-item-name">模板标题 :</span>
          <a-input
            v-model="checkData.mbid"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入模板标题 "
          />
        </div>
      </div>
      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">模板内容 :</span>
          <a-textarea
            v-model="checkData.brief"
            class="span-item-value"
            style="height: 150px; width: 900px; display: inline-block"
            allow-clear
            placeholder="请输入模板内容 "
          />
        </div>
      </div>

      <div class="div-line-wrap"  v-for="(item, index) in fieldList" :key="index" :value="item">
        <div class="div-left" style="width: 15%; margin-left: 10%;margin-top: 3.5%;">
          <span class="span-item-name" style="width: 100%;">模板参数{{index+1}} :[{{item.name}}]</span>
        </div>
        <div class="div-left" style="width: 25%;">
          <span class="span-item-name" style="width: 30%;">匹配字段 :</span>
          <a-select v-model="fieldList[index].property" allow-clear placeholder="请选择字段属性" >
            <a-select-option v-for="(item, index) in zdsxData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </div>
        <div class="div-left" style="width: 50%;">
          
          <a-select v-show="item.property === '档案字段'" v-model="fieldList[index].content" allow-clear placeholder="请选择参数">
            <a-select-option v-for="(item, index) in zdsxData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>

          <a-input  v-show="item.property === '自定义传参'"
            v-model="checkData.mbid"
            class="span-item-value"
            style="width: 90%;display: inline-block"
            allow-clear
            placeholder="请输入参数,不超过150字 "
          />
        </div>
      </div>
     
      <div class="div-line-wrap" style="margin-top: 3%">
        <div class="div-total-one">
          <span class="span-item-name"> 模板跳转内容 :</span>

          <a-radio-group
            name="radioGroup"
            style="width: 900px; margin-left: 0%"
            :default-value="radioTyPe"
            @change="radioChange"
          >
            <a-radio :value="0"> 问卷 </a-radio>
            <a-radio :value="1" style="margin-left: 52px"> 宣教 </a-radio>
            <a-radio :value="2" style="margin-left: 52px"> 不跳转任何内容 </a-radio>
            <a-radio :value="3" style="margin-left: 52px"> 跳转外网地址 </a-radio>
          </a-radio-group>
        </div>
      </div>

      <div class="div-line-wrap" v-show="radioTyPe === 0"  >
        <div class="div-total-one">
          <span class="span-item-name">问卷名称 :</span>
          <a-input
            v-model="questionContent.name"
            class="span-item-value"
            style="display: inline-block"
            allow-clear           
            placeholder="请选择问卷 "
          />
          <a-button  type="primary" @click="selectQestionBtn" style="margin-left: 3%"> 选择 </a-button>
        </div>      
      </div>
      <div class="div-line-wrap" v-show="radioTyPe === 1"  >
        <div class="div-total-one">
          <span class="span-item-name">宣教名称 :</span>
          <a-input
            v-model="teachContent.title"
            class="span-item-value"
            style="display: inline-block"
            allow-clear           
            placeholder="请选择宣教文章 "
          />
          <a-button  type="primary" @click="selectTeachBtn" style="margin-left: 3%"> 选择 </a-button>
        </div>      
      </div>
      <div class="div-line-wrap" v-show="radioTyPe === 3"  >
        <div class="div-total-one">
          <span class="span-item-name">第三方链接 :</span>
          <a-input
            v-model="checkData.mbid"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入第三方链接 "
          />
        </div>      
      </div>
    </div>

    <div style="margin-top: 60px">
      <a-button size="large" type="primary" @click="goConfirm" style="width: 20%; margin-left: 47%"> 保存 </a-button>
    </div>
    <div style="height: 50px; backgroud-color: white" />


    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-teach ref="addTeach" @ok="handleTeach" />
  </div>
  
</template>


<script type="text/javascript">

import { saveArticle, getArticleById, getDepts, getDiseases } from '@/api/modular/system/posManage'
import addQuestion from '../package/addQuestion'
import addTeach from '../package/addTeach'

export default {
  components: { addQuestion, addTeach},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      radioTyPe: 0,
      checkData: {
        title: '',
        brief: '', //描述
        categoryName: '', //科室名称
        categoryId: '', //科室代码
        articleType: '', //专病
        content: '', //内容

      },
      questionContent:{name:''},
      teachContent:{title:''},
     

      wxgzhData: ['健康管家', '湘雅二医院病友服务中心'], //公众号
      zdsxData:['档案字段','自定义传参'],//字段属性
      fieldList:[
      {
        name:'first',property:'请选择',content:''
      },{
        name:'ketword1',property:'请选择',content:''
      }
      ],//字段列表
      navigateListData:[],
     
    }
  },

  created() {
    
    getDepts().then((res) => {
      if (res.code == 0) {
        this.ksTypeData = res.data
        this.ksTypeDataTemp = JSON.parse(JSON.stringify(this.ksTypeData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    handleChange(code) {
      
    },

  
    //字段属性选择
    fieldSXChange(value){
      console.log(value)
      this.fieldList[value]
     
    },
    radioChange(e) {
      this.radioTyPe = e.target.value
      console.log(this.radioTyPe)
    },
    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.ksTypeDataTemp = this.ksTypeData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.ksTypeDataTemp = JSON.parse(JSON.stringify(this.ksTypeData))
      }
    },

    selectQestionBtn(){
      this.$refs.addQuestion.add(0)
    },
    selectTeachBtn(){
      this.$refs.addTeach.add(0, '')
    },
    handleQuestion(index, record) {
      console.log(record)
      this.questionContent=record
    },

    handleTeach(index, record) {
      console.log(record)
      this.teachContent=record
    },

    goConfirm() {
      console.log(this.checkData)
      if (!this.checkData.title) {
        this.$message.error('请填写标题')
        return
      }
      if (!this.checkData.brief) {
        this.$message.error('请填写描述')
        return
      }
      if (!this.checkData.categoryId) {
        this.$message.error('请选择科室')
        return
      }
      if (!this.checkData.articleType) {
        this.$message.error('请选择专病')
        return
      }
      if (!this.checkData.content) {
        this.$message.error('请编辑内容')
        return
      }

    
    },

    goBack() {
      window.history.back()
    },

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },

 

    onChange() {},

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
  
}
</script>

<style lang="less">
.ant-select-dropdown {
  z-index: 20000;
}

/deep/ .ant-select-dropdown {
  width: 300px !important;
}
/deep/ .global-search {
  width: 300px !important;
}

.div-check {
  background-color: white;
  padding: 0 15% 0 5%;
  // padding: 0 15%;

  .top-btn {
    margin-left: 47%;
    float: right;
    margin-top: 20px;
  }

  .div-divider {
    margin-top: 3%;
    margin-left: 10%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
  .div-part {
    width: 100%;
    height: 100%;

    // border-bottom: 1px solid #e6e6e6;
    background-color: white;
    overflow: hidden;
    padding: 1.5%;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-select {
      width: 42% !important;
      margin-left: 0% !important;
    }

    .ant-input {
      margin-left: 2% !important;
    }

    .ant-calendar-picker {
      margin-left: 3.5%;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;

      .div-left {
        float: left;
        width: 50%;
        margin-top: 3%;
        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
          width: 20%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          text-align: left;
          padding-left: 0px;
          font-size: 14px;
          display: inline-block;
        }
        .ant-select {
          width: 45% !important;
          margin-left: 6px !important;
        }
      }
      

      .div-right {
        margin-top: 3%;
        width: 50%;
        float: right;
        overflow: hidden;
        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 14px;
          width: 20%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
        
          text-align: left;
          display: inline-block;
        }
        .ant-select {
          width: 45% !important;
          margin-left: 6px !important;
        }
      }

      .div-total-one {
        margin-top: 3%;
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 14px;
          width: 10%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
          padding-left: 0px;
          text-align: left;
          display: inline-block;
        }

        .ant-input {
          margin-left: 0.5% !important;
        }

        .ant-select {
          width: 45% !important;
          margin-left: 0% !important;
        }
      }

  
    }
  }
}
</style>
