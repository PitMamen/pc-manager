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
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 上级机构 :</span>
      <!-- <a-tree-select
        v-model="queryParams.hospitalCode"
        style="min-width: 248px; margin-left: 5px"
        :tree-data="treeData"
        placeholder="请选择"
        tree-default-expand-all
      >
      </a-tree-select> -->
      <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="min-width: 248px; margin-left: 5px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
        ><span style="color: red">*</span> 科室名称 :</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParams.departmentName"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 5px"
        allow-clear
        placeholder="请输入科室名称 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 10px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 科室类型 :</span>

      <a-select
        style="min-width: 248px; margin-left: 5px"
        v-model="queryParams.departmentType"
        allow-clear
        placeholder="请选择科室类型"
      >
        <a-select-option v-for="(item, index) in departmentTypeList" :key="index" :value="item.code">{{
          item.value
        }}</a-select-option>
      </a-select>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 50px"> 科室位置 :</span>
      <a-input
        :disabled="queryParams.departmentType == 8"
        class="span-item-value"
        v-model="queryParams.departmentAddr"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 5px"
        allow-clear
        placeholder="请输入科室位置 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 10px">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 10px"> HIS编码 :</span>
      <a-input
        :disabled="queryParams.departmentType == 8"
        type="number"
        class="span-item-value"
        v-model="queryParams.hisId"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 8px"
        allow-clear
        placeholder="请输入HIS编码 "
      />

      <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
        ><span style="color: red">*</span> 科室编码 :</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParams.departmentId"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 5px"
        allow-clear
        placeholder="科室编码 "
      />
    </div>


    <div class="div-service-user" style="margin-top: 10px">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 5px"> 监管编码 :</span>

      <a-select
        style="width: 248px; margin-left: 9px"
        v-model="queryParams.supervisionCode"
        allow-clear
        show-search
        :filter-option="false"
          :not-found-content="fetching ? undefined : null"
        placeholder="请选择科室类型"
        @search="onSelectSearch"
      >
        <a-select-option v-for="(item, index) in treeCodeData" :key="index" :value="item.subjectCode">{{
          item.subjectName
        }}</a-select-option>
      </a-select>
    </div>



    <div class="display-item" style="margin-left: 5px; margin-top: 10px">
      <span style="margin-top: 10px"> 科室属性 :</span>

      <a-checkbox style="margin-left: 10px" @change="radioChange1" :disabled="queryParams.departmentType == 8"
        >互联网医院科室</a-checkbox
      >

      <a-checkbox @change="radioChange2" :disabled="queryParams.departmentType == 8">全病程科室</a-checkbox>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 46px"
        ><span style="color: red">*</span> 显示序号 :</span
      >
      <a-button style="margin-left: 5px" icon="plus" size="small" @click="addNum()" />
      <a-input
        v-model="queryParams.departmentOrder"
        :defaultValue="0"
        allow-clear
        style="width: 192px; margin-left: 4px; text-align: center"
      />
      <a-button style="margin-left: 5px" size="small" icon="minus" @click="duleNum()" />
    </div>

    <div class="div-service-user" style="margin-top: 5px; margin-left: 7px; position: relative">
      <span style="margin-top: 10px; width: 90px"> 科室简介 :</span>
      <a-textarea
        style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: -28px; width: 87%"
        v-model="queryParams.departmentIntroduce"
        :maxLength="30"
        placeholder="请输入科室简介"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入科室简介！' }] }]"
      />
      <span class="m-count">{{ queryParams.departmentIntroduce ? queryParams.departmentIntroduce.length : 0 }}/30</span>
    </div>

    <div class="div-service-user" style="margin-top: 10px; margin-left: 10px">
      <span class="span-item-name" style="margin-top: 5px"> 所属学科 :</span>
      <a-tree-select
              v-model="queryParams.subjectCode"
              style="min-width: 87%; margin-left: 5px;height: 30px;"
              :tree-data="treeDataSub"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
    </div>

    <div class="div-service-user" style="margin-top: 10px; margin-left: 10px">
      <span class="span-item-name" style="margin-top: 5px"> 管理病种 :</span>

      <a-select
        mode="multiple"
        style="min-width: 87%; margin-left: 5px;height: 30px;"
        v-model="idArray"
        allow-clear
        placeholder="请选择病种"
        @select="onChangeDisease"
        @change="changeDis"
      >
        <a-select-option v-for="(item, index) in diseaseTypeListData" :key="index" :value="item.id">{{
          item.typeName
        }}</a-select-option>
      </a-select>
    </div>

  </a-modal>
</template>
        
        <script>
import moment from 'moment'
import {
  addDepartmentForReq,
  queryHospitalLevel,
  queryHospitalType,
  parent,
  queryHospitalList2,
  getDictDataForCodeDepartType,
  getDiseaseTypePageList,
  getTdMedicalSubjectPageListForVer,
  gettreeMedicalSubjects,
} from '@/api/modular/system/posManage'
import { STable } from '@/components'
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
      idArray:[],
      diseaseTypeListData: [],
      bb: '1',
      userId: '',
      timeStr: '',
      originData: [],
      fetching: false,
      rangeValue: '2',
      previewVisible: false,
      HospitalLevelList: [],
      HospitalTypeList: [],
      ParentList: [],
      record: {},
      treeData: [],
      localHospitalCode: undefined,
      treeDataSub: [],
      treeCodeData: [],
      findItemData: {},
      internetType: false,
      isFullDiseaseType: false,
      queryParams: {
        departmentName: '',
        hospitalCode: '',
        hisId: '',
        departmentAddr: '',
        departmentOrder: 1,
        isInternetHospital: '',
        isFullDisease: '',
        departmentIntroduce: '',
        departmentType: undefined,
        departmentId:'',
        managerDiseaseType: undefined,
        supervisionCode:undefined,
        subjectCode:undefined,
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      headers: {
        Authorization: '',
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '新增科室',

      departmentTypeList: [
        // { code: 1, name: '门诊科室' },
        // { code: 2, name: '急诊科室' },
        // { code: 3, name: '住院科室' },
        // { code: 4, name: '医技科室' },
        // { code: 5, name: '药剂科室' },
        // { code: 6, name: '后勤物资' },
        // { code: 7, name: '机关科室' },
      ],
    }
  },

  methods: {
    moment,
    //初始化方法
    addDepartment(record) {
      this.visible = true
      this.reset()
      this.user = Vue.ls.get(TRUE_USER)
      if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
      this.queryHospitalListOut(undefined)
      this.getDictDataForCodeorgDepartTypeOut()
      this.getDiseaseTypePageListOut()
      this.getgetTdMedicalSubjectPageListForVerOut('')
      this.gettreeMedicalSubjectsOut()
  
    },


     //编码搜索
     onSelectSearch(value) {
      this.treeCodeData = []
      this.getgetTdMedicalSubjectPageListForVerOut(value)
    },


    getgetTdMedicalSubjectPageListForVerOut(name) {
      this.fetching = true
      getTdMedicalSubjectPageListForVer({subjectName:name})
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            this.treeCodeData = res.data
          } else {
            this.treeCodeData =[]
          }
          
        })
    },





 /**
     * 获取病种列表
     */
     getDiseaseTypePageListOut() {
      let queryDiseaseParams = {
        pageNo: 1,
        pageSize: 999,
      }
      this.confirmLoading = true
      getDiseaseTypePageList(queryDiseaseParams)
        .then((res) => {
          if (res.code == 0) {
            this.diseaseTypeListData = res.data.records
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


   /**
    * 病种选择
    */
    onChangeDisease(id){
      // console.log("KKKK:",this.idArray)
      let premiss = this.idArray.join(",")
      this.queryParams.managerDiseaseType = premiss

    },
    /**
    * 病种改变
    */
    changeDis(id){
      this.idArray = id
      this.queryParams.managerDiseaseType=this.idArray.join(",")
    },




    /**
     * 组织类型接口
     */
    getDictDataForCodeorgDepartTypeOut() {
      this.confirmLoading = true
      getDictDataForCodeDepartType()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.departmentTypeList = res.data
            for (let index = 0; index < this.departmentTypeList.length; index++) {
              this.departmentTypeList[index].code = Number(this.departmentTypeList[index].code)
            }
          } else {
            this.departmentTypeList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    onSelect(hospitalId) {
      //选择类别
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

    /**
     * 增加序号
     */
    addNum() {
      this.queryParams.departmentOrder++
    },

    /**
     * 减序号
     */
    duleNum() {
      this.queryParams.departmentOrder--
      if (this.queryParams.departmentOrder <= 0) {
        this.queryParams.departmentOrder = 0
      }
    },

    /**
     * 上级机构
     */
    getParentList() {
      parent().then((res) => {
        if (res.code == 0) {
          this.ParentList = res.data
        }
      })
    },

    /***
     * 机构等级接口
     */
    getHospitalLevel() {
      queryHospitalLevel()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalLevelList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
    //  */
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
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
    },


    /**
     * 机构类型
     */
    getHospitalType() {
      queryHospitalType()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalTypeList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

        //学科列表
    gettreeMedicalSubjectsOut() {
      gettreeMedicalSubjects().then((res) => {
        if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              // this.$set(item, 'key', item.subjectClassifyId)
              // this.$set(item, 'value', item.subjectClassifyId)
              this.$set(item, 'key', item.subjectCode)
              this.$set(item, 'value', item.subjectCode)
              this.$set(item, 'title', item.subjectClassifyName)
              this.$set(item, 'title', item.subjectClassifyName)
              this.$set(item, 'disabled', true)

              item.children.forEach((item1, index1) => {
                // this.$set(item1, 'key', item1.subjectClassifyId)
                // this.$set(item1, 'value', item1.subjectClassifyId)
                this.$set(item1, 'key', item1.subjectCode)
                this.$set(item1, 'value', item1.subjectCode)
                this.$set(item1, 'title', item1.subjectClassifyName)
              })
            })

            this.treeDataSub = res.data
          } else {
            this.treeDataSub = res.data
          }
      })
    },

    /***
     * 新增租户接口调用
     */
    addDepartmentForReqOut() {
      this.confirmLoading = true
      addDepartmentForReq(this.queryParams)
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
     *   互联网医院科室
     */
    radioChange1(event) {
      // console.log("tt00:",event.target.checked )
      if (event.target.checked) {
        this.queryParams.isInternetHospital = 1
      } else {
        this.queryParams.isInternetHospital = 2
      }
    },

    /**
     *   全病程科室
     */
    radioChange2(event) {
      // console.log("tt11:",event.target.checked )
      if (event.target.checked) {
        this.queryParams.isFullDisease = 1
      } else {
        this.queryParams.isFullDisease = 2
      }
    },

    /**
     * 重置
     */
    reset() {
      this.idArray = []
      this.queryParams.managerDiseaseType = undefined
      this.queryParams.departmentId = ''
      this.queryParams.hospitalCode = ''
      this.queryParams.departmentName = ''
      this.queryParams.departmentAddr = ''
      this.queryParams.departmentOrder = 1
      this.queryParams.isInternetHospital = ''
      this.queryParams.isFullDisease = ''
      this.queryParams.departmentIntroduce = ''
      this.queryParams.hisId = ''
      this.queryParams.supervisionCode = undefined
      this.queryParams.departmentType = undefined
      this.queryParams.subjectCode = undefined
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
      this.previewVisible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      if (!this.queryParams.hospitalCode) {
        this.$message.error('请选择上级机构')
        return
      }

      if (!this.queryParams.departmentName) {
        this.$message.error('请输入科室名称')
        return
      }
      if (!this.queryParams.departmentOrder) {
        this.$message.error('请选择科室排序')
        return
      }

     
      if(!this.queryParams.departmentId){
        this.$message.error('请输入科室编码')
        return
      }



      // if (!this.queryParams.hisId) {
      //   this.$message.error('请输入His编码')
      //   return
      // }

      if (!this.queryParams.departmentType) {
        this.$message.error('请选择科室类型')
        return
      }

      if (this.queryParams.departmentOrder < 0) {
        this.$message.error('显示序号不能小于0!')
        return
      }

      /**
       * 如果选中的是企业部门 则不传 科室编码、科室位置、科室属性参数
       */
      if (this.queryParams.departmentType == 8) {
        // this.queryParams.hisId = ''
        // this.queryParams.departmentAddr = ''
        this.queryParams.isFullDiseaseType = ''
        this.queryParams.isInternetHospital = ''
      }
      this.addDepartmentForReqOut()
    },
  },
}
</script>


<style lang="less" scoped>
/deep/.ant-select-selection--multiple {
    height: 30px !important;
    min-height: 28px !important;
}
</style>



        <style lang="less">
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

.div-line-wrap {
  width: 120%;
  overflow: hidden;

  .span-item-name {
    width: 80%;
    display: inline-block;
    color: #4d4d4d;
    font-size: 12px;
    text-align: left;
  }

  .span-item-value {
    width: 20%;
    // overflow: hidden;
    color: #4d4d4d;
    text-align: left;
    font-size: 12px;
    display: inline-block;
    text-overflow: ellipsis;
  }

  .span-item-value1 {
    width: 10%;
    margin-bottom: -4px;
    color: #4d4d4d;
    text-align: left;
    font-size: 12px;
    display: inline-block;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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