<template>
  <a-modal
    :title="title"
    :width="730"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="div-service-user">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 上级机构 :</span>
      <a-tree-select
        v-model="queryParams.parentDisarmamentId"
        style="min-width: 248px; margin-left: 5px"
        :tree-data="treeData"
        placeholder="请选择"
        @select="onSelect"
        tree-default-expand-all
      >
      </a-tree-select>

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

    <div class="div-service-user" style="margin-top: 20px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 科室类型 :</span>
      <a-select
        style="min-width: 248px; margin-left: 5px"
        v-model="queryParams.departmentType"
        allow-clear
        placeholder="请选择科室类型"
      >
        <a-select-option v-for="(item, index) in departmentTypeList" :key="index" :value="item.code">{{
          item.name
        }}</a-select-option>
      </a-select>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
        ><span style="color: red">*</span> 科室位置 :</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParams.departmentAddr"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 5px"
        allow-clear
        placeholder="请输入科室位置 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 20px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> HIS编码 :</span>
      <a-input
        type="number"
        class="span-item-value"
        v-model="queryParams.hisId"
        :maxLength="30"
        style="display: inline-block; width: 248px; margin-left: 8px"
        allow-clear
        placeholder="请输入HIS编码 "
      />

      <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
        ><span style="color: red">*</span> 显示序号 :</span
      >
      <a-button style="margin-left: 5px" icon="plus" size="small" @click="addNum()" />
      <a-input
        v-model="queryParams.departmentOrder"
        :disabled="true"
        :defaultValue="0"
        allow-clear
        style="width: 190px; margin-left: 5px; text-align: center"
      />
      <a-button style="margin-left: 5px" size="small" icon="minus" @click="duleNum()" />
    </div>

    <div class="display-item" style="margin-left: 5px; margin-top: 10px">
      <span style="margin-top: 10px"> 科室类型 :</span>

      <a-checkbox style="margin-left:10px" @change="radioChange1"
        >互联网医院科室</a-checkbox
      >

      <a-checkbox @change="radioChange2"
        >全病程科室</a-checkbox
      >
    </div>

    <div class="div-service-user" style="margin-top: 10px; margin-left: 7px">
      <span style="margin-top: 10px; width: 90px"> 科室简介 :</span>
      <a-textarea
        style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: -28px; width: 87%"
        v-model="queryParams.departmentIntroduce"
        placeholder="请输入科室简介"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入科室简介！' }] }]"
      />
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
  queryHospitalList,
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
      bb: '1',
      userId: '',
      timeStr: '',
      originData: [],
      rangeValue: '2',
      previewVisible: false,
      HospitalLevelList: [],
      HospitalTypeList: [],
      ParentList: [],
      record: {},
      treeData: [],
      findItemData: {},
      queryParams: {
        departmentName: '',
        parentDisarmamentId: '',
        parentDisarmamentName: '',
        hisId: '',
        departmentAddr: '',
        departmentOrder: 1,
        isInternetHospital: '',
        isFullDisease: '',
        departmentIntroduce: '',
        departmentType: '',
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
        { code: 1, name: '门诊科室' },
        { code: 2, name: '急诊科室' },
        { code: 3, name: '住院科室' },
        { code: 4, name: '医技科室' },
        { code: 5, name: '药剂科室' },
        { code: 6, name: '后勤物资' },
        { code: 7, name: '机关科室' },
      ],
    }
  },

  methods: {
    moment,
    //初始化方法
    addDepartment(record) {
      this.visible = true
      this.reset()
      // this.getHospitalLevel()
      // this.getHospitalType()
      //   this.getParentList()
      this.queryHospitalListOut()
    },

    onSelect(hospitalId) {
      //选择类别
      console.log('99999:', hospitalId)
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

      //   console.log("7777:", this.findItemData)
      //   let chooseDeptItem = JSON.parse(JSON.stringify(this.treeData.find((item) => item.value == this.queryParams.parentDisarmamentId)))
      //   this.queryParams.parentDisarmamentName = chooseDeptItem.hospitalName
      //   console.log("sssss:",this.queryParams.parentDisarmamentName)
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
              this.$set(item, 'key', item.hospitalId)
              this.$set(item, 'value', item.hospitalId)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalId)
                this.$set(item1, 'value', item1.hospitalId)
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
      } else  {
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
      } else  {
        this.queryParams.isFullDisease = 2
      }
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.parentDisarmamentId = ''
      this.queryParams.departmentName = ''
      this.queryParams.parentDisarmamentName = ''
      this.queryParams.departmentAddr = ''
      this.queryParams.departmentOrder = 1
      this.queryParams.isInternetHospital = ''
      this.queryParams.isFullDisease = ''
      this.queryParams.departmentIntroduce = ''
      this.queryParams.hisId = ''
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
      if (!this.queryParams.parentDisarmamentId) {
        this.$message.error('请选择上级机构')
        return
      }

      if (!this.queryParams.departmentName) {
        this.$message.error('请输入科室名称')
        return
      }
      if (!this.queryParams.departmentAddr) {
        this.$message.error('请输入科室地址')
        return
      }
      if (!this.queryParams.departmentOrder) {
        this.$message.error('请选择科室排序')
        return
      }
      if (!this.queryParams.hisId) {
        this.$message.error('请输入His编码')
        return
      }

      // if (!this.queryParams.departmentIntroduce) {
      //   this.$message.error('请编辑科室简介')
      //   return
      // }

      this.addDepartmentForReqOut()
    },
  },
}
</script>

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
      <style lang="less">
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
</style>