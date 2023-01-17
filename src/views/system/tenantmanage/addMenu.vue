<template>
    <a-modal
      :title="title"
      :width="730"
      :visible="visible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <div class="div-service-user">
        <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 所属机构 :</span>
        <a-tree-select
        v-model="queryParams.hospitalCode"
        style="min-width: 248px;margin-left: 5px"
        :tree-data="treeData"
        placeholder="请选择"
        tree-default-expand-all
      >
      </a-tree-select>
  
        <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
          ><span style="color: red">*</span> 所属应用 :</span
        >
        <a-select
          style="min-width: 248px; margin-left: 5px"
          v-model="queryParams.sysApplicationId"
          allow-clear
          placeholder="请选择所属应用"
        >
        <a-select-option v-for="item in appList" :key="item.id" :value="item.id">{{
            item.applicationName
          }}</a-select-option>
        </a-select>
      </div>
  
      <div class="div-service-user" style="margin-top: 10px">
        <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 菜单名称 :</span>
        <a-input
          class="span-item-value"
          v-model="queryParams.menuName"
          :maxLength="30"
          style="display: inline-block; width: 248px; margin-left: 5px"
          allow-clear
          placeholder="请输入菜单名称 "
        />
         
  
        <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"><span style="color: red">*</span> 菜单类型 :</span
        >
        <a-select
          style="min-width: 248px; margin-left: 5px"
          v-model="queryParams.menuType"
          allow-clear
          placeholder="请选择菜单类型"
        >
          <a-select-option v-for="(item, index) in departmentTypeList" :key="index" :value="item.code">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
  


      <div class="div-service-user" style="margin-top:10px">

        <span  style="margin-top: 5px;margin-left: 23px;"><span style="color: red">*</span> 图标 :</span>
            <div class="avator-right">
              <a-upload
                name="file"
                action="/api/content-api/fileUpload/uploadImgFile"
                :headers="headers"
                :before-upload="beforeUpload"
                accept="image/jpeg,image/png,image/jpg"
                @change="handleChangeSort"
                :showUploadList="false"
              >
                <a-button style="margin-left:6px;width: 100px;">
                  <a-icon type="upload" />
                  上传图标
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 6px;margin-left: 5px;">支持扩展名：.png .jpge .jpg</span>
            </div>



            <!-- 长图标 -->
            <span v-if="queryParams.menuType==1"  style="margin-top: 5px;margin-left: 34px;"><span style="color: red">*</span> 长图标 :</span>
            <div v-if="queryParams.menuType==1" class="avator-right">
              <a-upload
                name="file"
                action="/api/content-api/fileUpload/uploadImgFile"
                :headers="headers"
                :before-upload="beforeUpload"
                accept="image/jpeg,image/png,image/jpg"
                @change="handleChangeLong"
                :showUploadList="false"
              >
                <a-button style="margin-left:6px;width: 100px;">
                  <a-icon type="upload" />
                  上传图标
                </a-button>
              </a-upload>
              <span v-if="queryParams.menuType==2" style="font-size: 12px; color: #999999; margin-top: 6px;margin-left: 5px;">支持扩展名：.png .jpge .jpg</span>
            </div>
          </div>



  
      <div class="display-item" style="margin-left: -2px; margin-top: 10px">
        <span style="margin-top: 10px"><span style="color: red">* </span> 跳转类别 :</span>
        <a-radio-group style="margin-left:5px" name="radioGroup" v-model="queryParams.jumpType">
              <a-radio :value="1"> 小程序内 </a-radio>
              <a-radio :value="2" style="margin-left: 15px"> 第三方小程序 </a-radio>
              <a-radio :value="3" style="margin-left: 15px"> 第三方链接 </a-radio>
            </a-radio-group>
      </div>





  
      <div v-if="queryParams.jumpType=='2'" class="div-service-user" style="margin-top: 10px; margin-left: 10px; position: relative">
        <span style="margin-top: 10px; "> <span style="color: red">* </span>APPID :</span>
        <a-input
          class="span-item-value"
          v-model="queryParams.appId"
          style="display: inline-block; width: 88%; margin-left: 7px;margin-top: 5px;"
          allow-clear
          placeholder="请输入appid"
        />
      </div>


      <div class="div-service-user" style="margin-top: 10px; margin-left: -2px; position: relative">
        <span style="margin-top: 10px; "> <span style="color: red">* </span>跳转链接 :</span>
        <a-input
          class="span-item-value"
          v-model="queryParams.jumpUrl"
          style="display: inline-block; width: 88%; margin-left: 7px;margin-top: 5px;"
          allow-clear
          placeholder="请输入跳转配置"
        />
      </div>


    </a-modal>
  </template>
          
          <script>
  import moment from 'moment'
  import {
    queryHospitalList,
    addTdShopmallMainpageMenu,
    getApplicationlist,
  } from '@/api/modular/system/posManage'
  import { STable } from '@/components'
  import { formatDate, formatDateFull } from '@/utils/util'
  import E from 'wangeditor'
  import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { appId } from '@/utils/util'
  // import { nextTick } from 'vue/types/umd'
  export default {
    components: {
      STable,
    },
    data() {
      return {
        appList:[],
        treeData: [],
        findItemData: {},

        queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },
        queryParams: {
          hospitalCode: undefined,
          sysApplicationId: undefined,
          menuName:'',
          menuType: undefined,
          jumpType:'0',
          jumpUrl:'',
          appId:'',
          icon:'',
          iconLong:'',
          status:1,
        },
  
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
        },
        headers: {},
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        title: '新增菜单',
  
        departmentTypeList: [
          { code: 1, name: '置顶菜单' },
          { code: 2, name: '常规菜单' },
        ],
      }
    },



  
    methods: {
      moment,
      //初始化方法
      addmenu(record) {
        this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
        this.visible = true
        this.reset()
        this.queryHospitalListOut()
        this.getApplicationlistOut()
      },


       /**
     * 查询应用列表
     */
    getApplicationlistOut() {
      this.confirmLoading = true
      getApplicationlist(this.queryParamsApp)
        .then((res) => {
          if (res.code == 0) {
            this.appList = res.data
            // this.appListOut = JSON.parse(JSON.stringify(this.appList))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
  
      onSelect(hospitalId) {
        //选择类别
        console.log('选择类别:', hospitalId)
        for (let index = 0; index < this.treeData.length; index++) {
          if (hospitalId == this.treeData[index].hospitalId) {
            this.findItemData = JSON.parse(JSON.stringify(this.treeData[index]))
            break
          }
          if (this.treeData[index].children && this.treeData[index].children.length > 0) {
            for (let indexIn = 0; indexIn < this.treeData[index].children.length; indexIn++) {
              if (hospitalId == this.treeData[index].children[indexIn].hospitalId) {
                this.findItemData = JSON.parse(JSON.stringify(this.treeData[index].children[indexIn]))
                break
              }
            }
          }
        }
        this.queryParams.parentDisarmamentName = this.findItemData.hospitalName
      },

      beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('请选择正确的图片格式')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M')
        return false
      }
      return true
    },


    /**
     * 短图标 
     */
    handleChangeSort(changeObj) {
      console.log("MMM000",changeObj)
      if (changeObj.file.status == 'done') {
        if (changeObj.file.response.code != 0) {
          this.$message.error(changeObj.file.response.message)
        } else {
          if (changeObj.fileList.length == 0) {
            this.queryParams.icon = ''
          } else {
            this.queryParams.icon = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
            this.$message.success("图片上传成功!")
          }
        }
      }

      console.log('icon:' + this.queryParams.icon)
    },



    /**
     * 长图标
     */
     handleChangeLong(changeObj){
      console.log("MMM111",changeObj)
      if (changeObj.file.status == 'done') {
        if (changeObj.file.response.code != 0) {
          this.$message.error(changeObj.file.response.message)
        } else {
          if (changeObj.fileList.length == 0) {
            this.queryParams.iconLong = ''
          } else {
            this.queryParams.iconLong = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
            this.$message.success("图片上传成功!")
          }
        }
      }

      console.log('iconLong:' + this.queryParams.iconLong)
    },

  
      /**
       * 所属机构接口
       */
      /**
       *
       * @param {}
       */
      queryHospitalListOut() {
        let queryData = {
          tenantId: '',
          status: 1,
          hospitalName: '',
        }
        this.confirmLoading = true
        queryHospitalList(queryData)
          .then((res) => {
            if (res.code == 0 && res.data.length > 0) {
              res.data.forEach((item, index) => {
                this.$set(item, 'key', item.hospitalCode)
                this.$set(item, 'value', item.hospitalCode)
                this.$set(item, 'title', item.hospitalName)
                this.$set(item, 'children', item.hospitals)
  
                item.hospitals.forEach((item1, index1) => {
                  this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                  this.$set(item1, 'title', item1.hospitalName)
                })
              })
  
              this.treeData = res.data
            } else {
              this.treeData = res.data
            }
            return []
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      },
  
  
      /***
       * 新增接口调用
       */
       addTdShopmallMainpageMenuOut() {
        this.confirmLoading = true
        console.log("bbb:",this.queryParams)
        addTdShopmallMainpageMenu(this.queryParams)
          .then((res) => {
            if (res.code == 0 && res.success) {
              this.visible = false
              this.$message.success('新增成功')
              this.$emit('ok')
            } else {
              this.$message.error('新增失败:' + res.message)
            }
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      },
  
  
      /**
       * 重置
       */
      reset() {
        this.queryParams.hospitalCode = undefined
        this.queryParams.menuName = ''
        this.queryParams.jumpType = '1'
        this.queryParams.jumpUrl = ''
        this.queryParams.icon = ''
        this.queryParams.iconLong = ''
        this.queryParams.menuType = undefined
        this.queryParams.sysApplicationId = undefined
        this.queryParams.appId = ''
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
        if (!this.queryParams.hospitalCode) {
          this.$message.error('请选择机构')
          return
        }

        if (!this.queryParams.sysApplicationId) {
          this.$message.error('请选择所属应用')
          return
        }
  
        if (!this.queryParams.menuName) {
          this.$message.error('请输入菜单名称')
          return
        }

        if (!this.queryParams.menuType) {
          this.$message.error('请选择菜单类型')
          return
        }

        if(!this.queryParams.icon){
          this.$message.error('请选择上传图标')
          return
        }

        if(this.queryParams.menuType==1){
          if(!this.queryParams.iconLong){
            this.$message.error('请选择上传长图标')
            return
          }
        }


        if(!this.queryParams.jumpType){
          this.$message.error('请选择跳转类型')
          return
        }

       if(this.queryParams.jumpType=='2'){
        if(!this.queryParams.appId){
          this.$message.error('请输入appid')
          return
        }
       }


        if (!this.queryParams.jumpUrl) {
          this.$message.error('请输入跳转链接')
          return
        }

  
        this.addTdShopmallMainpageMenuOut()
      },
    },
  }
  </script>
  
          <style lang="less">

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

  /deep/.ant-col-sm-15 {
    /* display: block; */
    /* -webkit-box-sizing: border-box; */
    /* box-sizing: border-box; */
    width: 69.5%;
  }
  
  /deep/.ant-form-item-control {
    position: relative;
    width: 111%;
    line-height: 40px;
    zoom: 1;
  }
  
  .dddd-r {
    display: flex;
    flex-direction: row;
  
    .domw-r {
      display: flex;
      flex-direction: column;
    }
  }
  
  .div-title {
    margin-top: 10px;
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 98% !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;
  
    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }
  .table-page-wrapper {
    .ant-form-inline {
      .ant-form-item {
        display: flex;
        margin-bottom: 24px;
        margin-right: 0;
  
        .ant-form-item-control-wrapper {
          flex: 1 1;
          display: inline-block;
          vertical-align: middle;
        }
  
        > .ant-form-item-label {
          line-height: 32px;
          padding-right: 8px;
          width: auto;
        }
        .ant-form-item-control {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  
    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }
  }
  </style>
        <style lang="less" scoped>
  .div-service-user {
    display: flex;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .m-count {
      position: absolute;
      font-size: 12px;
      bottom: 2px;
      right: 40px;
    }
  </style>