<template>
  <a-modal
    title="新增病区"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-show="false">
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="所属机构"
              class="row-bottom-0"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              has-feedback
            >
              <!-- <a-tree-select
                tree-default-expand-all
                :tree-data="treeData"
                placeholder="所属机构"
                style="width: 100%;"
                v-decorator="['selectHospitalCode', { rules: [{ required: true, message: '请选择所属机构！' }] }]"
              >
              </a-tree-select> -->
              <a-select
                v-decorator="['selectHospitalCode', { rules: [{ required: true, message: '请选择所属机构！' }] }]"
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
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="病区名称"
              class="row-bottom-0"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              has-feedback
            >
              <a-input
                placeholder="病区名称"
                v-decorator="['wardName', { rules: [{ required: true, message: '请输入病区名称！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="显示序号"
              class="row-bottom-0"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              has-feedback
            >
              <a-input-number
                :min="1"
                :max="9999"
                :precision="0"
                placeholder="显示序号"
                style="width: 100%"
                v-decorator="['wardOrder']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="床位数量"
              class="row-bottom-0"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              has-feedback
            >
              <a-input-number
                :min="1"
                :max="9999"
                :precision="0"
                placeholder="床位数量"
                style="width: 100%"
                v-decorator="['bedQuantity']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="HIS编码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-input placeholder="HIS编码" v-decorator="['hisId']" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="HIS名称" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
              <a-input placeholder="HIS名称" v-decorator="['hisName']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          label="备注说明"
          class="remark"
          :labelCol="labelCol3"
          :wrapperCol="wrapperCol3"
          has-feedback
          style="position: relative"
        >
          <a-textarea
            :rows="4"
            :maxLength="200"
            placeholder="备注说明"
            style="min-height: 140px"
            v-decorator="['wardIntroduce']"
          ></a-textarea>
          <span class="m-count">{{ textLength() }}/200 </span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { queryHospitalList2 } from '@/api/modular/system/posManage'
import { add } from '@/api/modular/system/ward'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  data() {
    return {
      fetching: false,
      labelCol: {
        span: 5,
        offset: 0,
      },
      wrapperCol: {
        span: 18,
        offset: 0,
      },
      labelCol2: {
        span: 5,
        offset: 1,
      },
      wrapperCol2: {
        span: 18,
        offset: 0,
      },
      labelCol3: {
        span: 3,
        offset: 0,
      },
      wrapperCol3: {
        span: 21,
        offset: 0,
      },
      visible: false,
      confirmLoading: false,

      treeData: [],
      form: this.$form.createForm(this),
    }
  },
  methods: {
    // 初始化方法
    add() {
      this.visible = true
      this.user = Vue.ls.get(TRUE_USER)
      if (this.user) {
        this.localHospitalCode = this.user.hospitalCode
      }
      this.getTreeData(undefined)
      setTimeout(() => {
        this.form.setFieldsValue({
          wardOrder: 1,
          bedQuantity: 1,
        })
      })
    },
    // getTreeData() {
    //   this.confirmLoading = true
    //   list2({
    //     status: 1,
    //     tenantId: '',
    //     hospitalName: ''
    //   }).then(res => {
    //     if (res.code === 0){
    //       this.treeData = (res.data || []).map(item => {
    //         const tree = {
    //           key: item.hospitalCode,
    //           value: item.hospitalCode,
    //           title: item.hospitalName
    //         }
    //         if (item.hospitals && item.hospitals.length>0){
    //           tree.children = item.hospitals.map(item_ => {
    //             return {
    //               key: item_.hospitalCode,
    //               value: item_.hospitalCode,
    //               title: item_.hospitalName
    //             }
    //           })
    //         }
    //         return tree
    //       })
    //     }else {
    //       this.$message.error(res.message)
    //     }
    //   }).finally(() => {
    //     this.confirmLoading = false
    //   })
    // },

    getTreeData(name) {
      this.confirmLoading = true
      queryHospitalList2({
        status: 1,
        tenantId: '',
        hospitalName: name,
      })
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                // this.queryParam.selectHospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //机构搜索
    onHospitalSelectSearch(value) {
      this.treeData = []
      this.getTreeData(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.getTreeData(undefined)
      }
    },

    geneSubmitData(values) {
      for (let x = 0; x < this.treeData.length; x++) {
        const tree = this.treeData[x]
        if (tree.value === values.selectHospitalCode) {
          values.parentDisarmamentName = tree.title
          return values
        }
        if (tree.children && tree.children.length > 0) {
          for (let y = 0; y < tree.children.length; y++) {
            const tree_ = tree.children[y]
            if (tree_.value === values.selectHospitalCode) {
              values.parentDisarmamentName = tree_.title
              return values
            }
          }
        }
      }
      return values
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          add(this.geneSubmitData(values))
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('新增成功')
                this.$emit('ok', values)
                this.handleCancel()
                this.clearDatas()
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    //字数统计
    textLength() {
      if (this.form) {
        return (this.form.getFieldValue('wardIntroduce') || '').length
      } else {
        return 0
      }
    },
    handleCancel() {
      this.visible = false
    },
    clearDatas() {
      this.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.remark {
  /deep/ .ant-col-3 {
    line-height: 22px;
  }
}
/deep/ .ant-col-3 {
  width: calc(12.5% - 16.4px);
}
/deep/ .ant-col-21 {
  width: calc(87.5% + 16.4px);
}
.m-count {
  position: absolute;
  font-size: 12px;
  bottom: -11px;
  right: 26px;
}
</style>
