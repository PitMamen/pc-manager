<template>
  <a-modal
    title="新增账号"
    :width="460"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-title"  style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>登录账号:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.account"
              style="display: inline-block"
              allow-clear
              placeholder="请输入账号"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>对应人员:</span>
            <a-select v-model="checkData.name" allow-clear placeholder="请选择人员类型">
              <a-select-option v-for="(item, index) in rylxList" :key="index" :value="item">{{ item }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name">所属机构:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.name"
              style="display: inline-block"
              allow-clear
              readOnly
              placeholder=""
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">联系方式:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.name"
              style="display: inline-block"
              allow-clear
              readOnly
              placeholder=""
            />
          </div>
          
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">服务权限</span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属角色:</span>
            <a-select v-model="checkData.role" allow-clear placeholder="请选择所属角色" :maxTagCount="3"
          :collapse-tags="true" mode="multiple" style=" height: 28px">
              <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.roleRealName">{{ item.roleRealName }}</a-select-option>
            </a-select>
          </div>
          
         
          <div class="div-content">
            <a-checkbox v-model="accountChecked"></a-checkbox>
            <span class="span-item-name">客服坐席:</span>
            <a-input class="span-item-value" style="display: inline-block" :disabled="!accountChecked" placeholder="请输入客服坐席ID" />
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
        account: '', //登录账号
        userId:'',//对应人员
        name: '',    
        tel: '',
        role: undefined, //分配角色
        zuoxi:'',//坐席
      },
      accountChecked: false, //客服坐席
     
      roleList: [], //角色列表
      rylxList: ['医生', '护士', '药剂师', '医技人员', '后勤人员'], //人员类型
      
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


      if (this.checkData.account.length==0) {
        this.$message.error('请输入登录账号')
        return
      }
      if (this.checkData.name.length==0) {
        this.$message.error('请选择对应人员')
        return
      }
    

      if (this.checkData.tel.length==0) {
        this.$message.error('请输入联系电话')
        return
      }

      if (this.checkData.role.length == 0) {
          this.$message.error('请分配角色')
          return
        }
      

      if (this.accountChecked) {
        //如果勾选了客服坐席
       
        if (this.checkData.zuoxi.length == 0) {
          this.$message.error('请输入客服坐席ID')
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
  height: 310px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 100%;
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
    /deep/.ant-select-selection--multiple{
      li{
    margin-top: 1px !important;
  }
    }
  
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
