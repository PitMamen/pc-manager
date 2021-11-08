<template>
  <a-modal
    title="添加医生"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="formLoading">
      <a-form :form="form">
        <a-form-item label="选择医生" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="global-search-wrapper" style="width: 300px">
            <a-auto-complete
              class="global-search"
              size="large"
              style="width: 100%"
              v-model="mySelect"
              placeholder="请输入并选择医生"
              option-label-prop="title"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option v-for="item in doctorDatas" :key="item.id + ''" :title="item.xm">
                  {{ item.xm }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </div>
        </a-form-item>
        <a-form-item label="号源" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入号源"
            v-model="consultNo"
            style="width: 300px"
            type="number"
            oninput="if(value>50)value=50;if(value<0)value=0"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getDoctorsNew } from '@/api/modular/system/posManage'
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
      mySelect: '',
      visible: false,
      doctorDatas: [],
      confirmLoading: false,
      date: {},
      rowIndex: {},
      chooseDocId: '',
      chooseDocRank: '',
      consultNo: '',
      parameter: {},
      dataSource: [],
      formLoading: true,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    //初始化方法 传入日期，行数，医疗机构代码，所属科室
    add(date, rowIndex, yljgdm, ssks) {
      this.chooseDocId = ''
      this.chooseDocRank = ''
      this.chooseDocName = ''
      this.consultNo = ''
      this.mySelect = ''

      console.log('add rowIndex', rowIndex)
      if (!ssks) {
        this.$message.error('请先选择科室')
        return
      }

      this.date = date
      this.rowIndex = rowIndex
      this.visible = true
      this.formLoading = true
      this.parameter = { yljgdm: yljgdm, ssks: ssks, activeFlag: 1 }

      this.getDoctorData(this.parameter)
      console.log('date', date + '***' + rowIndex + '***' + yljgdm + '***' + ssks)
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },

    //autocomplete回调，选中的医生id，需要找出来插入到
    onSelect(s1) {
      console.log('this.mySelect', this.mySelect)
      for (let i = 0; i < this.doctorDatas.length; i++) {
        if (this.doctorDatas[i].id == s1) {
          this.chooseDocId = this.doctorDatas[i].gh
          this.chooseDocRank = this.doctorDatas[i].zhic
          this.chooseDocName = this.doctorDatas[i].xm
          break
        }
      }
    },

    //autocomplete回调
    handleSearch(value) {
      this.parameter.xm = value
      this.getDoctorData(this.parameter)
    },

    getDoctorData(parameter) {
      getDoctorsNew(parameter)
        .then((res) => {
          this.formLoading = false
          if (res.success) {
            this.doctorDatas = res.data.rows
          }
        })
        .catch((err) => {
          this.formLoading = false
        })
    },

    handleSubmit() {
      let resultData
      if (this.chooseDocId) {
        resultData = {
          date: this.date,
          rowIndex: this.rowIndex,
          chooseDocId: this.chooseDocId,
          chooseDocName: this.chooseDocName,
          chooseDocRank: this.chooseDocRank,
          consultNo: this.consultNo,
        }
        this.visible = false
        this.$emit('ok', resultData)
      } else {
        this.$message.success('您未选择班次')
      }
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.global-search-wrapper {
  padding-right: 50px;
}

.global-search {
  width: 100%;
}
</style>