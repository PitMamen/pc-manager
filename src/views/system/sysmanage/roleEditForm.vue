<template>
  <a-modal
    title="编辑角色"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入角色名称"
            v-decorator="['roleRealName', { rules: [{ required: true, message: '请输入角色名称！' }] }]"
          />
        </a-form-item>

        <a-form-item label="显示顺序" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入显示顺序"
            type="number"
            v-decorator="['orderId', { rules: [{ required: true, message: '请输入显示顺序！' }] }]"
          />
        </a-form-item>

        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- v-decorator="['isOpen', { rules: [{ message: '请选择用户状态！' }] }]" -->
          <a-switch @change="isOpenChange" :checked="isOpen" />
        </a-form-item>

        <a-form-item label="菜单权限" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- v-decorator="['treeState', { rules: [{ required: true, message: '请选择菜单权限！' }] }]" -->
          <a-radio-group name="radioGroup" @change="radioChange" :default-value="2">
            <a-radio :value="1"> 全选 </a-radio>
            <a-radio :value="2" style="width: 100px"> 全不选 </a-radio>
            <!-- <a-radio :value="3" style="width: 100px"> 父子联动 </a-radio> -->
          </a-radio-group>
        </a-form-item>

        <a-form-item style="margin-left: 28%" label="" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- :default-expanded-keys="['0-0-0', '0-0-1']"
            :default-selected-keys="['0-0-0', '0-0-1']"
            :default-checked-keys="['0-0-0', '0-0-1']" -->
          <!-- :checked-keys="checkedKeys" -->
          <!-- :replace-fields="replaceFields" -->
          <a-tree
            checkable
            :tree-data="treeData"
            v-model="checkedKeys"
            @select="onSelect"
            @check="onCheck"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getMenuTree, delOrEditRole } from '@/api/modular/system/posManage'

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
      // replaceFields: {
      //   children: 'child',
      //   title: 'name',
      // },
      checkedKeys: [],
      allKeys: [],
      record: {},
      isOpen: true,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,
      treeData: [],

      form: this.$form.createForm(this),
    }
  },

  watch: {
    checkedKeys(val) {
      console.log('watchCheck', val)
    },
  },

  created() {},

  methods: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      // 单选选不中的问题在这里
      // this.checkedKeys = checkedKeys.concat(info.halfCheckedKeys) //将父节点拼接到子节点
      console.log('onCheck2', this.checkedKeys, info)
    },
    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    radioChange(event) {
      if (event.target.value == 1) {
        //全选
        // this.checkedKeys = JSON.parse(JSON.stringify(this.allKeys))
        this.checkedKeys = this.allKeys
        console.log('radioChange', this.checkedKeys)
      } else if (event.target.value == 2) {
        //全不选
        this.checkedKeys = []
        console.log('radioChange2', this.checkedKeys)
      }
    },
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = record
      this.treeData = []
      console.log('record', this.record)
      this.checkedKeys = []
      getMenuTree({}).then((res) => {
        if (res.code == 0) {
          this.treeData = this.transfromData(res.data)
          console.log('this.treeData', this.treeData)
          // this.checkedKeys = record.grantMenuIdList
          this.checkedKeys = [5,4]

          console.log('checkedKeys', this.checkedKeys)
          this.isOpen = record.state == 1 ? true : false
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })

      setTimeout(() => {
        this.form.setFieldsValue({
          roleRealName: record.roleRealName,
          orderId: record.orderId,
        })
      }, 100)
    },

    transfromData(data) {
      for (let index = 0; index < data.length; index++) {
        data[index].name = data[index].title
        data[index].key = data[index].id
        // this.$set(data[index], 'name', data[index].title)
        // this.$set(data[index], 'key', data[index].id)

        this.allKeys.push(data[index].key)

        for (let i = 0; i < this.record.grantMenuIdList.length; i++) {
          if (data[index].key == this.record.grantMenuIdList[i]) {
            data[index].checked = true
            console.log('checked transfromData', true + '' + data[index].key)
            // this.$set(data[index], 'checked', true)
          } else {
            data[index].checked = false
            console.log('checked transfromData', false + '' + data[index].key)
            // this.$set(data[index], 'checked', false)
          }
        }

        if (data[index].children && data[index].children.length > 0) {
          this.transfromData(data[index].children)
        }
      }
      return data
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.checkedKeys.length == 0) {
            this.$message.error('请选择菜单权限')
            return
          }
          let state = this.isOpen ? 1 : 0
          let param = {
            roleRealName: values.roleRealName,
            orderId: parseInt(values.orderId),
            // roleName: sdd,
            roleName: this.record.roleName,
            roleId: this.record.roleId,
            state: state,
            grantMenuIdList: this.checkedKeys,
          }
          delOrEditRole(param)
            .then((res) => {
              if (res.success) {
                this.$message.success('编辑成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('编辑失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

  },
}
</script>
