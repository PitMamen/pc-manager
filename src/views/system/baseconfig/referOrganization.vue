<template>
  <a-modal
    :title="checkData.merchantId ? '修改转诊组织' : '新增转诊组织'"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">基本信息</span>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>组织名称:</span>
            <a-input v-model="checkData.orgName" allow-clear placeholder="请输入组织名称" style="width: 140px" />

            <span class="span-item-name" style="margin-left: 20px"><span style="color: red">*</span>组织性质:</span>
            <a-select
              v-model="checkData.orgType"
              placeholder="请选择组织性质"
              allow-clear
              style="height: 28px"
              class="ant-select-selection--single"
            >
              <a-select-option v-for="item in natureList" :key="item.code" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">包含机构</span>
          </div>

          <div class="div-content">
            <a-input
              v-model="inputName"
              @keyup.enter="searchName"
              @search="searchName"
              @blur="searchName"
              @change="onChanage"
              allow-clear
              placeholder="请输入待选机构名称检索"
              style="width: 186px; margin-left: 10px"
            />

            <a-input
              allow-clear
              placeholder="请输入选中机构名称检索"
              style="width: 186px; margin-left: 44px"
              v-model="noinputName"
              @keyup.enter="selectName"
              @search="selectName"
              @blur="selectName"
              @change="selectNameChanage"
            />
          </div>

          <div class="div-content">
            <a-transfer
              style="height: 300px"
              :titles="['待选机构', '选中机构']"
              :data-source="mockData"
              :target-keys="targetKeys"
              :render="(item) => item.title"
              @change="handleChange"
            />
          </div>
        </div>

        <!-- <div class="div-content"> -->

        <!-- </div> -->
      </div>
    </a-spin>
  </a-modal>
</template>
    
    
    <script>
import {
  getOrganizationalNature,
  getHospitalForOrgType,
  addReferralOrg,
  modifyReferralOrg,
  getReferralOrgInfo,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      confirmLoading: false,
      natureList: [],
      inputName: '',
      mockData: [],
      dataSource: [],
      inputName: '',
      noinputName: '',
      targetKeys: [],
      targetData: [],
      // 高级搜索 展开/关闭
      treeData: [],
      checkData: {
        hospitalCodeList: [], //机构
        orgName: '', //组织名称
        orgType: undefined, //组织性质
      },
      paramJsonList: [{ key: '', value: '' }],
      fetching: false,
      isChecked: false,
    }
  },
  created() {},
  methods: {
    // treeSelect(hospitalId) {
    //   //根据选中的 反向查询
    //   for (let index = 0; index < this.treeData.length; index++) {
    //     if (hospitalId == this.treeData[index].hospitalId) {
    //       this.findItemData = JSON.parse(JSON.stringify(this.treeData[index]))
    //       break
    //     }
    //     if (this.treeData[index].children && this.treeData[index].children.length > 0) {
    //       for (let indexIn = 0; indexIn < this.treeData[index].children.length; indexIn++) {
    //         if (hospitalId == this.treeData[index].children[indexIn].hospitalId) {
    //           this.findItemData = JSON.parse(JSON.stringify(this.treeData[index].children[indexIn]))
    //           break
    //         }
    //       }
    //     }
    //   }
    //   // console.log("HHHH:",this.findItemData)
    //   this.checkData.hospitalCode = this.findItemData.hospitalCode
    //   this.checkData.tenantId = this.findItemData.hospitalId
    // },

    clearData() {
      this.checkData = {
        hospitalCodeList: [], //机构
        orgName: '', //组织名称
        orgType: undefined, //组织性质
      }
    },

    selectNameChanage(event) {
      if (event.target.value == '' || event.type == 'click') {
        this.getReferralOrgInfoOut()
      }
    },

    selectName() {
      if (this.noinputName) {
        if (this.targetData && this.targetData.length > 0) {
          var ss = this.targetData.filter((p) => {
            return p.hospitalName.indexOf(this.noinputName) > -1
          })
          console.log('JJJ:', ss)

          if (ss && ss.length > 0) {
            const targetKeys = []
            for (let i = 0; i < ss.length; i++) {
              targetKeys.push(ss[i].hospitalCode)
            }
            this.targetKeys = targetKeys
          } else {
            this.targetKeys = JSON.parse(JSON.stringify(this.targetKeys))
          }
        }
      } else {
        this.targetKeys = JSON.parse(JSON.stringify(this.targetKeys))
      }
    },

    onChanage(event) {

        if (event.target.value == '' || event.type == 'click') {
            this.mockData = JSON.parse(JSON.stringify(this.dataSource))
      }
    //   if (event.type == 'click') {
    //     this.mockData = JSON.parse(JSON.stringify(this.dataSource))
    //   }
    },

    searchName() {
      if (this.inputName) {
        if (this.dataSource && this.dataSource.length > 0) {
          var ss = this.dataSource.filter((p) => {
            return p.title.indexOf(this.inputName) > -1
          })

          if (ss && ss.length > 0) {
            const mockData = []
            for (let i = 0; i < ss.length; i++) {
              const data = {
                key: ss[i].key,
                title: ss[i].title,
                description: `description of ${ss[i].description}`,
              }
              mockData.push(data)
            }
            this.mockData = mockData
          } else {
            this.mockData = JSON.parse(JSON.stringify(this.dataSource))
          }
        }
      } else {
        this.mockData = JSON.parse(JSON.stringify(this.dataSource))
      }
    },

    // 获取组织性质
    getOrganizationalNatureOut() {
      getOrganizationalNature().then((res) => {
        if (res.code == 0) {
          if (res.data) {
            this.natureList = res.data
          }
        }
      })
    },

    // 获取转诊组织信息
    getReferralOrgInfoOut() {
      const targetKeys = []
      getReferralOrgInfo(this.checkData.id).then((res) => {
        if (res.code == 0) {
          if (res.data.referralOrgRelList) {
            const dataTemp = res.data.referralOrgRelList
            this.targetData = res.data.referralOrgRelList
            for (let i = 0; i < dataTemp.length; i++) {
              this.targetKeys.push(dataTemp[i].hospitalCode)
            }
          }
          console.log('HHHH:', this.targetData)
        }
      })
    },

    // 待选中 全量数据
    getHospitalForOrgTypeOut() {
      const targetKeys = []
      const mockData = []
      getHospitalForOrgType({ orgTypes: '1,2', hospitalName: this.inputName }).then((res) => {
        if (res.code == 0) {
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              const data = {
                key: res.data[i].hospitalCode,
                title: res.data[i].hospitalName,
                description: `description of ${res.data[i].hospitalName}`,
              }
              mockData.push(data)
            }
          }
        }
      })
      this.dataSource = mockData
      this.mockData = mockData
      this.targetKeys = targetKeys
      console.log('ccccc:', this.mockData)
    },

    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
      this.checkData.hospitalCodeList = this.targetKeys

      console.log('DDDD:', this.targetKeys)
    },

    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.getOrganizationalNatureOut() //获取组织性质列表
      this.getHospitalForOrgTypeOut() //全量结构列表
    },
    //修改
    editModel(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.checkData = record
      this.getOrganizationalNatureOut() //获取组织性质列表
      this.getHospitalForOrgTypeOut() //全量结构列表
      this.getReferralOrgInfoOut() //获取转诊组织信息
    },

    handleSubmit() {
      if (!this.checkData.orgName) {
        this.$message.error('请输入组织名称!')
        return
      }

      if (!this.checkData.orgType) {
        this.$message.error('请选择组织性质!')
        return
      }

      var postData = {
        hospitalCodeList: this.checkData.hospitalCodeList,
        orgName: this.checkData.orgName,
        orgType: this.checkData.orgType,
      }
      this.confirmLoading = true

      if (this.checkData.id) {
        postData.id = this.checkData.id
        //修改
        this.modifyReferralOrgOut(postData)
      } else {
        //新增
        this.addReferralOrgOut(postData)
      }
    },

    addReferralOrgOut(postData) {
      addReferralOrg(postData).then((res) => {
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
    modifyReferralOrgOut(postData) {
      modifyReferralOrg(postData).then((res) => {
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
/deep/.ant-transfer-list {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 300px;
  padding-top: 40px;
  margin-left: 9px;
  vertical-align: middle;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  // width: 420px;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 14px;

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
  // height: 342px;
  margin-top: 10px;

  .div-part-left {
    // float: left;
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

  .div-bottomlayout {
    display: flex;
    flex-direction: column;
    width: 420px;
    flex-wrap: wrap;
  }

  .div-content {
    margin-bottom: 10px;
    width: 420px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 14px;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    /deep/.ant-select-selection--bb {
      width: 350px;
    }

    /deep/.ant-select-selection--single {
      width: 132px;
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
      width: 250px;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      // flex: 1;
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
    