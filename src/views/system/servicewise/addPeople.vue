<template>
  <a-modal
    title="添加人员"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="add-wrap">
        <div class="add-wrap-left">
          <!-- size="large" -->
          <a-auto-complete
            style="width: 100%; font-size: 14px"
            placeholder="请输入并选择"
            option-label-prop="title"
            @select="onSelect"
            @search="handleSearch"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in keshiDataTemp" :key="item.departmentId + ''" :title="item.departmentName">
                {{ item.departmentName }}
              </a-select-option>
            </template>
          </a-auto-complete>

          <div class="left-num-des">
            <span><span style="color: red">*</span> 选择人员</span>

            <span style="margin-left: 50%">已选人数<span style="color: #1890ff">2/2</span> 人</span>
          </div>

          <span style="margin-left: 9%; margin-top: 1%">*儿科</span>

          <div class="item-person" v-for="(item, index) in persons" :key="index" :value="item.id">
            <span style="margin-left: 15%; margin-top: 1%; flex: 1">{{ item.name }}</span>
            <a-icon style="margin-top: 1%; color: #1890ff" type="plus" @click="addPerson" />
          </div>
        </div>

        <div class="divider-col"></div>

        <div class="add-wrap-right">
          <a-table
            ref="table"
            :pagination="false"
            size="default"
            style="margin-left: 2%"
            :columns="columns"
            :data-source="persons"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a-icon type="delete" @click="deleteChoosed(record)" theme="filled" style="color: #1890ff;margin-left: 10px;" />
            </span>
            <span slot="act_num" slot-scope="text, record">
              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 100px"
                v-model="record.num"
                :min="0"
                :max="10000"
                :maxLength="30"
                allow-clear
                placeholder="请输入数量"
              />
            </span>
          </a-table>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getPlatTypeList } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      index: -1,
      chooseName: '',
      persons: [
        { id: 1, name: '张三' },
        { id: 2, name: '张五' },
      ],
      confirmLoading: false,
      visible: false,
      columns: [
        {
          title: '序号',
          width: 60,
          // innerHeight:20,
          dataIndex: 'id',
        },
        {
          title: '姓名',
          width: 100,
          dataIndex: 'name',
        },
        {
          title: '分配权重',
          width: 100,
          scopedSlots: { customRender: 'act_num' },
        },
        {
          title: '操作',
          width: 100,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  methods: {
    //初始化方法
    add(index) {
      // this.type = ''
      this.index = index
      this.visible = true
    },

    onSelect() {},
    handleSearch() {},

    addPerson() {
      this.persons.push({ id: 1, name: '张三d' })
    },

    deleteChoosed(record) {
      this.persons.splice(this.persons.indexOf(record), 1)
    },

    handleSubmit() {
      this.$emit('ok', this.index, typeBean)
      this.visible = false
    },
    handleCancel() {
      // this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.add-wrap {
  width: 100%;
  // height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .add-wrap-left {
    width: 45%;
    display: flex;

    flex-direction: column;

    .left-num-des {
      display: flex;
      margin-top: 2%;
      flex-direction: row;
      align-items: center;
    }

    .item-person {
      width: 90%;
      margin-top: 2%;
      display: flex;
      flex-direction: row;
    }
  }

  .divider-col {
    width: 2px;
    // height: 100%;
    margin-left: 2%;
    background-color: #eee;
  }
  .add-wrap-right {
    width: 45%;
    margin-left: 2%;
    display: flex;
    flex-direction: column;

    // /deep/.ant-table-row .ant-table-row-level-0 {
    //   height: 10% !important;
    // }

    /deep/ .ant-table-tbody > tr > td {
      padding: 5px;
    }
    //调整head行属性
    /deep/ .ant-table-thead > tr > th {
      padding: 5px;
    }
  }
}
</style>
