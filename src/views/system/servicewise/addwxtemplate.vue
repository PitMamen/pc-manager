<template>
  <div class="div-check">
    <div class="div-part">
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">公众号 :</span>
          <a-select v-model="checkData.wxAppId" allow-clear placeholder="请选择" @change="onWXProgramChange">
            <a-select-option v-for="(item, index) in wxgzhData" :key="index" :value="item.wxAppId">{{
              item.wxPublicName
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-right">
          <span class="span-item-name">模板ID :</span>
          <a-select v-model="checkData.templateId" allow-clear placeholder="请选择" @change="onTemplateChange">
            <a-select-option v-for="(item, index) in templateData" :key="index" :value="item.templateId">{{
              item.title
            }}</a-select-option>
          </a-select>
          <!-- <a-button type="primary" @click="readTemplateInfoBtn" style="margin-left: 3%"> 读取模板信息 </a-button> -->
        </div>
      </div>
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">内部编码 :</span>
          <a-input
            v-model="templateContent.templateId"
            class="span-item-value"
            style="display: inline-block"
            readOnly
            allow-clear
            placeholder="请输入内部编码 "
          />
        </div>
        <div class="div-right">
          <span class="span-item-name">模板标题 :</span>
          <a-input
            v-model="checkData.templateTitle"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            type="text"
            maxlength="10"
            placeholder="请输入模板标题 "
          />
        </div>
      </div>
      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">模板内容 :</span>
          <a-textarea
            v-model="templateContent.content"
            class="span-item-value"
            readOnly
            style="height: 100px; width: 900px; display: inline-block"
            allow-clear
            placeholder="请输入模板内容 "
          />
        </div>
      </div>

      <div class="div-line-wrap" v-for="(item, index) in fieldList" :key="index" :value="item">
        <div class="div-left" style="width: 15%; margin-left: 10%; margin-top: 3.5%">
          <span class="span-item-name" style="width: 100%">模板参数{{ index + 1 }} :[{{ item.name }}]</span>
        </div>
        <div class="div-left" style="width: 25%">
          <span class="span-item-name" style="width: 30%">匹配字段 :</span>
          <a-select
            v-model="fieldList[index].property"
            allow-clear
            placeholder="请选择字段属性"
            @change="onFiledChange(index)"
          >
            <a-select-option v-for="(item, index) in zdsxData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </div>
        <div class="div-left" style="width: 50%">
          <a-select
            v-show="item.property === '档案字段'"
            v-model="fieldList[index].content"
            allow-clear
            placeholder="请选择参数"
          >
            <a-select-option v-for="(item, index) in dananfieldList" :key="index" :value="item.tableField">{{
              item.fieldComment
            }}</a-select-option>
          </a-select>

          <a-input
            v-show="item.property === '自定义传参'"
            v-model="fieldList[index].content"
            class="span-item-value"
            style="width: 90%; display: inline-block"
            allow-clear
            maxlength="10"
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
            v-model="radioTyPe"
            @change="radioChange"
          >
            <a-radio :value="0"> 问卷 </a-radio>
            <a-radio :value="1" style="margin-left: 52px"> 宣教 </a-radio>
            <a-radio :value="2" style="margin-left: 52px"> 不跳转任何内容 </a-radio>
            <a-radio :value="3" style="margin-left: 52px"> 跳转外网地址 </a-radio>
          </a-radio-group>
        </div>
      </div>

      <div class="div-line-wrap" v-show="radioTyPe === 0">
        <div class="div-total-one">
          <span class="span-item-name">问卷名称 :</span>
          <a-input
            v-model="questionContent.name"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请选择问卷 "
          />
          <a-button type="primary" @click="selectQestionBtn" style="margin-left: 3%"> 选择 </a-button>
        </div>
      </div>
      <div class="div-line-wrap" v-show="radioTyPe === 1">
        <div class="div-total-one">
          <span class="span-item-name">宣教名称 :</span>
          <a-input
            v-model="teachContent.title"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请选择宣教文章 "
          />
          <a-button type="primary" @click="selectTeachBtn" style="margin-left: 3%"> 选择 </a-button>
        </div>
      </div>
      <div class="div-line-wrap" v-show="radioTyPe === 3">
        <div class="div-total-one">
          <span class="span-item-name">第三方链接 :</span>
          <a-input
            v-model="checkData.navigatorContent"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入第三方链接 "
          />
        </div>
      </div>
    </div>

    <div style="margin-top: 60px">
      <a-button size="large" type="primary" @click="goConfirm" style="width: 20%; margin-left: 47%"> 确定 </a-button>
    </div>
    <div style="height: 50px; backgroud-color: white" />

    <add-question ref="addQuestion" @ok="handleQuestion" />
    <add-teach ref="addTeach" @ok="handleTeach" />
  </div>
</template>


<script type="text/javascript">
import {
  getTemplateWxMsg,
  getWxConfigureList,
  qryMetaConfigureDetail,
  addWxTemplate,
  getWxTemplateById,
} from '@/api/modular/system/posManage'
import addQuestion from '../package/addQuestion'
import addTeach from '../package/addTeach'

export default {
  components: { addQuestion, addTeach },

  data() {
    return {
      id: '', //业务模板详情ID 修改时才有值
      templateBean:'',//业务模板详情
      // 高级搜索 展开/关闭
      advanced: false,
      radioTyPe: 0,
      checkData: {
        wxAppId: '', //公众号ID
        templateId: '', //模板ID
        templateTitle: '', //模板標題
        navigatorType: '', //跳转类型
        navigatorContent: '', //跳转内容
      },
      templateContent: { templateId: '', title: '', primaryIndustry: '', deputyIndustry: '', content: '', example: '' },
      questionContent: { name: '' },
      teachContent: { title: '' },

      wxgzhData: [], //公众号列表
      templateData: [], //模板列表
      zdsxData: ['档案字段', '自定义传参'], //字段属性
      fieldList: [], //微信字段列表
      dananfieldList: [], //微信字段列表
      navigateListData: [],
    }
  },

  created() {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      //若有值，则查询详情
      this.id = this.$route.query.id

      getWxTemplateById(this.id).then((res) => {
        if (res.code == 0) {
          this.checkData=res.data
          this.templateContent.templateId=res.data.templateId
          this.templateContent.content=res.data.templateContent
          this.templateContent.templateId=res.data.templateId
        this.radioTyPe=res.data.jumpType-1
        console.log(this.radioTyPe)
         if (this.radioTyPe == 0) {
        
         this.questionContent.questUrl=res.data.jumpValue
         this.questionContent.name=res.data.jumpValue
      } else if (this.radioTyPe == 1) {
       
        this.teachContent.articleId=res.data.jumpValue
        this.teachContent.title=res.data.jumpValue
      } else if (this.radioTyPe == 3) {
      
        this.checkData.navigatorContent =res.data.jumpValue
      }

      this.fieldList=JSON.parse(res.data.templateParamJson)

        }
      })
    }else{
    //获取公众号列表
    getWxConfigureList({}).then((res) => {
      if (res.code == 0) {
        this.wxgzhData = res.data
      }
    })
    }

    //获取档案字段列表
    qryMetaConfigureDetail({ databaseTableName: 'tb_patient_baseinfo' }).then((res) => {
      if (res.code == 0) {
        this.dananfieldList = res.data[0].detail
      }
    })
  },

  methods: {
    handleChange(code) {},

    //选择公众号
    onWXProgramChange(value) {
      console.log(value)
      this.getTemplateWxMsg(value, '')
    },
    //获取模板列表或者单个
    getTemplateWxMsg(wxAppId, templateId) {
      getTemplateWxMsg({ templateId: templateId, wxAppId: wxAppId, wxPublicName: '', wxSecret: '' }).then((res) => {
        if (res.code == 0) {
          this.templateData = res.data
        }
      })
    },
    //选择模板
    onTemplateChange(value) {
      this.templateData.forEach((item) => {
        if (item.templateId === value) {
          this.templateContent = item
          this.fieldList = []
        }
      })
      console.log(this.templateContent)

      let text = this.templateContent.content
      let regex = /\{\{(.+?)\./g
      let result
      while ((result = regex.exec(text)) != null) {
        this.fieldList.push({
          name: result[1],
          property: '请选择',
          content: '',
        })
      }

      console.log(this.fieldList)
    },
    //字段属性选择
    fieldSXChange(value) {
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
    //属性选择
    onFiledChange(index) {
      console.log(index)
      this.fieldList[index].content = ''
    },
    selectQestionBtn() {
      this.$refs.addQuestion.add(0)
    },
    selectTeachBtn() {
      this.$refs.addTeach.add(0, '')
    },
    handleQuestion(index, record) {
      console.log(record)
      this.questionContent = record
    },

    handleTeach(index, record) {
      console.log(record)
      this.teachContent = record
    },
    //读取模板信息
    readTemplateInfoBtn() {},
    goConfirm() {
      console.log(this.checkData)
      if (!this.checkData.wxAppId) {
        this.$message.error('请选择微信公众号')
        return
      }
      if (!this.checkData.templateId) {
        this.$message.error('请选择模板ID')
        return
      }
      if (!this.checkData.templateTitle) {
        this.$message.error('请输入模板标题')
        return
      }

      this.fieldList.forEach((item) => {
        if (!item.content) {
          this.$message.error('模板参数' + item.name + '为空')
          return
        }
      })

      var jumpValue = ''

      if (this.radioTyPe == -1) {
        this.$message.error('请选择跳转类型')
        return
      } else if (this.radioTyPe == 0) {
        if (!this.questionContent.questUrl) {
          this.$message.error('请选择问卷')
          return
        }
        jumpValue = this.questionContent.questUrl
      } else if (this.radioTyPe == 1) {
        if (!this.teachContent.articleId) {
          this.$message.error('请选择宣教文章')
          return
        }
        jumpValue = this.teachContent.articleId
      } else if (this.radioTyPe == 3) {
        if (!this.checkData.navigatorContent) {
          this.$message.error('请输入第三方链接')
          return
        }
        jumpValue = this.checkData.navigatorContent
      }

      var postData = {
        wxAppId: this.checkData.wxAppId,
        templateId: this.checkData.templateId,
        templateStatus: 1,
        templateTitle: this.checkData.templateTitle,
        templateContent:this.templateContent.content,
        jumpType: this.radioTyPe + 1,
        jumpValue: jumpValue,
        templateParamJson: JSON.stringify(this.fieldList),
      }
      if(this.id){
        postData.id=this.id
      }
      addWxTemplate(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      })
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
