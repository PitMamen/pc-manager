<template>
  <a-modal
    title="新增角色"
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
          <!-- :replace-fields="replaceFields" -->
          <!-- :checked-keys="checkedKeys" -->
          <a-tree checkable :tree-data="treeData" @select="onSelect" @check="onCheck" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getMenuTreeGrant, addRole } from '@/api/modular/system/posManage'

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
      grantMenuIdList: [],
      replaceFields: {
        children: 'child',
        title: 'name',
      },
      checkedKeys: [],
      allKeys: [],

      isOpen: true,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,
      treeData: [],

      form: this.$form.createForm(this),
    }
  },

  created() {},

  methods: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      this.checkedKeys = checkedKeys.concat(info.halfCheckedKeys) //将父节点拼接到子节点
      console.log('onCheck2', this.checkedKeys, info)
    },
    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    radioChange(event) {
      debugger
      if (event.target.value == 1) {
        //全选
        // this.checkedKeys = JSON.parse(JSON.stringify(this.allKeys))
        this.checkedKeys = this.allKeys
      } else if (event.target.value == 2) {
        //全不选
        this.checkedKeys = []
      }
    },
    //初始化方法
    add() {
      this.visible = true
      getMenuTreeGrant({}).then((res) => {
        if (res.code == 0) {
          this.treeData = this.transfromData(res.data)
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    transfromData(data) {
      for (let index = 0; index < data.length; index++) {
        data[index].name = data[index].title
        data[index].key = data[index].id
        // this.$set(data[index], 'name', data[index].title)
        // this.$set(data[index], 'key', data[index].id)
        // this.$set(data[index], 'checked', true)
        this.allKeys.push(data[index].key)

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
          debugger
          let state = this.isOpen ? 1 : 0
          // let sdd = this.randomString(8)
          let param = {
            roleRealName: values.roleRealName,
            orderId: parseInt(values.orderId),
            // roleName: sdd,
            roleName: this.randomString(8),
            state: state,
            grantMenuIdList: this.checkedKeys,
          }
          addRole(param)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
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

    randomString(e) {
      e = e || 11
      var t = 'ABCDEFGHJKMNPQRdergfrehjikuykiawSTWXYZabcdefhijkmnprstwxyzdewfgwerg',
        a = t.length,
        n = ''
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
      return n
    },

    // for (let i = 0; i < res.data.length; i++) {
    //   this.$set(res.data[i], 'xh', i + 1)
    // }
    //组装数据
    // treeData: [
    //   {
    //     name: 'parent 1',
    //     key: '0-0',
    //     child: [
    //       {
    //         name: '张晨成',
    //         key: '0-0-0',
    //         disabled: true,
    //         child: [
    //           { name: 'leaf', key: '0-0-0-0', disableCheckbox: true },
    //           { name: 'leaf', key: '0-0-0-1' },
    //         ],
    //       },
    //       {
    //         name: 'parent 1-1',
    //         key: '0-0-1',
    //         child: [{ key: '0-0-1-0', name: 'zcvc' }],
    //       },
    //     ],
    //   },
    // ],

    /**
           * {
  "code": 0,
  "success": true,
  "message": "操作成功",
  "data": [
    {
      "id": 3,
      "parentId": 0,
      "title": "服务配置",
      "value": "3",
      "weight": 100,
      "children": [
        {
          "id": 4,
          "parentId": 3,
          "title": "计划配置",
          "value": "4",
          "weight": 100,
          "children": [
            
          ],
          "pid": 3
        },
        {
          "id": 5,
          "parentId": 3,
          "title": "问卷管理",
          "value": "5",
          "weight": 100,
          "children": [
            
          ],
          "pid": 3
        },
        {
          "id": 6,
          "parentId": 3,
          "title": "检查配置",
          "value": "6",
          "weight": 100,
          "children": [
            
          ],
          "pid": 3
        },
           */
  },
}
</script>
