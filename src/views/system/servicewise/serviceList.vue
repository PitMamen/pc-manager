<template>
        <a-card :bordered="false">
          <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="3" :sm="24">
                  <a-form-item label="">
                    <a-button type="primary" @click="addPlan">新增card</a-button>
                  </a-form-item>
                </a-col>


              </a-row>
            </a-form>
          </div>


          <!-- <add-form ref="addForm" @ok="handleOk" /> -->
          <!-- <edit-form ref="editForm" @ok="handleOk" /> -->
        </a-card>
</template>


<script>
  import { sysPosAdd } from '@/api/modular/system/posManage'
  export default {
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
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
      //初始化方法
      add (record) {
        this.visible = true
      },

      addPlan(){
        this.$router.push({ name: 'project_add' })
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            sysPosAdd(values).then((res) => {
              if(res.success){
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields();
              }else{
                this.$message.error('新增失败：'+res.message)
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
