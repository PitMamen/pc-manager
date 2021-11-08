<template>
  <a-modal
    title="班次编辑"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          style="display: none;"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input v-decorator="['id']" />
        </a-form-item>

        <a-form-item
          label="创建人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          admin
        </a-form-item>

        <a-form-item
          label="班次名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="请输入班次名称" v-decorator="['scheName', {rules: [{required: true, message: '请输入班次名称！'}]}]" />
        </a-form-item>

        <a-form-item
          label="起止时间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-time-picker @change="timeChangeStart"    format="HH:mm" v-decorator="['startTime', {rules: [{required: true, message: '请输入开始时间！'}]}]"/>
          <a-time-picker @change="timeChangeEnd"   format="HH:mm"  v-decorator="['endTime', {rules: [{required: true, message: '请输入结束时间！'}]}]"/>
          <a-input style="display: none" placeholder="请输入班次时长" v-decorator="['scheTimes']"  />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="班次时长"
        >

          <a-input style="display: none" placeholder="请输入班次时长" v-decorator="['schePreriod']" />
          <span id="sp">{{periodStr}}</span>
        </a-form-item>

        <a-form-item
          label="班次描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea :rows="4" placeholder="请输入至少五个字符"  v-decorator="['scheDesc']"></a-textarea>
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>


<script>
  import { schedulerEdit } from '@/api/modular/system/scheduler'
  import moment from 'moment';
  export default {
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        periodStr:'',
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this)
      }


    },
    methods: {
      moment,
      //初始化方法
      edit (record) {
        this.periodStr = ""
        this.visible = true
        setTimeout(()=>{
          var str=record.schePreriod
          var startTime=str.substr(0,5)
          var endTime=str.substr(6,5)
          this.form.getFieldDecorator('startTime',{initialValue: moment(startTime,'HH:mm') })
          this.form.getFieldDecorator('endTime',{initialValue:moment(endTime,'HH:mm')  })
          document.getElementById("sp").innerHTML=record.scheTimes
          this.periodStr = record.scheTimes
          console.log('scheTimes',record.scheTimes)
          this.form.setFieldsValue(
            {
              id:record.id,
              scheName:record.scheName,
              scheTimes:record.scheTimes,
              schePreriod:record.schePreriod,
              scheDesc:record.scheDesc,
            }
          );
        },100)
      },
      timeChangeStart(value,dateString) {
        // 起止时间
        var startTime =dateString
        var endTime =moment(this.form.getFieldValue('endTime')).format("HH:mm")
        if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
          if (startTime.length !== 0 && endTime.length !== 0) {
            var a=startTime + '-' + endTime
            var b=((parseInt(endTime.substr(0, 2)) - parseInt(startTime.substr(0, 2))) +
              (parseInt(endTime.substr(3, 2)) - parseInt(startTime.substr(3, 2))) / 60).toFixed(2) + '小时'
            // this.form.getFieldDecorator('schePreriod',{initialValue:a })
            // this.form.getFieldDecorator('scheTimes',{initialValue:b })
            this.form.setFieldsValue({
              schePreriod: a
            })
            this.form.setFieldsValue({
              scheTimes: b
            })
            this.periodStr = b
            // document.getElementById("sp").innerHTML=b
          }
        }
      },
      timeChangeEnd(value,dateString) {
        var startTime =moment(this.form.getFieldValue('startTime')).format("HH:mm")
        var endTime =dateString
        if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
          if (startTime.length !== 0 && endTime.length !== 0) {
            var a=startTime + '-' + endTime
            var b=((parseInt(endTime.substr(0, 2)) - parseInt(startTime.substr(0, 2))) +
              (parseInt(endTime.substr(3, 2)) - parseInt(startTime.substr(3, 2))) / 60).toFixed(2) + '小时'

            //这种方式渲染不及时
            // this.form.getFieldDecorator('schePreriod',{initialValue:a })
            // this.form.getFieldDecorator('scheTimes',{initialValue:b })

            this.form.setFieldsValue({
              schePreriod: a
            })
            this.form.setFieldsValue({
              scheTimes: b
            })
            this.periodStr = b
            // document.getElementById("sp").innerHTML=b
            
          }
        }
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            schedulerEdit(values).then((res) => {
              if(res.success){
                this.$message.success('编辑成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields();
              }else{
                this.$message.error('编辑失败：'+res.message)
              }
            }).finally((res) =>{
              this.confirmLoading = false
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.form.resetFields();
        this.visible = false
      }
    }
  }
</script>
