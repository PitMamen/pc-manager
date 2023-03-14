<template>
  <a-modal
    :title="title"
    :width="700"
    :footer="null"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <div class="display-item">
      <span style="width: 70px">医生姓名:</span>
      <a-input
        :maxLength="20"
        v-model="docName"
        style="width: 200px"
        @blur="searchDoc"
        @keyup.enter="searchDoc"
        @change="change"
        allow-clear
        placeholder="请输入姓名以查询"
      />
      <a-button type="primary" style="margin-left: 20px" icon="search" @click="searchDoc">查询</a-button>
    </div>
    <div class="line"></div>
    <a-table
      ref="table"
      :pagination="false"
      size="default"
      style="margin-left: 2px; height: 450px; margin-top: 20px; margin-bottom: 35px; overflow-y: auto"
      :columns="columns"
      :scroll="{ x: true }"
      :data-source="userInfos"
      :alert="true"
      :rowKey="(record) => record.userId"
      :rowSelection="{ selectedRowKeys: selectedRowKeyArrays, onChange: onSelectChange, type: 'radio' }"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="transferOut(record)"><a-icon style="margin-right: 5px" type="swap"></a-icon>转移</a>
      </span>
    </a-table>

    <!-- <div style="margin-top: 20px; width: 550px" class="div-total1">
      <a-radio-group
        name="radioGroup"
        style="margin-left: 158px"
        v-decorator="['xm', { rules: [{ required: true, message: '请选择姓名！' }] }]"
      >
        <a-radio v-for="(item, index) in userInfos" :key="index" :value="item.userId" @click="checkName(item.userId)">
          {{ item.userName }}
        </a-radio>
      </a-radio-group>
    </div> -->
  </a-modal>
</template>
  
          
  <script>
import { transfer, getUsersByDeptIdsAndRoles } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, formatDateFull } from '@/utils/util'
export default {
  components: {
    STable,
  },
  data() {
    return {
      docName: '',
      rangeValue: 1,
      userInfos: [],
      userInfosTemp: [],
      selectedRowKeyArrays: [],
      selectedRows: [],
      queryParams: {
        doctorUserId: -1,
        ids: [],
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
      title: '任务转移',

      columns: [
        {
          title: '序号',
          // innerHeight:20,
          dataIndex: 'xh',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },

  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeyArrays = selectedRowKeys
      this.selectedRows = selectedRows
      this.queryParams.doctorUserId = this.selectedRows[0].userId
    },

    change(row){
      //触发清空
      if(row.gettype='click'&&row.isTrusted){
        this.userInfos = this.userInfosTemp
      }
    },

    //查询医生
    searchDoc() {
      if (this.docName) {
        var chooseDeptItem = undefined
        if (this.userInfosTemp) {
          chooseDeptItem = this.userInfosTemp.find((item) => item.userName == this.docName)
        }
        if (chooseDeptItem) {
          this.userInfos = []
          this.userInfos.push(chooseDeptItem)
        }
        // this.$refs.table.refresh()

        console.log('LLL:', chooseDeptItem)
      }
    },

    //初始化方法
    transfer(flowids, requestData) {
      this.visible = true
      this.docName = ''
      this.userInfos = []
      this.userInfosTemp = []
      this.selectedRows = []
      this.selectedRowKeyArrays = []
      this.queryParams.ids = flowids
      this.getUsersByDeptIdsAndRolesOutB(requestData) //获取需 转移人的 集合
    },

    /**
     * 随访医生列表
     */
    getUsersByDeptIdsAndRolesOutB(requestData) {
      this.confirmLoading = true
      getUsersByDeptIdsAndRoles(requestData)
        .then((res) => {
          if (res.code == 0 && res.data.userInfos.length > 0) {
            this.userInfos = res.data.userInfos
            this.userInfos.forEach((item, index) => {
              this.$set(item, 'xh', index + 1)
            })
            this.userInfosTemp = JSON.parse(JSON.stringify(this.userInfos))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /***
     * 提交 转移
     */
    transferOut() {
      this.confirmLoading = true
      transfer(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            var resultData = {
              succCount: res.data.succCount,
              failCount: res.data.failCount,
              totalCount: this.queryParams.ids.length,
            }
            this.$emit('ok', resultData)
          }
        })
        .finally((res) => {
          this.visible = false
          this.confirmLoading = false
        })
    },

    /**
     * 选中
     */
    checkName(docId) {
      console.log('hahahah:', docId)
      this.queryParams.doctorUserId = docId
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.transferOut()
    },
  },
}
</script>


 <style lang="less" scoped>
/deep/.ant-radio-wrapper {
  // -webkit-box-sizing: border-box;
  // box-sizing: border-box;
  // margin: 0;
  // padding: 0;
  // color: rgba(0, 0, 0, 0.65);
  // font-size: 14px;
  // font-variant: tabular-nums;
  // line-height: 1.5;
  // list-style: none;
  // -webkit-font-feature-settings: 'tnum';
  // font-feature-settings: 'tnum';
  // position: relative;
  // display: inline-block;
  // margin-right: 28px;
  // white-space: nowrap;
  // cursor: pointer;
  //   vertical-align: sub;
  // margin-bottom: 3px !important;
  box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align: sub;
    outline: none;
    cursor: pointer;
    margin-bottom: 3px !important;
}
</style>

  
  
  <style lang="less">
.display-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  /* // justify-content: center; */
  /* // margin-top: -20px; */
}

.ant-radio-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  margin-right: 28px;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 33px;
}
</style>