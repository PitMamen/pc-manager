<template>
  <a-modal
    :title="id ? '修改短信模板' : '新增短信模板'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-check2">
        <div class="div-part">
          <div class="div-line-wrap">
            <div class="div-left">
              <span class="span-item-name">短信平台 :</span>
              <a-select v-model="checkData.smsConfigureId" allow-clear placeholder="请选择" @change="onWXProgramChange">
                <a-select-option v-for="(item, index) in wxgzhData" :key="index" :value="item.id">{{
                  item.supplierName
                }}</a-select-option>
              </a-select>
            </div>
            <div class="div-left" style="padding-left: 20px">
              <span class="span-item-name">模 板 I D :</span>
              <a-select v-model="checkData.templateId" allow-clear placeholder="请选择" @change="onTemplateChange">
                <a-select-option v-for="(item, index) in templateData" :key="index" :value="item.id">{{
                  item.smsTemplateTitle
                }}</a-select-option>
              </a-select>
              <!-- <a-button type="primary" @click="readTemplateInfoBtn" style="margin-left: 3%"> 读取模板信息 </a-button> -->
            </div>
          </div>
          <div class="div-line-wrap">
            <div class="div-left">
              <span class="span-item-name">内部编码 :</span>
              <a-input
                v-model="templateContent.smsTemplateCode"
                class="span-item-value"
                style="display: inline-block"
                readOnly
                allow-clear
                placeholder="请输入内部编码 "
              />
            </div>
            <div class="div-left" style="padding-left: 20px">
              <span class="span-item-name">模板标题 :</span>
              <a-input
                v-model="checkData.templateTitle"
                class="span-item-value"
                style="display: inline-block"
                allow-clear
                type="text"
                :maxLength="30"
                placeholder="请输入模板标题 "
              />
            </div>
          </div>
          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name" style="position: relative; top: -43px">模板内容 :</span>
              <a-textarea
                v-model="templateContent.smsTemplateContent"
                class="span-item-value"
                readOnly
                style="height: 65px !important; width: 695px !important; display: inline-block"
                allow-clear
                placeholder="请输入模板内容 "
              />
              <!-- <a-input
           v-model="templateContent.smsTemplateContent"
           class="span-item-value"
           style="display: inline-block; width: 695px !important;"
           readOnly
           allow-clear
           placeholder="请输入模板内容 "
         /> -->
            </div>
          </div>

          <div class="div-line-wrap" v-for="(item, index) in fieldList" :key="index" :value="item">
            <div class="div-left" style="width: 205px; margin-left: 65px">
              <span class="span-item-name" style="width: 100% !important"
                >模板参数{{ index + 1 }} :[{{ item.name }}]</span
              >
            </div>
            <div class="div-left" style="width: 205px; margin-right: 80px">
              <span class="span-item-name">匹配字段 :</span>
              <a-select
                style="width: 140px !important"
                v-model="fieldList[index].property"
                allow-clear
                placeholder="请选择字段属性"
                @change="onFiledChange(index)"
              >
                <a-select-option v-for="(item, index) in zdsxData" :key="index" :value="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </div>
            <div class="div-left" style="width: 205px">
              <a-select
                v-show="item.property === '档案字段' && item.name.indexOf('date') < 0"
                v-model="fieldList[index].content"
                style="width: 100% !important"
                allow-clear
                placeholder="请选择参数"
              >
                <a-select-option v-for="(item, index) in dananfieldList" :key="index" :value="item.tableField">{{
                  item.fieldComment
                }}</a-select-option>
              </a-select>
              <a-select
                v-show="item.property === '档案字段' && item.name.indexOf('date') > -1"
                v-model="fieldList[index].content"
                style="width: 100% !important"
                allow-clear
                placeholder="请选择参数"
              >
                <a-select-option v-for="(item, index) in danandataList" :key="index" :value="item.tableField">{{
                  item.fieldComment
                }}</a-select-option>
              </a-select>
              <a-input
                v-show="item.property === '自定义传参'"
                v-model="fieldList[index].content"
                class="span-item-value"
                style="width: 100%; margin-left: 0; display: inline-block"
                allow-clear
                :maxLength="150"
                placeholder="请输入参数,不超过150字 "
              />
            </div>
          </div>

          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name"> 跳转内容 :</span>

              <a-radio-group name="radioGroup" v-model="radioTyPe" @change="radioChange">
                <a-radio :value="0"> 问卷 </a-radio>
                <a-radio :value="1" style="margin-left: 24px"> 宣教 </a-radio>
                <a-radio :value="2" style="margin-left: 24px" v-if="!hasUrlField"> 不跳转任何内容 </a-radio>
              </a-radio-group>
            </div>
          </div>

          <div class="div-line-wrap" v-show="radioTyPe === 0">
            <div class="div-total-one">
              <span class="span-item-name">问卷名称 :</span>
              <a-input
                v-show="questionContent.name"
                v-model="questionContent.name"
                class="span-item-value"
                style="display: inline-block; margin-right: 20px; width: 295px"
                allow-clear
                readOnly
                placeholder="请选择问卷 "
              />
              <a-button type="primary" @click="selectQestionBtn"> 选择 </a-button>
            </div>
          </div>
          <div class="div-line-wrap" v-show="radioTyPe === 1">
            <div class="div-total-one">
              <span class="span-item-name">宣教名称 :</span>
              <a-input
                v-show="teachContent.title"
                v-model="teachContent.title"
                class="span-item-value"
                style="display: inline-block; margin-right: 20px; width: 295px"
                allow-clear
                readOnly
                placeholder="请选择宣教文章 "
              />
              <a-button type="primary" @click="selectTeachBtn"> 选择 </a-button>
            </div>
          </div>
          <div class="div-line-wrap" v-show="radioTyPe === 3">
            <div class="div-total-one">
              <span class="span-item-name">第三方链接 :</span>
              <a-input
                v-model="checkData.navigatorContent"
                class="span-item-value"
                style="display: inline-block; width: 295px"
                allow-clear
                placeholder="请输入第三方链接 "
              />
            </div>
          </div>
        </div>

        <!-- <div style="margin-top: 30px">
     <a-button size="large" type="primary" @click="goConfirm" style="width: 20%; margin-left: 37%">
       {{ id ? '确认修改' : '确认提交' }}
     </a-button>
   </div> -->

        <add-question ref="addQuestion" @ok="handleQuestion" />
        <add-teach ref="addTeach" @ok="handleTeach" />
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getSmsConfigureTemplateList,
  getSmsConfigureList,
  qryMetaConfigureDetail,
  addSmsTemplate,
  getSmsTemplateById,
  modifySmsTemplate,
} from '@/api/modular/system/posManage'
import addQuestion from '../package/addQuestion'
import addTeach from '../package/addTeach'
export default {
  components: { addQuestion, addTeach },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      key: '',
      id: '', //业务模板详情ID 修改时才有值
      templateBean: '', //业务模板详情
      hasUrlField: false,
      // 高级搜索 展开/关闭
      advanced: false,
      radioTyPe: 0,
      checkData: {
        smsConfigureId: '', //短信平台配置ID
        id: '', //短信平台ID
        supplierName: '', //短信平台名称
        templateId: '', //模板ID
        smsTemplateTitle: '', //模板标题
        templateTitle: '', //模板输入标题
        navigatorType: '', //跳转类型
        navigatorContent: '', //跳转内容
      },
      templateContent: { smsConfigureId: '', smsTemplateCode: '', smsTemplateTitle: '', smsTemplateContent: '' },
      questionContent: { name: '' },
      teachContent: { title: '' },

      wxgzhData: [], //公众号列表
      templateData: [], //模板列表
      zdsxData: ['档案字段', '自定义传参'], //字段属性
      fieldList: [], //字段列表
      dananfieldList: [], //档案字段列表
      danandataList: [], //档案日期字段列表
      navigateListData: [],
    }
  },
  methods: {
    clearData() {
      this.id = ''
      this.wxgzhData = []
      this.checkData = {
        smsConfigureId: '', //短信平台配置ID
        id: '', //短信平台ID
        supplierName: '', //短信平台名称
        templateId: '', //模板ID
        smsTemplateTitle: '', //模板标题
        templateTitle: '', //模板输入标题
        navigatorType: '', //跳转类型
        navigatorContent: '', //跳转内容
      }
      ;(this.templateContent = {
        smsConfigureId: '',
        smsTemplateCode: '',
        smsTemplateTitle: '',
        smsTemplateContent: '',
      }),
        (this.fieldList = [])
      this.radioTyPe = 0
      this.questionContent = { name: '' }
      this.teachContent = { title: '' }
    },

    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      //获取短线平台列表
      getSmsConfigureList({"pageNo": 1,"pageSize": 10000}).then((res) => {
        if (res.code == 0) {
          this.wxgzhData = res.data.records
        }
      })

      //获取档案字段列表
      qryMetaConfigureDetail({ databaseTableName: 'tb_patient_baseinfo' }).then((res) => {
        if (res.code == 0) {
          this.dananfieldList = res.data[0].detail

          //如果是日期类的 需要限制
          var dataList = []
          this.dananfieldList.forEach((item) => {
            if (item.fieldType.value == 2) {
              dataList.push(item)
            }
          })
          this.danandataList = dataList
        }
      })
    },
    //修改  详情
    checkModel(id) {
      this.clearData()
      this.visible = true
      this.id = id
      this.confirmLoading = true
      console.log('checkModel', this.confirmLoading)
      //获取公众号列表
      getSmsConfigureList({}).then((res) => {
        if (res.code == 0) {
          this.wxgzhData = res.data.records

          //查询详情

          getSmsTemplateById(this.id).then((res) => {
            if (res.code == 0) {
              this.checkData = res.data
              this.checkData.templateId = Number(res.data.templateId)
              this.templateContent.smsConfigureId = res.data.smsConfigureId
              this.templateContent.smsTemplateContent = res.data.templateContent
              this.templateContent.smsTemplateCode = res.data.templateInsideCode

              var thisWXData = []
              this.wxgzhData.forEach((item) => {
                if (item.id + '' === res.data.smsConfigureId) {
                  thisWXData.push(item)
                }
              })
              this.wxgzhData = thisWXData

              this.radioTyPe = res.data.jumpType - 1
              if (this.radioTyPe == 0) {
                this.questionContent.questUrl = res.data.jumpValue
                this.questionContent.name = res.data.jumpTitle
                this.questionContent.id = res.data.jumpId
              } else if (this.radioTyPe == 1) {
                this.teachContent.articleId = res.data.jumpId
                this.teachContent.title = res.data.jumpTitle
              } else if (this.radioTyPe == 3) {
                this.checkData.navigatorContent = res.data.jumpValue
              }

              this.fieldList = JSON.parse(res.data.templateParamJson)

              this.sortFieldList(this.templateContent.smsTemplateContent)

              this.onWXProgramChange(Number(res.data.smsConfigureId))
            } else {
              this.$message.error(res.message)
            }
            this.confirmLoading = false
          })
        }
      })

      //获取档案字段列表
      qryMetaConfigureDetail({ databaseTableName: 'tb_patient_baseinfo' }).then((res) => {
        if (res.code == 0) {
          this.dananfieldList = res.data[0].detail

          //如果是日期类的 需要限制
          var dataList = []
          this.dananfieldList.forEach((item) => {
            if (item.fieldType.value == 2) {
              dataList.push(item)
            }
          })
          this.danandataList = dataList
        }
      })
    },
    handleChange(code) {},

    //选择公众号
    onWXProgramChange(value) {
      console.log('选择公众号:' + value)
      this.wxgzhData.forEach((item) => {
        if (item.id === value) {
          this.checkData.smsConfigureId = item.id
        }
      })
      this.getSmsConfigureTemplateList(value)
    },
    //获取模板列表或者单个
    getSmsConfigureTemplateList(id) {
      getSmsConfigureTemplateList(id).then((res) => {
        if (res.code == 0) {
          if (this.$route.query.id) {
            //详情
            var thistemplateData = []
            res.data.forEach((item) => {
              if (item.id === this.checkData.templateId) {
                thistemplateData.push(item)
              }
            })
            console.log('thistemplateData', thistemplateData)
            this.templateData = thistemplateData
          } else {
            //新增
            this.templateData = res.data
          }
        }
      })
    },
    //选择模板
    onTemplateChange(value) {
      console.log('onTemplateChange=' + value)
      if (this.$route.query.id) {
        //详情
        return
      }
      this.templateData.forEach((item) => {
        if (item.id === value) {
          this.templateContent = item

          this.fieldList = []
        }
      })
      console.log(this.templateContent)

      let text = this.templateContent.smsTemplateContent

      this.fieldList = this.sortFieldList(text)
    },

    //阿里短信平台字段解析 是否有url字段  如果有则不显示url字段和不跳转任何链接
    sortFieldList(text) {
      this.hasUrlField = false
      console.log(text)
      var arr = []
      let regex = /\$\{(.+?)\}/g
      let result
      while ((result = regex.exec(text)) != null) {
        console.log(result[1])
        if (result[1] == 'url') {
          this.hasUrlField = true
        } else {
          arr.push({
            name: result[1],
            property: '请选择',
            content: '',
          })
        }
      }
      console.log(arr)
      return arr
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
      if (!this.checkData.smsConfigureId) {
        this.$message.error('请选择短信平台')
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

      for (var i = 0; i < this.fieldList.length; i++) {
        if (!this.fieldList[i].content) {
          this.$message.error('模板参数' + this.fieldList[i].name + '为空')
          return
        }
      }

      var jumpValue = ''
      var jumpTitle = ''
      var jumpId = ''
      if (this.radioTyPe == -1) {
        this.$message.error('请选择跳转类型')
        return
      } else if (this.radioTyPe == 0) {
        if (!this.questionContent.questUrl) {
          this.$message.error('请选择问卷')
          return
        }
        jumpValue = this.questionContent.questUrl
        jumpTitle = this.questionContent.name
        jumpId = this.questionContent.id
      } else if (this.radioTyPe == 1) {
        if (!this.teachContent.articleId) {
          this.$message.error('请选择宣教文章')
          return
        }
        jumpValue = this.teachContent.articleId
        jumpTitle = this.teachContent.title
        jumpId = this.teachContent.articleId
      } else if (this.radioTyPe == 3) {
        if (!this.checkData.navigatorContent) {
          this.$message.error('请输入第三方链接')
          return
        }
        jumpValue = this.checkData.navigatorContent
        jumpTitle = this.checkData.navigatorContent
      }

      var postData = {
        smsConfigureId: this.checkData.smsConfigureId,
        templateId: this.checkData.templateId,
        templateStatus: 1,
        templateTitle: this.checkData.templateTitle,
        templateContent: this.templateContent.smsTemplateContent,
        templateName: this.templateContent.smsTemplateTitle,
        templateInsideCode: this.templateContent.smsTemplateCode,
        jumpType: this.radioTyPe + 1,
        jumpValue: jumpValue,
        jumpTitle: jumpTitle,
        jumpId: jumpId,
        templateParamJson: JSON.stringify(this.fieldList),
      }
      this.confirmLoading = true
      if (this.id) {
        //修改
        postData.id = this.id
        this.modify(postData)
      } else {
        //新增
        this.add(postData)
      }
    },

    add(postData) {
      addSmsTemplate(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
    modify(postData) {
      modifySmsTemplate(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
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
    handleSubmit() {
      this.goConfirm()
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less" >
.ant-select-dropdown {
  z-index: 20000;
}

/deep/ .ant-select-dropdown {
  width: 300px !important;
}
/deep/ .global-search {
  width: 300px !important;
}

.div-check2 {
  // background-color: white;
  // padding: 0 5% 0 5%;
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
    margin-top: 10px;
    // border-bottom: 1px solid #e6e6e6;
    // background-color: white;
    // overflow: hidden;
    // padding: 1.5%;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-calendar-picker {
      margin-left: 3.5%;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;

      .div-left {
        float: left;
        width: 50%;

        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 12px;
          text-align: left;
          margin-right: 10px;
          width: 55px;
        }
        .span-item-value {
          width: 295px;
          color: #333;
          text-align: left;
          font-size: 12px;
          display: inline-block;
        }
        .ant-select {
          width: 295px !important;
        }
      }

      .div-total-one {
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 12px;
          margin-right: 10px;
          width: 55px;
        }
        .span-item-value {
          width: 22.5%;
          color: #333;
          font-size: 12px;
          padding-left: 0px;
          text-align: left;
          display: inline-block;
        }

        .ant-select {
          width: 22.5% !important;
          margin-left: 0% !important;
        }
        .ant-radio-wrapper {
          font-size: 12px;
        }
        .ant-radio {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
