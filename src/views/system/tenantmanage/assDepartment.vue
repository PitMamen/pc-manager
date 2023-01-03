<template>
  <a-modal
    title="关联科室"
    :width="484"
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
            <span class="span-item-name">已选科室:</span>
            <a-select
              v-model="selectedRowKeys"
              allow-clear
              placeholder="请在表格中勾选科室"
              dropdownClassName="select-tags-hidden"
              :maxTagCount="2"
              :collapse-tags="true"
              mode="multiple"
              style="height: 28px"
              @change="ksSelectChange"
            >
              <a-select-option v-for="(item, index) in allDepartList" :key="index" :value="item.department_id">{{
                item.department_name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content" style="margin-top: 20px">
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
            <span slot="statuas" slot-scope="text, record">
              <a-switch :checked="record.department_id == defaultId" @change="onDefaultIdChange(record)" />
            </span>
          </s-table>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { STable } from '@/components'
import {
  getDepartmentListForReq,
  updateBelongDepts,
  getBelongDepts,
} from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: { STable },
  data() {
    return {
      visible: false,
      headers: {},
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
      accountChecked: false, //客服坐席
      record: {},
      defaultId: '',
      roleList: [], //角色列表
      rylxList: ['医生', '护士', '药剂师', '医技人员', '后勤人员'], //人员类型
      selectedRowKeys: [],
      // 表头
      columnsDept: [
        {
          title: '科室名称',
          dataIndex: 'department_name',
        },

        {
          title: '科室类型',
          dataIndex: 'department_type_cn',
        },
        {
          title: '默认',
          width: 80,
          scopedSlots: { customRender: 'statuas' },
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
    clearData() {
      this.selectedRowKeys = []
      this.defaultId = ''
    },
    //新增
    addModel(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.record = record
      this.confirmLoading = false

      this.queryParams.hospitalCode=this.record.hospitalCode
      if (this.$refs.table) {
        this.reset()
      }

      getDepartmentListForReq({
        departmentName: '',
        hospitalCode:this.record.hospitalCode,
        pageNo: 1,
        pageSize: 10000,
        parentDisarmamentId: '',
        status: 1,
      }).then((res) => {
        if (res.code == 0) {
          console.log("allDepartList",res.data.records)
          this.allDepartList = res.data.records
        }
      })

      getBelongDepts({
        userId: this.record.userId,
      }).then((res) => {
        if (res.code == 0) {
          res.data.depts.forEach((element) => {
            this.selectedRowKeys.push(element.deptId)
            if (element.isDefault == 1) {
              this.defaultId = element.deptId
            }
          })
          this.updateSelect()
        }
      })
    },
    //默认科室
    onDefaultIdChange(record) {
      if (this.defaultId == record.department_id) {
        return
      }
      let id = this.selectedRowKeys.find((item) => item == record.department_id)
      if (id != record.department_id) {
        this.selectedRowKeys.push(record.department_id)
      }
      this.defaultId = record.department_id
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
     this.saveSelectedRowkeys(selectedRowKeys)
    },
    ksSelectChange(values) {
      console.log(values)

      this.saveSelectedRowkeys(values)
      this.updateSelect()
    },

    saveSelectedRowkeys(selectedRowKeys){
      this.selectedRowKeys = selectedRowKeys
      if (this.selectedRowKeys.length == 1) {
        this.defaultId = this.selectedRowKeys[0]
      } else {
        let id = this.selectedRowKeys.find((item) => item == this.defaultId)
        if (!id) {
          this.defaultId = ''
        }
      }
    },

    onInputChange() {
      this.$refs.table.refresh(true)
    },
    updateSelect() {
      this.$refs.table.updateSelect(this.selectedRowKeys, [])
    },
    
    /**
     * 重置
     */
    reset() {
      
        this.$refs.table.refresh(true)
    },
    handleSubmit() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请选择科室')
        return
      }
      if (!this.defaultId) {
        this.$message.error('请选择默认科室')
        return
      }
      this.confirmLoading = true

      var items = []
    
      this.selectedRowKeys.forEach((el) => {
        var item = {
          deptId: el,
          isDefault: el == this.defaultId ? 1 : 0,
        }
        items.push(item)
      })
      var postData = {
        items: items,
        userId: this.record.userId,
      }
      updateBelongDepts(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('关联科室成功！')
          this.$emit('ok', '')
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
