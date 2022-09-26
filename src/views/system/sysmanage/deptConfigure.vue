<template>
  <a-modal
    title="科室配置"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail" id="printContent">
        <div class="div-line-wrap">
          <span class="span-item-name"> 请输入门诊科室(需从HIS中获取)</span>
          <span class="span-item-name" style="margin-left: 3%"> 请输入对应科室编码(需从HIS中获取)</span>
        </div>

        <div class="div-line-wrap" v-for="(item, index) in deptList" :key="item.departmentId + ''">
          <!-- <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback> -->
          <div class="global-search-wrapper" style="width: 200px; margin-top: 3%; display: inline-block">
            <a-input v-model="item.departmentName" allow-clear placeholder="请输入科室名称" />
          </div>

          <div
            class="global-search-wrapper"
            style="width: 200px; margin-top: 3%; margin-left: 20px; display: inline-block"
          >
            <a-input v-model="item.departmentCode" allow-clear placeholder="请输入科室编码" />
          </div>
          <a-button style="margin-left: 20px" type="danger" @click="deleteDept(index)">删除</a-button>

          <!-- </a-form-item> -->
        </div>
        <a-button class="btn-add" style="margin-top: 2%; margin-left: 28%" type="primary" @click="addItem"
          >添加</a-button
        >
      </div>
    </a-spin>
  </a-modal>
</template>
  
  
  <script>
import {
  getDepts,
  getDepartmentAttr,
  delDepartmentAttr,
  saveOrUpdateDepartmentAttr,
} from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      deptList: [
        {
          attrCode: '',
          attrValue: '',
          attrValueExt: '',
          deptId: '',
          id: '',
          remark: '',
        },
      ],
      queryParams: {
        belong: '',
        departmentName: '',
        topFlag: '',
        departmentCode: '',
        // isRegister: '1',
      },
      departmentId:'',
      goodsAttrFullp: [],
      record: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],
    }
  },

  created() {},

  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = record
      this.departmentId = record.departmentId
      this.getDepartmentAttr(this.record.departmentId)
      // this.getDeptsOut()
    },

    //   删除科室属性
    deleteDept(index) {
      if (this.deptList.length <= 1) {
        this.$message.error('至少配置一个科室')
        return
      }
      this.deptList.splice(index, 1)
      delDepartmentAttr(index.id).then((res)=>{
         if(res.code==0){

         }
      })

    },

    //查询科室属性
    getDepartmentAttr(deptId) {
      getDepartmentAttr({ deptId: deptId }).then((res) => {
        if (res.code == 0) {
        }
      })
    },

    //添加科室属性
    addDepartmentAttr(list) {
      saveOrUpdateDepartmentAttr(list).then((res) => {
        if (res.code == 0) {
        }
      })
    },

    /**
     * 添加条目时不能重复，需要处理
     */
    addItem() {
      this.deptList.push({
        attrCode: '1',
        attrValue: '骨科',
        deptId:this.departmentId,
      })
      this.chooseDeptItem = this.deptList[0]
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    onSelect(departmentId) {
      //选择类别
      // this.uploadData.belong = departmentId
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
    },

    handleSubmit() {
     if(this.deptList.length<=0){
        this.$message.error('至少配置一个科室')
        return
     }

     this.addDepartmentAttr(this.deptList)


    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
      this.record = {}
    },
  },
}
</script>
  