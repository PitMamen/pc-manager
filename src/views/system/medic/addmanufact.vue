<template>
  <a-modal
    :title="record.id ? '修改生产厂商' : '新增生产厂商'"
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
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>厂商类型:</span>
            <a-select
              v-model="checkData.factoryType"
              placeholder="请选择厂商类型"
              allow-clear
              style="width: 120px; height: 28px"
            >
              <a-select-option v-for="item in typeList" :key="item.value" :value="item.value">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>厂商名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.factoryName"
              style="display: inline-block"
              allow-clear
              :maxLength="36"
              placeholder="请输入厂商名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">拼音码:</span>
            <a-input
              :disabled="!record.id"
              class="span-item-value"
              v-model="checkData.pyCode"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="自动生成"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">厂商地址:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.address"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="请输入厂商地址"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">联系人:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.contactName"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="请输入联系人"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">联系电话:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.contactTel"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="请输入联系人电话"
            />
          </div>

          <div class="div-content" style="position: relative; height: 52%">
            <span style="margin-top: -40px; width: 60px; margin-left: 15px"> 备注说明:</span>
            <a-textarea
              style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 0px; width: 84%"
              v-model="checkData.remark"
              :maxLength="150"
              placeholder="请输入备注说明"
              v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入备注说明！' }] }]"
            />
            <span class="m-count-pxk">{{ checkData.remark ? checkData.remark.length : 0 }}/150</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
    
    
    <script>
import { queryHospitalList, modifyTbMerchant, addTbMerchant, factoryDetail,saveFactory } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      confirmLoading: false,
      checkData: {
        factoryType: undefined,
        factoryName: '', //商户名称
        pyCode: '',
        address: '', //
        contactName: '',
        contactTel: '',
        remark:''
      },

      typeList: [
        {
          value: 1,
          name: '药品供应商',
        },
        {
          value: 2,
          name: '设备器械商',
        },
        {
          value: 3,
          name: '服务提供商',
        },
        {
          value: 4,
          name: '数字疗法厂商',
        },
      ],
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        factoryType: undefined,
        factoryName: '', //商户名称
        pyCode: '',
        address: '', //
        contactName: '',
        contactTel: '',
        remark:''
      }
    },


    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
    },
    //查看详情
    editModel(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.checkData = record
      this.detailOut(record.id)
    },



    // 请求 详情
    detailOut(facid) {
        factoryDetail(facid).then((res) => {
        if (res.code == 0) {
          this.checkData = res.data
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    handleSubmit() {

      if (isStringEmpty(this.checkData.factoryType)) {
        this.$message.error('请选择厂商类型')
        return
      }


      if (isStringEmpty(this.checkData.factoryName)) {
        this.$message.error('请输入厂商名称')
        return
      }
      this.confirmLoading = true

      if (this.record.id) {
        //修改
        this.saveFactoryOut(this.checkData)
      } else {
        //新增
        this.saveFactoryOut(this.checkData)
      }
    },

    saveFactoryOut(postData) {
        saveFactory(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
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
// .ant-select-tree-dropdown {
//   max-height: 860vh !important;
//   top: 200px !important;
// }

/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 420px;
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
    width: 430px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 65px;
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

    .m-count-pxk {
      position: absolute;
      font-size: 12px;
      bottom: 12px;
      right: 10px;
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
    