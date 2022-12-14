<template>
  <a-modal
    title="管理科室"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part" style="margin-top:0px">
        <div class="div-part-left">
          <div class="left-content1" style="margin-bottom: 20px" v-for="(item, index) in appListOut" :key="index">
            <div class="div-content" style="margin-left: 0px">
              <a-checkbox
                style="margin-left: 0px"
                v-model="item.isChecked"
                @change="checkBoxselectChange(item)"
                :disabled="item.applicationId != 1"
              ></a-checkbox>
              <span class="span-item-value" style="font-size: 14px; margin-top: 0px; margin-left: 10px; color: #4d4d4d"
                >{{ item.applicationName }}
              </span>
            </div>

            <div class="div-content" style="margin-left: -10px">
              <span class="span-item-name" style="margin-left:-5px">已选科室:</span>
              <a-select
                allow-clear
                :disabled="item.applicationId != 1"
                :value="item.applicationId == 1 ? selectedRowKeys : item.selectedRowKeyids"
                placeholder="请在表格中勾选科室"
                dropdownClassName="select-tags-hidden"
                :maxTagCount="1"
                :collapse-tags="true"
                mode="multiple"
                style="height: 28px; width: 230px; margin-left: 0px"
                @change="ksSelectChange"
              >
                <a-select-option v-for="(item, index) in allDepartList" :key="index" :value="item.department_id">{{
                  item.department_name
                }}</a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <!-- 右 -->
        <div class="div-part-right">
          <div class="div-content" style="margin-top: 0px">
            <span class="span-item-name">查询条件:</span>
            <a-input
              class="span-item-value"
              v-model="queryParams.departmentName"
              style="display: inline-block"
              allow-clear
              placeholder="可输入科室名称后回车查询"
              @change="onInputChange"
            />
          </div>

          <s-table
            ref="table"
            size="default"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columnsDept"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.department_id"
          >
            <!-- <span slot="statuas" slot-scope="text, record">
          <a-switch  :checked="record.enableStatus" />
        </span> -->
          </s-table>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
  
  
  <script>
import { STable } from '@/components'
import {
  getApplicationlist,
  getRoleList,
  getDepts,
  getDepartmentListForReq,
  getManagerDepts,
  updateManagerDepts,
} from '@/api/modular/system/posManage'
import { idCardValidity, phoneValidity, emailValidity } from '@/utils/validityUtils'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: { STable },
  data() {
    return {
      hospitalCode:'',
      accountId:'',
      isChecked: false,
      visible: false,
      headers: {},
      appList: [],
      appListOut: [],
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      treeData: [],
      checkData: {
        account: '', //登录账号
        userId: '', //对应人员
        name: '',
        tel: '',
        role: undefined, //分配角色
        zuoxi: '', //坐席
      },

      queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      accountChecked: false, //客服坐席

      roleList: [], //角色列表
      selectedRowKeys: [],
      // 表头
      columnsDept: [
        {
          title: '科室名称',
          dataIndex: 'department_name',
        },

        {
          title: '科室类型',
          dataIndex: 'department_type',
        },
      ],
      allDepartList: [],
      queryParams: {
        departmentName: '',
        hospitalCode:'',
        parentDisarmamentId: '',
        status: 1,
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDepartmentListForReq(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: res.data.current,
              pageSize: res.data.size,
              totalRows: res.data.total,
              totalPage: res.data.total / res.data.size,
              rows: res.data.records,
            }
            return data
          }
        })
      },
    }
  },
  created() {},
  methods: {
    clearData() {},
    //科室管理
    assdepartmanage(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.accountId = record.accountId
      this.queryParams.hospitalCode = record.hospitalCode
      this.hospitalCode = record.hospitalCode
      this.visible = true
      this.confirmLoading = false

      if (this.$refs.table) {
        this.reset()
      }
      // this.getApplicationlistOut()
      this.getManagerDeptsOut()

      getDepartmentListForReq({
        departmentName: '',
        pageNo: 1,
        pageSize: 10000,
        parentDisarmamentId: '',
        status: 1,
        hospitalCode:this.hospitalCode,
      }).then((res) => {
        if (res.code == 0) {
          this.allDepartList = res.data.records
        }
      })
    },


    clearData(){
     this.selectedRowKeyids=[]
     this.selectedRowKeys = []
     this.queryParams.departmentName =""

    },


    modalChange(record, id) {
      if (id == 1) {
        return this.selectedRowKeys
      } else {
        return record.selectedRowKeys
      }
    },

    getManagerDeptsOut() {
      getManagerDepts({ accountId: this.accountId }).then((res) => {
        if (res.code == 0) {
          if (res.data.items) {
            this.appList = res.data.items

            this.appListOut = JSON.parse(JSON.stringify(this.appList))
            this.appListOut.forEach((item, index) => {
              this.$set(item, 'isChecked', item.deptInfos ? true : false)
              this.$set(item, 'selectedRowKeyids', [])
              if(item.deptInfos){
                item.deptInfos.forEach((item1, index1) =>{
                 this.selectedRowKeys.push(item1.deptId)
                 console.log("0000:",this.selectedRowKeys)
                })
              }
            })
            this.updateSelect()
          }

        }
      })
    },

    //checkbox 选择
    checkBoxselectChange(item) {
      this.isChecked = item.isChecked
      //  console.log("检查：",this.isChecked )
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    ksSelectChange(values) {
      console.log(values)

      this.selectedRowKeys = values
      this.updateSelect()
    },
    onInputChange() {
      this.$refs.table.refresh(true)
    },
    updateSelect() {
      this.$refs.table.updateSelect(this.selectedRowKeys, [])
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

    reset() {
        this.$refs.table.refresh(true)
    },
    handleSubmit() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请选择科室')
        return
      }
      this.confirmLoading = true
      let selectIds = JSON.parse(JSON.stringify(this.selectedRowKeys))
      var items = []
      items.push({
        "applicationId": 1,
        "deptIds": selectIds,
      })

      var queryParamsData = {
        // accountId: this.accountId,
        accountId: this.accountId,
        items: items,
      }
      updateManagerDepts(queryParamsData).then((res) => {
        if (res.code == 0) {
          this.$message.success('关联科室成功！')
          this.visible = false
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
  height: 475px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 50%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 50%;
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
      //   flex: 1;
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

  .left-content1 {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
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
  