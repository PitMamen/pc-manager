<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
          @select="selectHospital"
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 180px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">科室:</span>
        <a-select
          class="sitemore"
          style="min-width: 180px; height: 28px"
          :collapse-tags="true"
          show-search
          v-model="queryParams.departmentId"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in originData"
            :title="item.departmentName"
            :key="index"
            :value="item.departmentId"
            >{{ item.departmentName }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">医护人员:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="输入用户名/医生"
          style="width: 140px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <s-table
      ref="table"
      class="x-table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :bordered="true"
      :scroll="{ x: true }"
      :rowKey="(record) => record.code"
    >
      <!-- 复诊续方 -->
      <span slot="fzxfaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.fuzhen"
            :title="record.fuzhen && record.fuzhen.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'fuzhen')"
          >
            <a-switch
              v-if="record.fuzhen"
              :disabled="!record.fuzhen || record.userType == 'nurse'"
              size="small"
              :checked="record.fuzhen ? record.fuzhen.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.fuzhen" class="tuoyuan" @click="showMessage(record, 1)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.fuzhen" @click="showMessage(record, 1)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a
            :disabled="record.userType == 'nurse'"
            v-if="record.fuzhen"
            style="margin-left: 5px"
            @click="$refs.fzmzConfig.editmodal(record, 1)"
            >配置</a
          >
        </div>
      </span>

      <!-- 图文咨询 -->
      <span slot="twzxaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.tuwen"
            :title="record.tuwen && record.tuwen.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'tuwen')"
          >
            <a-switch
              v-if="record.tuwen"
              :disabled="!record.tuwen"
              size="small"
              :checked="record.tuwen ? record.tuwen.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.tuwen" class="tuoyuan" @click="showMessage(record, 2)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.tuwen" @click="showMessage(record, 2)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a v-if="record.tuwen" style="margin-left: 5px" @click="$refs.tuWenConfig.editmodal(record)">配置</a>
        </div>
      </span>

      <!-- 电话咨询 -->
      <span slot="dhzxaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.dianhua"
            :title="record.dianhua && record.dianhua.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'dianhua')"
          >
            <a-switch
              :disabled="record.userType == 'nurse' || !record.dianhua"
              v-if="record.dianhua"
              size="small"
              :checked="record.dianhua ? record.dianhua.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.dianhua" class="tuoyuan" @click="showMessage(record, 3)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.dianhua" @click="showMessage(record, 3)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a
            :disabled="record.userType == 'nurse'"
            v-if="record.dianhua"
            style="margin-left: 5px"
            @click="$refs.phoneConfig.editmodal(record, 1)"
            >配置</a
          >
        </div>
      </span>

      <!-- 视频咨询 -->
      <span slot="spzxaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.shipin"
            :title="record.shipin && record.shipin.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'shipin')"
          >
            <a-switch
              v-if="record.shipin"
              :disabled="!record.shipin || record.userType == 'nurse'"
              size="small"
              :checked="record.shipin ? record.shipin.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.shipin" class="tuoyuan" @click="showMessage(record, 4)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.shipin" @click="showMessage(record, 4)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a
            :disabled="record.userType == 'nurse'"
            v-if="record.shipin"
            style="margin-left: 5px"
            @click="$refs.phoneConfig.editmodal(record, 2)"
            >配置</a
          >
        </div>
      </span>

      <!-- 门诊随诊 -->
      <span slot="mzszaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.menzhen"
            :title="record.menzhen && record.menzhen.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'menzhen')"
          >
            <a-switch
              v-if="record.menzhen"
              :disabled="!record.menzhen || record.userType == 'nurse'"
              size="small"
              :checked="record.menzhen ? record.menzhen.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.menzhen" class="tuoyuan" @click="showMessage(record, 5)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" style="margin-top: 3px" />
          <a v-if="!record.menzhen" @click="showMessage(record, 5)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a
            :disabled="record.userType == 'nurse'"
            v-if="record.menzhen"
            style="margin-left: 5px"
            @click="$refs.fzmzConfig.editmodal(record, 2)"
            >配置</a
          >
        </div>
      </span>

      <!-- 特需心理咨询 -->
      <span slot="txzxaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
            v-if="record.texu"
            :title="record.texu && record.texu.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'texu')"
          >
            <a-switch
              v-if="record.texu"
              :disabled="!record.texu"
              size="small"
              :checked="record.texu ? record.texu.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.texu" class="tuoyuan" @click="showMessage(record, 6)">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.texu" @click="showMessage(record, 6)" style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a v-if="record.texu" style="margin-left: 5px" @click="$refs.texuConfig.editmodal(record, 3)">配置</a>
        </div>
      </span>

      <!-- 康复随访  开关不让点击-->
      <span slot="kfsfaction" slot-scope="text, record">
        <div style="display: flex; flex-direction: row; align-items: center; white-space: nowrap">
          <a-popconfirm
           :disabled="true"
            v-if="record.kangfu"
            :title="record.kangfu && record.kangfu.stopStatus == 2 ? '确认停用？' : '确认启用？'"
            placement="topRight"
            @confirm="updatePkgStatusOut(record, 'kfsf')"
          >
            <a-switch
              v-if="record.kangfu"
              :disabled="!record.kangfu"
              size="small"
              :checked="record.kangfu ? record.kangfu.stopStatus == 2 : false"
            />
          </a-popconfirm>

          <div v-if="!record.kangfu" class="tuoyuan">
            <div class="yuan"></div>
          </div>

          <div
            style="width: 2px; height: 13px; background: #4d4d4d; margin-left: 5px; margin-right: 5px; margin-top: 2px"
          ></div>

          <a-icon type="setting" />
          <a v-if="!record.kangfu"  style="margin-left: 5px; color: #4d4d4d">配置</a>
          <a v-if="record.kangfu" style="margin-left: 5px" @click="$refs.kfsfConfig.kfsfmodal(record)">配置</a>
        </div>
      </span>
    </s-table>

    <texu-Config ref="texuConfig" @ok="handleOk" />
    <fzmz-Config ref="fzmzConfig" @ok="handleOk" />
    <tuWen-Config ref="tuWenConfig" @ok="handleOk" />
    <phone-Config ref="phoneConfig" @ok="handleOk" />
    <kfsf-Config ref="kfsfConfig" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'

import {
  accessHospitals1,
  getDeptListByType,
  searchArrangeDoctors,
  updatePkgStatus,
} from '@/api/modular/system/posManage'
import texuConfig from './texuConfig.vue'
import fzmzConfig from './fzmzConfig.vue'
import tuWenConfig from './tuWenConfig.vue'
import phoneConfig from './phoneConfig.vue'
import kfsfConfig from './kfsfConfig.vue'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    texuConfig,
    fzmzConfig,
    tuWenConfig,
    phoneConfig,
    kfsfConfig,
  },
  data() {
    return {
      user: {},
      originData: [],
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      selectDepartmentId: undefined,
      queryParams: {
        departmentId: undefined,
        hospitalCode: undefined,
        queryText: '',
        status: 0,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      requestDeptList: {
        hospitalCode: '',
        internet: 1,
        type: 0,
      },

      // 表头
      columns: [
        {
          title: '医生姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userNameaction' },
        },

        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },

        {
          title: '复诊续方',
          dataIndex: 'fzxfaction',
          scopedSlots: { customRender: 'fzxfaction' },
          align: 'center',
        },

        {
          title: '特需心理咨询',
          dataIndex: 'txzxaction',
          scopedSlots: { customRender: 'txzxaction' },
          align: 'center',
        },

        {
          title: '图文咨询',
          dataIndex: 'twzxaction',
          scopedSlots: { customRender: 'twzxaction' },
          align: 'center',
        },

        {
          title: '电话咨询',
          dataIndex: 'dhzxaction',
          scopedSlots: { customRender: 'dhzxaction' },
          align: 'center',
        },

        {
          title: '视频咨询',
          dataIndex: 'spzxaction',
          scopedSlots: { customRender: 'spzxaction' },
          align: 'center',
        },

        {
          title: '门诊随诊',
          dataIndex: 'mzszaction',
          scopedSlots: { customRender: 'mzszaction' },
          align: 'center',
        },

        {
          title: '康复随访',
          dataIndex: 'kfsfaction',
          scopedSlots: { customRender: 'kfsfaction' },
          align: 'center',
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return searchArrangeDoctors(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data.rows) {
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.totalRows,
              totalPage: res.data.totalRows / parameter.pageSize,
              rows: res.data.rows,
            }

            data.rows.forEach((item, index) => {
              if (item.arrangeInfos) {
                item.arrangeInfos.forEach((item1, index) => {
                  // this.$set(item, 'userType', 'nurse')
                  if (item1.arrangeType == 'guide') {
                    //门诊随诊
                    this.$set(item, 'menzhen', item1)
                  } else if (item1.arrangeType == 101) {
                    //图文咨询
                    this.$set(item, 'tuwen', item1)
                  } else if (item1.arrangeType == 102) {
                    //电话咨询
                    this.$set(item, 'dianhua', item1)
                  } else if (item1.arrangeType == 103) {
                    //视频咨询
                    this.$set(item, 'shipin', item1)
                  } else if (item1.arrangeType == 'register') {
                    //复诊
                    this.$set(item, 'fuzhen', item1)
                  } else if (item1.arrangeType == 'psychology') {
                    //特需心理咨询
                    this.$set(item, 'texu', item1)
                  }else if (item1.arrangeType == 120) {
                    //康复随访
                    this.$set(item, 'kangfu', item1)
                  }
                })
              }
            })
          }
          return data
        })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined) //所属机构
  },
  methods: {
    showMessage(record, type) {
      // console.log("dddd:",record)
      if (record.userType != 'nurse') {
        this.$message.error('请先初始化!')
      } else {
        if (type == 2 && !record.tuwen) {
          this.$message.error('请先初始化!')
        }
        if (type == 6) {
          this.$message.error('请先初始化!')
        }
      }
    },

    /**
      * 
      * statusValue	integer($int32)
        状态值：1关2开
        updateType	integer($int32)
        修改状态类型：0上架1推荐2停用
      * 
      * @param {*} id 
      * @param {*} statusValue statusValue  传过来的是当前的状态
      * @param {*} updateType 
      */
    updatePkgStatusOut(record, type) {
      let data = {}
      if (type == 'fuzhen') {
        data = {
          id: record.fuzhen.commodityId,
          statusValue: record.fuzhen.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.fuzhen.stopStatus = record.fuzhen.stopStatus == 2 ? 1 : 2
      } else if (type == 'tuwen') {
        data = {
          id: record.tuwen.commodityId,
          statusValue: record.tuwen.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.tuwen.stopStatus = record.tuwen.stopStatus == 2 ? 1 : 2
      } else if (type == 'dianhua') {
        data = {
          id: record.dianhua.commodityId,
          statusValue: record.dianhua.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.dianhua.stopStatus = record.dianhua.stopStatus == 2 ? 1 : 2
      } else if (type == 'shipin') {
        data = {
          id: record.shipin.commodityId,
          statusValue: record.shipin.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.shipin.stopStatus = record.shipin.stopStatus == 2 ? 1 : 2
      } else if (type == 'menzhen') {
        data = {
          id: record.menzhen.commodityId,
          statusValue: record.menzhen.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.menzhen.stopStatus = record.menzhen.stopStatus == 2 ? 1 : 2
      } else if (type == 'texu') {
        data = {
          id: record.texu.commodityId,
          statusValue: record.texu.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.texu.stopStatus = record.texu.stopStatus == 2 ? 1 : 2
      }else if (type == 'kfsf') {
        data = {
          id: record.kangfu.commodityId,
          statusValue: record.kangfu.stopStatus == 2 ? 1 : 2,
          updateType: 2,
        }
        record.kangfu.stopStatus = record.kangfu.stopStatus == 2 ? 1 : 2
      }

      updatePkgStatus(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          //   this.handleOk()
        } else {
          this.$message.error('操作失败：' + res.message)
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
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   accessHospitals(queryData)
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

    queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      accessHospitals1(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParams.hospitalCode = item.hospitalCode
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
        this.treeData = []
        this.localHospitalCode = undefined
        this.queryHospitalListOut(undefined)
      }
    },

    selectHospital(code) {
      console.log('DDDD:', code)
      this.requestDeptList.hospitalCode = code
      this.getDeptListByTypeOut()
    },

    getDeptListByTypeOut() {
      if (this.requestDeptList.hospitalCode) {
        this.confirmLoading = true
        getDeptListByType(this.requestDeptList)
          .then((res) => {
            this.originData = res.data
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      }
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams.hospitalCode = undefined
      this.queryParams.departmentId = undefined
      this.queryParams.queryText = ''

      this.$refs.table.refresh(true)
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
<style lang="less">
.x-table .ant-table td {
  white-space: nowrap;
}
</style>
    <style lang="less" scoped>
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}

.tuoyuan {
  width: 28px;
  height: 16px;
  background: #d9d9d9;
  border-radius: 10px;
  margin-top: 1px;

  .yuan {
    width: 14px;
    height: 13px;
    background: #ffffff;
    border-radius: 50%;
    margin-left: 2px;
    margin-top: 1px;
  }
}

.table-page-search-wrapper {
  padding-bottom: 20px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
    <style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
    
    
    
