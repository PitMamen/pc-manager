<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :footer="inputFlag == '3' ? null : undefined"
    @cancel="handleCancel"
  >
    <div class="bad-wrap">
      <!-- 基本信息 -->
      <div class="wrap-info">
        <div class="info-per">
          <div>姓名：{{ item.userName }}</div>
          <div class="shu-line"></div>
          <div>性别：{{ item.sex }}</div>
          <div class="shu-line"></div>
          <div>年龄：{{ item.age }}</div>
          <div class="shu-line"></div>
          <div>联系方式：{{ item.userPhone }}</div>
        </div>
      </div>

      <div class="wrap-hor">
        <div class="hor-half">
          <div>业务单号：</div>
          <div>{{ item.orderId }}</div>
        </div>
        <div class="hor-half">
          <div>业务类型：</div>
          <div>{{ item.broadClassifyName }}</div>
        </div>
      </div>

      <div class="wrap-hor">
        <div class="hor-half">
          <div>所属机构：</div>
          <div>{{ item.hospitalName }}</div>
        </div>
        <div class="hor-half">
          <div>事件时间：</div>
          <div>{{ item.createTime }}</div>
        </div>
      </div>

      <a-form :form="form">
        <a-form-item v-show="false">
          <a-input v-decorator="['id']" />
        </a-form-item>

        <a-form-item
          label="事件描述"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-textarea
            :rows="4"
            :maxLength="500"
            placeholder="请输入事件描述"
            :disabled="inputFlag == '3'"
            style="min-height: 100px"
            v-decorator="['eventDesc', { rules: [{ required: true, message: '请输入事件描述！' }] }]"
          ></a-textarea>
          <span class="m-count">{{ textLength1() }}/500 </span>
        </a-form-item>
        <a-form-item
          label="发生原因"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-textarea
            :rows="4"
            :maxLength="500"
            placeholder="请输入发生原因"
            :disabled="inputFlag == '3'"
            style="min-height: 100px"
            v-decorator="['eventReason']"
          ></a-textarea>
          <span class="m-count">{{ textLength2() }}/500 </span>
        </a-form-item>
        <a-form-item
          label="采取措施"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-textarea
            :rows="4"
            :maxLength="500"
            placeholder="请输入采取措施"
            :disabled="inputFlag == '3'"
            style="min-height: 100px"
            v-decorator="['eventDeal']"
          ></a-textarea>
          <span class="m-count">{{ textLength3() }}/500 </span>
        </a-form-item>
        <a-form-item
          label="损害程度"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-textarea
            :rows="4"
            :maxLength="500"
            placeholder="请输入损害程度"
            :disabled="inputFlag == '3'"
            style="min-height: 100px"
            v-decorator="['eventLevel']"
          ></a-textarea>
          <span class="m-count">{{ textLength4() }}/500 </span>
        </a-form-item>
        <a-form-item
          label="后续改进"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-textarea
            :rows="4"
            :maxLength="500"
            placeholder="请输入后续改进"
            :disabled="inputFlag == '3'"
            style="min-height: 100px"
            v-decorator="['eventImprove']"
          ></a-textarea>
          <span class="m-count">{{ textLength5() }}/500 </span>
        </a-form-item>

        <a-form-item
          label="上报时间"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-date-picker
            v-decorator="['uploadTime', { rules: [{ required: false, message: '请选择！' }] }]"
            show-time
            :disabled="inputFlag == '3'"
            placeholder="请选择"
            @change="onChange"
            @ok="onOk"
          />
        </a-form-item>

        <a-form-item
          label="上报人"
          class="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          style="position: relative; margin-top: 10px"
        >
          <a-input
            placeholder="请输入上报人"
            style="width: 195px"
            :disabled="inputFlag == '3'"
            v-decorator="['uploadUserName', { rules: [{ required: false, message: '请输入上报人！' }] }]"
          />
        </a-form-item>

        <!-- <a-row>
            <a-col :span="12">
              <a-form-item
                label="上报时间"
                class="row-bottom-0"
                :labelCol="{
                  span: 8,
                  offset: 0,
                }"
                :wrapperCol="{
                  span: 16,
                  offset: 0,
                }"
                has-feedback
              >
                <a-date-picker
                  v-decorator="['uploadTime', { rules: [{ required: false, message: '请选择！' }] }]"
                  show-time
                  placeholder="请选择"
                  @change="onChange"
                  @ok="onOk"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="上报人"
                class="row-bottom-0"
                :labelCol="{
                  span: 6,
                  offset: 0,
                }"
                :wrapperCol="{
                  span: 18,
                  offset: 0,
                }"
                has-feedback
              >
                <a-input
                  placeholder="请输入上报人"
                  :disabled="!isEdit"
                  v-decorator="['uploadUserName', { rules: [{ required: false, message: '请输入上报人！' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row> -->
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { saveComplaint } from '@/api/modular/system/posManage'
import { formatDateFull, formatDate } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import moment from 'moment'
export default {
  data() {
    return {
      labelCol: {
        span: 4,
        offset: 0,
      },
      wrapperCol: {
        span: 20,
        offset: 0,
      },

      visible: false,
      item: {},
      user: {},
      chooseTime: '',
      inputFlag: '',
      title: '',
      // isEdit: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
    }
  },
  mounted() {
    this.user = Vue.ls.get(TRUE_USER)
  },
  methods: {
    // 初始化方法
    edit(item, inputFlag) {
      this.item = item
      // 传参1登记2审核 3详情
      if (inputFlag == '1') {
        this.title = '不良事件登记'
      } else if (inputFlag == '2') {
        this.title = '不良事件审核'
      } else {
        this.title = '不良事件详情'
      }
      this.inputFlag = inputFlag
      this.visible = true

      let mTime
      if (item.uploadTime) {
        mTime = moment(item.uploadTime, 'YYYY-MM-DD HH:mm:ss')
      } else {
        mTime = moment(formatDateFull(new Date()), 'YYYY-MM-DD HH:mm:ss')
      }

      if (!item.uploadUserName) {
        item.uploadUserName = this.user.userName
      }
      setTimeout(() => {
        this.form.setFieldsValue({
          id: item.id,
          eventDesc: item.eventDesc,
          eventReason: item.eventReason,
          eventDeal: item.eventDeal,
          eventLevel: item.eventLevel,
          eventImprove: item.eventImprove,
          uploadTime: mTime,
          uploadUserName: item.uploadUserName,
        })
      })
    },

    onChange(value, dateString) {
      console.log('onChange value:', value)
      console.log('onChange dateString: ', dateString)
      console.log('chooseTime ', this.chooseTime)
    },
    onOk(value) {
      console.log('onOk value: ', value)
      console.log('chooseTime ', this.chooseTime)
      // this.form.setFieldsValue({
      //   uploadTime: item.uploadTime,
      // })
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.uploadTime = values.uploadTime.format('YYYY-MM-DD HH:mm:ss')
          this.$set(values, 'status', this.inputFlag)
          this.$set(values, 'id', this.item.id)

          if (this.item.uploadUserId) {
            this.$set(values, 'uploadUserId', this.item.uploadUserId)
          } else {
            this.$set(values, 'uploadUserId', this.user.userId)
          }
          saveComplaint(values)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('操作成功')
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
    textLength1() {
      if (this.form) {
        return (this.form.getFieldValue('eventDesc') || '').length
      } else {
        return 0
      }
    },
    //字数统计
    textLength2() {
      if (this.form) {
        return (this.form.getFieldValue('eventReason') || '').length
      } else {
        return 0
      }
    },
    //字数统计
    textLength3() {
      if (this.form) {
        return (this.form.getFieldValue('eventDeal') || '').length
      } else {
        return 0
      }
    },
    //字数统计
    textLength4() {
      if (this.form) {
        return (this.form.getFieldValue('eventLevel') || '').length
      } else {
        return 0
      }
    },
    //字数统计
    textLength5() {
      if (this.form) {
        return (this.form.getFieldValue('eventImprove') || '').length
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
.bad-wrap {
  color: #4d4d4d;
  font-size: 12px;

  .ant-calendar-picker {
    // min-width: 161px !important;
  }

  .wrap-info {
    // padding-left: 10px;
    .info-per {
      display: flex;
      flex-direction: row;
      align-items: center;

      .shu-line {
        margin: 0 8px;
        height: 10px;
        width: 1px;
        background-color: #999;
      }
    }
  }

  .wrap-hor {
    display: flex;
    flex-direction: row;

    align-items: center;
    margin-top: 10px;

    .hor-half {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 50%;
    }
  }
}
.remark {
  /deep/ .ant-col-3 {
    line-height: 22px;
  }
}
// /deep/ .ant-col-3 {
//   width: calc(12.5% - 16.4px);
// }
// /deep/ .ant-col-21 {
//   width: calc(87.5% + 16.4px);
// }
.m-count {
  position: absolute;
  font-size: 12px;
  bottom: -11px;
  right: 26px;
}
</style>
