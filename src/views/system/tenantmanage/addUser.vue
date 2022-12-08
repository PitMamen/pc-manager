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
            <a-avatar :size="48" :src="checkData.avatorUrl" icon="user" style="margin-right: 21px" />
            <div class="avator-right">
              <a-upload
                name="file"
                action="/api/content-api/fileUpload/uploadImgFile"
                :headers="headers"
                :before-upload="beforeUpload"
                @change="handleChange"
                :showUploadList="false"
              >
                <a-button>
                  <a-icon type="upload" />
                  上传头像
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 6px">支持扩展名：.png .jpge .jpg</span>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>姓名:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.name"
              style="display: inline-block"
              allow-clear
              placeholder="请输入姓名"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>性别:</span>
            <a-radio-group name="radioGroup" v-model="checkData.sex">
              <a-radio :value="0"> 男 </a-radio>
              <a-radio :value="1" style="margin-left: 32px"> 女 </a-radio>
              <a-radio :value="2" style="margin-left: 32px"> 未知 </a-radio>
            </a-radio-group>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>出生日期:</span>
            <a-date-picker @change="onDatePickerChange" />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>身份证号:</span>
            <a-input
              v-model="checkData.idNo"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              placeholder="请输入身份证号"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>联系电话:</span>
            <a-input
              v-model="checkData.tel"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              placeholder="请输入联系电话"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>邮箱地址:</span>
            <a-input
              v-model="checkData.email"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              placeholder="请输入邮箱地址"
            />
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">医护信息</span>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员类型:</span>
            <a-select v-model="checkData.rylx" allow-clear placeholder="请选择人员类型">
              <a-select-option v-for="(item, index) in rylxList" :key="index" :value="item">{{ item }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员职称:</span>
            <a-select v-model="checkData.ryzc" allow-clear placeholder="请选择人员职称">
              <a-select-option v-for="(item, index) in ryzcList" :key="index" :value="item">{{ item }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属机构:</span>
            <a-tree-select
          v-model="checkData.ssjg"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"         
        >
        </a-tree-select>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>
          <div class="div-content">
            <a-checkbox v-model="accountChecked"></a-checkbox>
            <span class="span-item-name"><span style="color: red">*</span>创建账号:</span>
            <a-input class="span-item-value" style="display: inline-block" readOnly placeholder="请输入内容" />
          </div>
        </div>

        <div class="div-part-right">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">分配角色</span>
          </div>
          <div class="div-content">
            <div class="jueseview">
              <a-checkbox
                :disabled="!accountChecked"
                v-model="item.checked"
                class="checkbox"
                v-for="(item, index) in roleList"
                :key="index"
                >{{ item.roleRealName }}</a-checkbox
              >
            </div>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">服务配置</span>
          </div>

          <div class="div-content" style="flex-wrap: wrap">
            <div class="checkview">
              <span class="span-check-title">图文咨询:</span>
              <a-switch v-model="textNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">电话咨询:</span>
              <a-switch v-model="textTelChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview" style="margin-right: 0">
              <span class="span-check-title">视频咨询:</span>
              <a-switch v-model="textVideoChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">复诊开方:</span>
              <a-switch v-model="textAppointNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">MDT会诊:</span>
              <a-switch v-model="textMDTNumChecked" :disabled="!accountChecked" />
            </div>
          </div>

          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">个人简介</span>
          </div>
          <div class="div-content">
            <span class="span-item-name" style="text-align: left">擅长领域:</span>
          </div>
          <div class="div-content">
            <a-textarea
              v-model="checkData.scly"
              class="span-item-value"
              showCount
              :maxLength="30"
              style="height: 68px !important; width: 695px !important; display: inline-block"
              allow-clear
              :auto-size="false"
              placeholder="请输入内容 "
            />
          </div>
          <div class="div-content">
            <span class="span-item-name" style="text-align: left">详细介绍:</span>
          </div>
          <div class="div-content">
            <a-textarea
              v-model="checkData.xxjs"
              class="span-item-value"
              showCount
              :maxLength="100"
              style="height: 120px !important; width: 695px !important; display: inline-block"
              allow-clear
              :auto-size="false"
              placeholder="请输入内容 "
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getRoleList,
  queryHospitalList,
  qryMetaConfigureDetail,
  addWxTemplate,
  getWxTemplateById,
  modifyWxTemplate,
} from '@/api/modular/system/posManage'
import {idCardValidity,phoneValidity,emailValidity} from '@/utils/validityUtils'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      treeData:[],
      checkData: {
        avatorUrl: '', //头像
        name: '',

        sex: 0,
        csrq: '', //出生日期
        idNo: '',
        tel: '',
        email: '',
        rylx: '', //人员类型
        ryzc: '', //人员职称
        ssjg: '', //所属机构
        scly: '', //擅长领域
        xxjs: '', //详细介绍
        role: '', //分配角色
      },
      accountChecked: true, //创建账号
      textNumChecked: false,
      textTelChecked: false,
      textVideoChecked: false,
      textAppointNumChecked: false,
      textMDTNumChecked: false,
      roleList: [], //角色列表
      rylxList: ['医生', '护士', '药剂师', '医技人员', '后勤人员'], //人员类型
      ryzcList: [
        '正主任医生',
        '副主任医生',
        '主治医师',
        '经治医师',
        '正教授',
        '副教授',
        '讲师',
        '主任护师',
        '副主任护师',
        '护师',
        '护士',
      ], //人员职称
    }
  },
  created() {},
  methods: {
    clearData() {},
    //新增
    addModel() {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false


      this.getRolesOut()
      this.queryHospitalListOut()
    },
    //获取角色列表
    getRolesOut() {
      getRoleList({
        belong: undefined,
        status: 1,
        topFlag: undefined,
        keyWords: undefined,
      }).then((res) => {
        if (res.code == 0) {
          var roleList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].state == 1) {
              roleList.push(res.data[i])
            }
          }
          this.roleList = roleList
        }
      })
    },
/**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
     queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalId)
              this.$set(item, 'value', item.hospitalId)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalId)
                this.$set(item1, 'value', item1.hospitalId)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('请选择正确的图片格式')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M')
        return false
      }
      return true
    },
    handleChange(changeObj) {
      console.log(changeObj)
      if (changeObj.file.status == 'done') {
        if (changeObj.file.response.code != 0) {
          this.$message.error(changeObj.file.response.message)
        } else {
          if (changeObj.fileList.length == 0) {
            this.checkData.avatorUrl = ''
          } else {
            this.checkData.avatorUrl = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
          }
        }
      }

      console.log('avatorUrl:' + this.checkData.avatorUrl)
    },

    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.csrq = dateString
    },

    handleSubmit() {
      console.log(this.checkData)

      // if (this.checkData.avatorUrl.length==0) {
      //   this.$message.error('请上传头像')
      //   return
      // }
      // if (this.checkData.name.length==0) {
      //   this.$message.error('请输入姓名')
      //   return
      // }
      // if (this.checkData.csrq.length==0) {
      //   this.$message.error('请选择出生日期')
      //   return
      // }
      if (this.checkData.idNo.length==0) {
        this.$message.error('请输入身份证号码')
        return
      }

      var idRes= idCardValidity(this.checkData.idNo)
      console.log(idRes)
      if(!idRes.result){
        this.$message.error('请输入正确的身份证号码')
        return
      }

      if (this.checkData.tel.length==0) {
        this.$message.error('请输入联系电话')
        return
      }

      if(!phoneValidity(this.checkData.tel)){
        this.$message.error('请输入正确的联系电话')
        return
      }

      if (this.checkData.email.length==0) {
        this.$message.error('请输入邮箱地址')
        return
      }
      if(!emailValidity(this.checkData.email)){
        this.$message.error('请输入正确的邮箱地址')
        return
      }

      if (this.checkData.rylx.length==0) {
        this.$message.error('请选择人员类型')
        return
      }
      if (this.checkData.ryzc.length==0) {
        this.$message.error('请选择人员职称')
        return
      }
      if (this.checkData.ssjg.length==0) {
        this.$message.error('请选择所属机构')
        return
      }

      if (this.accountChecked) {
        //如果勾选了创建账号
        var checkedRoleList = []
        this.roleList.forEach((item) => {
          if (item.checked) {
            checkedRoleList.push(item)
          }
        })
        console.log(checkedRoleList)
        if (checkedRoleList.length == 0) {
          this.$message.error('请分配角色')
          return
        } else {
          this.checkData.role = checkedRoleList
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
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 530px;
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
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }
    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
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
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }
  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
