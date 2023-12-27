<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">机构名称:</span>
        <a-input
          allow-clear
          v-model="queryParams.hospitalName"
          placeholder="请输入机构名称查询"
          style="width: 230px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <!-- <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button> -->
        </span>
      </div>
    </div>

    <s-table
      bordered
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.id"
    >
      <span v-if="saveData.hospitalCode == record.hospitalCode " slot="consultorderprescription_hospital_name" slot-scope="text, record">
        <div class="editable-cell-input-wrapper">
          <!-- <a-tree-select
            v-model="saveData.consultorderprescriptionHospitalCode"
            style="width: 100%"
            :tree-data="treeData"
            placeholder="请选择"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select> -->


          <a-select
          v-model="saveData.consultorderprescriptionHospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 100%"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>





        </div>
      </span>
      <span v-else slot="consultorderprescription_hospital_name">
        <div class="editable-cell-input-wrapper">
          {{ record.consultorderprescription_hospital_name }}
        </div>
      </span>

      <span v-if="saveData.hospitalCode == record.hospitalCode " slot="apppreprescription_hospital_name" slot-scope="text, record">
        <div class="editable-cell-input-wrapper">
          <!-- <a-tree-select
            v-model="saveData.apppreprescriptionHospitalCode"
            style="width: 100%"
            :tree-data="treeData"
            placeholder="请选择"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select> -->
          <a-select
          v-model="saveData.apppreprescriptionHospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 100%"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
        </div>
      </span>
      <span v-else slot="apppreprescription_hospital_name">
        <div class="editable-cell-input-wrapper">
          {{ record.apppreprescription_hospital_name }}
        </div>
      </span>

      <span v-if="saveData.hospitalCode == record.hospitalCode " slot="action" slot-scope="text, record">
        <a-icon type="save" style="color: #1890ff; margin-right: 3px" />
        <a @click="saveBtn(record)">保存</a>
        <a-divider type="vertical" />
        <a-icon type="close" style="color: #1890ff; margin-right: 3px" />
        <a @click="cancelBtn(record)">取消</a>
      </span>

      <span v-else slot="action" slot-scope="text, record">
        <a-icon type="edit" style="color: #1890ff; margin-right: 3px" />
        <a @click="showEdit(record)">配置</a>
      </span>
    </s-table>
    <collectionfig ref="collectionfig" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'

import { accessHospitalsNew1, getCflzMerchantPageList ,prescriptionFlowConfig} from '@/api/modular/system/posManage'
import collectionfig from './collectionfig'

export default {
  components: {
    STable,
    collectionfig,
  },
  data() {
    return {
      fetching: false,
      user: {},
      queryParams: {
        hospitalName: undefined,
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
      },
      saveData: {
        apppreprescriptionHospitalCode: undefined,
      
        consultorderprescriptionHospitalCode: undefined,
       
        hospitalCode: undefined,
      },
      treeData: [],
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

      classData: [],
      pageNo:0,
      refreshCurrentPage:true,
      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '在线咨询处方',
          dataIndex: 'consultorderprescription_hospital_name',
          scopedSlots: { customRender: 'consultorderprescription_hospital_name' },
        },
        {
          title: '本院复诊处方',
          dataIndex: 'apppreprescription_hospital_name',
          scopedSlots: { customRender: 'apppreprescription_hospital_name' },
        },

        {
          title: '操作',
          // fixed: 'right',
          width: 140,
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log(parameter)
        if(this.refreshCurrentPage){
          parameter.pageNo=this.pageNo
        }
        return getCflzMerchantPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data && res.data.records.length > 0) {
            //组装控件需要的数据结构
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }
            data.rows.forEach((item, index) => {
              var configData = item.configData || {}
              this.$set(item, 'apppreprescription_hospital_code', configData.apppreprescription_hospital_code || '')
              this.$set(item, 'apppreprescription_hospital_name', configData.apppreprescription_hospital_name || '')
              this.$set(item,'consultorderprescription_hospital_code',configData.consultorderprescription_hospital_code || '')
              this.$set( item,'consultorderprescription_hospital_name', configData.consultorderprescription_hospital_name || '' )
            })

            this.pageNo=data.pageNo
          }
          this.refreshCurrentPage=false
          return data
        })
      },

      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未上架',
        },
        {
          id: 2,
          name: '已上架',
        },
      ],
    }
  },

  mounted() {},

  watch: {},

  created() {
    this.queryHospitalListOut(undefined)
  },
  methods: {
    // queryHospitalListOut(name) {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: name,
    //     orgTypes: '2,3',
    //   }
    //   this.confirmLoading = true
    //   accessHospitalsNew1(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         // res.data.forEach((item, index) => {
    //         //   this.$set(item, 'key', item.hospitalCode)
    //         //   this.$set(item, 'value', item.hospitalCode)
    //         //   this.$set(item, 'title', item.hospitalName)
    //         //   this.$set(item, 'children', item.hospitals)

    //         //   item.hospitals.forEach((item1, index1) => {
    //         //     this.$set(item1, 'key', item1.hospitalCode)
    //         //     this.$set(item1, 'value', item1.hospitalCode)
    //         //     this.$set(item1, 'title', item1.hospitalName)
    //         //   })
    //         // })

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
      accessHospitalsNew1(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                // this.queryParams.hospitalCode = item.hospitalCode
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









    showEdit(record){
      this.initSaveData()
      var configData=record.configData || {}
      this.saveData.apppreprescriptionHospitalCode=configData.apppreprescription_hospital_code
      this.saveData.consultorderprescriptionHospitalCode=configData.consultorderprescription_hospital_code
      this.saveData.hospitalCode = record.hospitalCode
    },
    saveBtn(record) {
      if(!this.saveData.hospitalCode){
       
        return
      }
      var post=this.saveData
      if(!this.saveData.consultorderprescriptionHospitalCode){
        post.consultorderprescriptionHospitalCode=''
      }
      if(!this.saveData.apppreprescriptionHospitalCode){
        post.apppreprescriptionHospitalCode=''
      }
      
      this.confirmLoading = true
      prescriptionFlowConfig(post)
        .then((res) => {
          if (res.code == 0 ) {
           
            this.$message.success('保存成功')

            this.refreshCurrentPage=true
            this.refresh()
            this.initSaveData()
          } else {
            this.$message.error(res.message)
          }
        
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
    cancelBtn(record) {
      this.initSaveData()
    
    },

    initSaveData(){
      this.saveData={
        apppreprescriptionHospitalCode: undefined,
      
        consultorderprescriptionHospitalCode: undefined,
       
        hospitalCode: undefined,
      }
    },

    handleOk() {
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh(true)
    },

    editPlan(record) {
      this.$router.push({
        name: 'package_config_edit',
        query: {
          recordStr: JSON.stringify(record),
        },
      })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.refresh()
    },
  },
}
</script>
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
  
  <!-- tree-select限制高度 -->
  <style>
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
</style>

<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
  
  