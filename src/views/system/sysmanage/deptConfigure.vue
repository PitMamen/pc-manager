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



        <div class="div-line-wrap" v-for="(item,index) in deptList" :key="item.departmentId + ''">  
            <!-- <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback> -->
          <div class="global-search-wrapper" style="width: 200px; margin-top: 3%; display: inline-block">
            <a-input
                  v-model="item.departmentName"
                  
                  allow-clear
                  placeholder="请输入科室名称"
                />
            <!-- <a-auto-complete
              class="global-search"
              size="large"
              v-model="item.departmentName"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择科室名称"
              option-label-prop="title"
              @select="onSelect"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in keshiDataTemp"
                  :key="item.departmentId + ''"
                  :title="item.departmentName"
                >
                  {{ item.departmentName }}
                </a-select-option>
              </template>
            </a-auto-complete> -->
          </div>

          <div class="global-search-wrapper"  style="width: 200px; margin-top: 3%; margin-left: 20px; display: inline-block">

            <a-input
                  v-model="item.departmentCode"
                  allow-clear
                  placeholder="请输入科室编码"
                />

            <!-- <a-auto-complete
              class="global-search"
              size="large"
              v-model="item.departmentId"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择科室编码"
              option-label-prop="title"
              @select="onSelect"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in keshiDataTemp"
                  :key="item.departmentId + ''"
                  :title="item.departmentName"
                >
                  {{ item.departmentName }}
                </a-select-option>
              </template>
            </a-auto-complete> -->
          </div>
          <a-button style="margin-left:20px" type="danger" @click="deleteDept(index)" >删除</a-button>
          

        <!-- </a-form-item> -->
        </div>
        <a-button class="btn-add" style="margin-top: 2%; margin-left: 28%" type="primary" @click="addItem">添加</a-button>
      </div>
    </a-spin>


    </a-modal>
  </template>
  
  
  <script>
  import {getDepts,getDepartmentAttr,delDepartmentAttr,saveOrUpdateDepartmentAttr } from '@/api/modular/system/posManage'
  
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
        deptList:[{
            departmentId:'0',
            departmentName:"精神科",
        }],
        queryParams: {
        belong: "",
        departmentName: "",
        topFlag: "",
        departmentCode: "",
        // isRegister: '1',
      },
        goodsAttrFullp:[],
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
        console.log('科室ID啊', this.record.departmentId)
        getDepartmentAttr(this.record.departmentId)
        // this.getDeptsOut()
      },
  
//   删除
      deleteDept(index){
        if(this.deptList.length<=1){
            this.$message.error('至少配置一个科室')
            return
        }
        this.deptList.splice(index,1)
      },


      getDepartmentAttr(record){
        getDepartmentAttr().then((res)=>{
            if(res.code==0){

            }
        })
      },



  /**
     * 添加条目时不能重复，需要处理
     */
     addItem() {
        this.deptList.push({
            departmentId:'1',
            departmentName:"骨科",
        })
        this.chooseDeptItem = this.deptList[0]

    //   if (this.deptList.length >= this.goodsAttrFull.length) {
    //     this.$message.error('目前仅支持' + this.goodsAttrFull.length + '种服务类型！')
    //     return
    //   }

    //   let newName = this.getNewOne()
    //   let item = this.goodsAttrFull.find((item) => {
    //     return item.name == newName
    //   })
    //   this.goodsAttr.push(JSON.parse(JSON.stringify(item)))
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
        const {
          form: { validateFields },
        } = this
        if (!this.chooseDeptItem.departmentId) {
          this.$message.error('请选择科室')
          return
        }
        this.confirmLoading = true
  
      },
      handleCancel() {
        this.form.resetFields()
        this.visible = false
        this.record = {}
      },
    },
  }
  </script>
  