<template>
  <a-modal
    title="属性配置"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="服务时效（小时）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="1"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['serviceExpire', { rules: [{ required: true, message: '请输入服务时效！' }] }]"
          />
          <!-- <a-input-number style="margin-left: 3.5%" disabled v-model="item.attrValue" :min="0" :max="1000000" /> -->
        </a-form-item>

        <a-form-item label="时长限制（分钟）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="1"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['timeLimit', { rules: [{ required: true, message: '请输入时长限制！' }] }]"
          />
        </a-form-item>

        <a-form-item label="条数限制（条）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="0"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['textNumLimit', { rules: [{ required: true, message: '请输入条数限制！' }] }]"
          />
        </a-form-item>

        <a-form-item label="个案介入" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-switch :checked="uploadData.isOnline" @change="onChangeIsOnline" /> -->
          <a-switch :checked="isCaseFlag" @change="onChangeCase" />
        </a-form-item>

        <a-form-item label="服务医生" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="div-text-auto">
            <a-auto-complete
              class="global-search"
              v-model="chooseDeptItem.userName"
              size="large"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择"
              option-label-prop="title"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <!-- <a-select-option v-for="item in keshiDataTemp" :key="item.userId + ''" :title="item.userName"> -->
                <a-select-option v-for="item in keshiDataTemp" :key="item.userId + ''" :title="item.userName">
                  {{ item.userName }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getUserList } from '@/api/modular/system/posManage'

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
      statusData: [],
      isCaseFlag: true,
      caseFlag: 1,

      // caseFlag
      // docId
      confirmLoading: false,
      form: this.$form.createForm(this),
      //status 0  启用
      queryParam: { pageNo: 1, status: 0, pageSize: 1000 },

      index: 0,
      docId: '',
      chooseDeptItem: {},
      originData: [],
      keshiData: [],
      keshiDataTemp: [],
    }
  },
  created() {
    getUserList(this.queryParam).then((res) => {
      for (let i = 0; i < res.data.rows.length; i++) {
        this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
      }
      this.originData = res.data.rows
      this.keshiData = JSON.parse(JSON.stringify(this.originData))
      console.log('originDataGot', this.originData)
      this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
    })
  },
  methods: {
    //初始化方法
    edit(index, plusInfoVo) {
      this.visible = true

      this.index = index
      setTimeout(() => {
        this.form.setFieldsValue({
          serviceExpire: plusInfoVo.serviceExpire,
          timeLimit: plusInfoVo.timeLimit,
          textNumLimit: plusInfoVo.textNumLimit,
        })
      }, 100)
      console.log('plusInfoVo', plusInfoVo)
      this.docId = plusInfoVo.docId
      console.log('originData', this.originData)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.userId == this.docId)))
      console.log('chooseDeptItem', this.chooseDeptItem)
      this.caseFlag = plusInfoVo.caseFlag
      this.isCaseFlag = this.caseFlag == 1 ? true : false
    },

    onChangeCase() {
      this.isCaseFlag = !this.isCaseFlag
      this.caseFlag = this.isCaseFlag ? 1 : 0
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          // let chooseOne = this.statusData.find((item) => {
          //   return item.code == values.knowledgeType
          // })

          if (!this.docId) {
            this.$message.error('请选择服务医生！')
            return
          } else {
            this.$set(values, 'docId', this.docId)
          }
          this.$set(values, 'caseFlag', this.caseFlag)
          this.confirmLoading = false
          this.visible = false
          this.$emit('ok', this.index, values)

          // let user = Vue.ls.get(TRUE_USER)
          // this.$set(values, 'creator', user.userName)
          // saveSysKnowledge(values)
          //   .then((res) => {
          //     if (res.success) {
          //       this.$message.success('新增成功')
          //       this.visible = false
          //       this.confirmLoading = false
          //       this.$emit('ok', values)
          //       this.form.resetFields()
          //     } else {
          //       this.$message.error('新增失败：' + res.message)
          //     }
          //   })
          //   .finally((res) => {
          //     this.confirmLoading = false
          //   })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.userName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
        // this.queryParams.appointItemName = ''
        this.docId = ''
      }
    },

    onSelect(departmentId, s2) {
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.userId == departmentId)))
      // this.queryParams.appointItemName = this.chooseDeptItem.name
      this.docId = this.chooseDeptItem.userId
    },
  },
}
</script>
