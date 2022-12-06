<template>
  <a-modal
    title="新增人员"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <a-avatar :size="48" icon="user" style="margin-right: 21px" />
            <div class="avator-right">
              <a-upload
                v-model="fileList"
                name="file"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload" />
                  上传头像
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 8px">支持扩展名：.bmp .png .jpge .jpg...</span>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>姓名:</span>
            <a-input class="span-item-value" style="display: inline-block" allow-clear placeholder="请输入姓名" />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>性别:</span>
            <a-radio-group name="radioGroup" v-model="sexRadioTyPe" @change="sexRadioChange">
              <a-radio :value="0"> 男 </a-radio>
              <a-radio :value="1" style="margin-left: 32px"> 女 </a-radio>
              <a-radio :value="2" style="margin-left: 32px"> 未知 </a-radio>
            </a-radio-group>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>出生日期:</span>
            <a-date-picker :value="createValue" />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>身份证号:</span>
            <a-input class="span-item-value" style="display: inline-block" allow-clear placeholder="请输入身份证号" />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>联系电话:</span>
            <a-input class="span-item-value" style="display: inline-block" allow-clear placeholder="请输入联系电话" />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>邮箱地址:</span>
            <a-input class="span-item-value" style="display: inline-block" allow-clear placeholder="请输入邮箱地址" />
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">医护信息</span>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员类型:</span>
            <a-select allow-clear placeholder="请选择人员类型" @change="onWXProgramChange">
              <a-select-option v-for="(item, index) in danandataList" :key="index" :value="item.tableField">{{
                item.tableField
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员职称:</span>
            <a-select allow-clear placeholder="请选择人员职称" @change="onWXProgramChange">
              <a-select-option v-for="(item, index) in danandataList" :key="index" :value="item.tableField">{{
                item.tableField
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属机构:</span>
            <a-select allow-clear placeholder="请选择所属机构" @change="onWXProgramChange">
              <a-select-option v-for="(item, index) in danandataList" :key="index" :value="item.tableField">{{
                item.tableField
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>创建账号:</span>
            <a-input class="span-item-value" style="display: inline-block" allow-clear placeholder="请输入内容" />
          </div>
        </div>

        <div class="div-part-right">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">分配角色</span>
          </div>
          <div class="div-content">
            <div class="jueseview"></div>
          </div>
          <div class="div-title" >
            <div class="div-line-blue"></div>
            <span class="span-title">服务配置</span>
          </div>

          <div class="div-content" style="flex-wrap: wrap;">

            <div class="checkview">
              <span class="span-check-title"  >图文咨询:</span>
              <a-switch default-checked @change="onChange" />
            </div>
             <div class="checkview">
              <span class="span-check-title"  >电话咨询:</span>
              <a-switch default-checked @change="onChange" />
            </div>
            <div class="checkview" style=" margin-right: 0;">
              <span class="span-check-title"  >视频咨询:</span>
              <a-switch default-checked @change="onChange" />
            </div>
            <div class="checkview">
              <span class="span-check-title"  >复诊开方:</span>
              <a-switch default-checked @change="onChange" />
            </div>
            <div class="checkview">
              <span class="span-check-title"  >MDT会诊:</span>
              <a-switch default-checked @change="onChange" />
            </div>
          </div>

        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getTemplateWxMsg,
  getWxConfigureList,
  qryMetaConfigureDetail,
  addWxTemplate,
  getWxTemplateById,
  modifyWxTemplate,
} from '@/api/modular/system/posManage'

export default {
  components: {},
  data() {
    return {
      visible: false,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      createValue: '',
      fileList: '',
      danandataList: [],
      sexRadioTyPe: 0,
      checkData: {
        wxConfigureId: '', //公众号配置ID
        wxAppId: '', //公众号ID
        templateId: '', //模板ID
        templateTitle: '', //模板標題
        navigatorType: '', //跳转类型
        navigatorContent: '', //跳转内容
      },
    }
  },
  methods: {
    clearData() {},
    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false

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

    handleSubmit() {
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

      for (var i = 0; i < this.fieldList.length; i++) {
        if (!this.fieldList[i].content) {
          this.$message.error('模板参数' + this.fieldList[i].name + '为空')
          return
        }
      }

      var postData = {}
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
      addWxTemplate(postData).then((res) => {
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
      modifyWxTemplate(postData).then((res) => {
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

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.div-title {
  display: flex;
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 14px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 520px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }
    .span-item-value {
      flex: 1;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
    }
    .ant-calendar-picker {
      flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 56px;
      border: 1px solid #cccccc;
      border-radius: 2px;
    }
  }
  .checkview{
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 18px;

  }
   .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch{
      width: 40px !important;
    }
}
</style>
