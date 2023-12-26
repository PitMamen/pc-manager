<template>
  <a-modal
    :title="'新增团队'"
    :width="460"
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
            <span class="span-item-name"><span style="color: red">*</span>所属机构:</span>
            <!-- <a-select
                style="margin-top: 1px"
                show-search
                v-model="checkData.hospitalCode"
                :filter-option="false"
                allow-clear
                placeholder="请选择机构"
              >
                <a-select-option v-for="(item, index) in treeData" :key="item.hospitalCode" :value="item.hospitalCode">{{
                  item.hospitalName
                }}</a-select-option>
              </a-select> -->

            <a-select
              v-model="checkData.hospitalCode"
              placeholder="请选择机构"
              show-search
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              allow-clear
              class="span-item-value"
              @change="onHospitalSelectChange"
              @search="onHospitalSelectSearch"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
                item.hospitalName
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>团队名称:</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.teamName"
              style="display: inline-block"
              allow-clear
              placeholder="请输入团队名称"
            />
          </div>

          <div class="div-service-user" style="margin-top: 10px; margin-left: 0px; position: relative; height: 52%">
            <span style="margin-top: 10px; width: 60px; margin-left: 9px"> 备注说明:</span>
            <a-textarea
              style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 0px; width: 84%"
              v-model="checkData.description"
              :maxLength="50"
              placeholder="请输入备注说明"
              v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入备注说明！' }] }]"
            />
            <span class="m-count-pxk">{{ checkData.description ? checkData.description.length : 0 }}/50</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
    
    
    <script>
import { addTdHealthyTeam, queryHospitalList2 } from '@/api/modular/system/posManage'

import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      treeData: [],
      localHospitalCode:undefined,
      fetching:false,
      checkData: {
        description: '',
        hospitalCode: undefined,
        teamName: '',
      },
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        description: '',
        hospitalCode: undefined,
        teamName: '',
      }
    },
    //修改
    addTeam(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.user = Vue.ls.get(TRUE_USER)
      if (this.user) {
        this.localHospitalCode = this.user.hospitalCode
      }
      this.confirmLoading = false
      this.record = record

      this.queryHospitalListOut(undefined)
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   queryHospitalList(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },


    /**
     * 所属机构接口
     */
     queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.checkData.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //机构搜索
    onHospitalSelectSearch(value) {
      this.treeData = []
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
    },

    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.hospitalCode)) {
        this.$message.error('请选择所属机构')
        return
      }

      if (isStringEmpty(this.checkData.teamName)) {
        this.$message.error('请输入团队名称')
        return
      }
      this.addTeamOut(this.checkData)
    },

    selectChange(value) {},

    //修改团队
    addTeamOut(postData) {
      addTdHealthyTeam(postData).then((res) => {
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
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
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
    