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

        <div class="content">
          <div class="left">
            <a-form-item label="角色权限" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
              <div
                class="item"
                v-for="item in list"
                :key="item.id"
                :class="{active: item.id === currentItem.id}"
                @click="itemClick(item)"
              >
                <a-checkbox
                  class="check"
                  :checked="(item.checkedKeys||[]).length > 0"
                  @change="onItemChange"
                ></a-checkbox>
                <span class="name">{{ item.applicationName }}</span>
              </div>
            </a-form-item>
          </div>
          <div
            class="right"
            v-for="item in list"
            :key="item.id"
            v-show="item.id === currentItem.id"
          >
            <a-form-item label="菜单权限" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
              <a-radio-group name="radioGroup" @change="radioChange" v-model="item.radio">
                <a-radio :value="1">全选</a-radio>
                <a-radio :value="2">全不选</a-radio>
                <a-radio :value="3">部分选择</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item style="margin-left: 85px;" label="" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-tree checkable v-model="item.checkedKeys" :tree-data="item.treeData" @select="onSelect" @check="onCheck" />
            </a-form-item>
          </div>
        </div>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { list } from '@/api/modular/system/sysapp'
import { getMenuTree, addRole } from '@/api/modular/system/posManage'

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
      labelCol2: {
        span: 5,
        offset:0
      },
      wrapperCol2: {
        span: 19,
        offset:0
      },
      grantMenuIdList: [],
      replaceFields: {
        children: 'child',
        title: 'name',
      },
      checkedKeys: [],
      halfKeys: [],
      allKeys: [],

      isOpen: true,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,
      treeData: [],

      list: [],
      currentItem: {},

      form: this.$form.createForm(this),
    }
  },

  created() {},

  methods: {
    //初始化方法
    add() {
      this.list = []
      this.allKeys = []
      this.halfKeys = []
      this.treeData = []
      this.visible = true
      this.checkedKeys = []
      this.getList()
    },
    getList() {
      list({
        status: 1
      }).then(res => {
        if (res.code === 0){
          this.list = res.data || []
          this.currentItem = this.list[0] || {}
          if (this.list.length > 0){
            this.confirmLoading = true
            this.list.forEach((item, index) => {
              getMenuTree({
                applicationIds: item.id
              }).then(res2 => {
                if (res2.code === 0) {
                  res2.data = res2.data || []
                  const allKeys = []
                  const treeData = this.transfromData(res2.data, allKeys)
                  this.$set(item, 'radio', 2)
                  this.$set(item, 'halfKeys', [])
                  this.$set(item, 'checkedKeys', [])
                  this.$set(item, 'allKeys', allKeys)
                  this.$set(item, 'treeData', treeData)
                } else {
                  this.$message.error(res2.message)
                }
              }).finally(() => {
                if (index === this.list.length - 1){
                  this.confirmLoading = false
                }
              })
            })
          }
        }else {
          this.$message.error(res.message)
        }
      })
    },
    itemClick(item) {
      this.currentItem = item
    },
    onItemChange(e) {
      if (e.target.checked){
        this.$set(this.currentItem, 'radio', 1)
        this.$set(this.currentItem, 'checkedKeys', this.currentItem.allKeys)
      }else {
        this.$set(this.currentItem, 'radio', 2)
        this.$set(this.currentItem, 'checkedKeys', [])
      }
    },

    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      this.$set(this.currentItem, 'halfKeys', info.halfCheckedKeys)
      console.log('onCheck2', this.currentItem.checkedKeys, info)
      if (this.currentItem.checkedKeys.length === 0){
        this.$set(this.currentItem, 'radio', 2)
      }else if (this.currentItem.checkedKeys.length === this.currentItem.allKeys.length){
        this.$set(this.currentItem, 'radio', 1)
      }else {
        this.$set(this.currentItem, 'radio', 3)
      }
    },
    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    radioChange(event) {
      if (event.target.value == 1) {
        //全选
        this.$set(this.currentItem, 'checkedKeys', this.currentItem.allKeys)
      } else if (event.target.value == 2) {
        //全不选
        this.$set(this.currentItem, 'checkedKeys', [])
      }
    },

    transfromData(data, allKeys) {
      for (let index = 0; index < data.length; index++) {
        data[index].name = data[index].title
        data[index].key = data[index].id
        // this.$set(data[index], 'name', data[index].title)
        // this.$set(data[index], 'key', data[index].id)
        // this.$set(data[index], 'checked', true)
        allKeys.push(data[index].key)

        if (data[index].children && data[index].children.length > 0) {
          this.transfromData(data[index].children, allKeys)
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
          this.halfKeys = []
          this.checkedKeys = []
          this.list.forEach(item => {
            this.halfKeys = this.halfKeys.concat(item.halfKeys || [])
            this.checkedKeys = this.checkedKeys.concat(item.checkedKeys || [])
          })
          if (this.checkedKeys.length == 0) {
            this.$message.error('请选择菜单权限')
            this.confirmLoading = false
            return
          }
          let state = this.isOpen ? 1 : 0
          // let sdd = this.randomString(8)

          let uploadKeys = JSON.parse(JSON.stringify(this.checkedKeys))
          if (this.halfKeys.length > 0) {
            uploadKeys = uploadKeys.concat(this.halfKeys)
          }

          let param = {
            roleRealName: values.roleRealName,
            orderId: parseInt(values.orderId),
            // roleName: sdd,
            roleName: this.randomString(8),
            state: state,
            grantMenuIdList: uploadKeys,
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
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  overflow: hidden;
  .left {
    float: left;
    width: 300px;
    margin-left: 115px;
    overflow-y: auto;
    .item {
      padding: 7px 0;
      font-size: 12px;
      color: #000000;
      line-height: 21px;
      text-align: left;
      cursor: pointer;
      &:first-child {
        margin-top: 2px;
      }
      &.active {
        color: #1890ff;
      }
      .name {
        margin-left: 5px;
      }
    }
  }
  .right {
    float: right;
    width: calc(100% - 415px);
    border-left: 1px solid #e8e8e8;
  }
}
</style>
