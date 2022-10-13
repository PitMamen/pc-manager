<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="方案名称">
              <a-input
                v-model="queryParams.userName"
                allow-clear
                placeholder="可输入方案名称或人员姓名查询"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
                  <a-form-item label="执行科室">
                    <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室">
                      <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                        item.departmentName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
          <a-col :md="10" :sm="24">
            <a-form-item label="方案状态:">
              <!-- <a-popconfirm class="switch-button"> -->
                <a-switch :checked="true" />
              <!-- </a-popconfirm> -->
              <a-button style="margin-left: 20%" type="primary" @click="$refs.table.refresh(true)" icon="search">查询</a-button>
              <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button style="margin-left: 95%" type="primary" @click="addName()" icon="plus">新增</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.checkindex.check(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">停用</a>
      </span>
    </s-table>

    <check-index ref="checkindex" @ok="handleOk" />
    <add-Name ref="addName" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'
import { qryMetaConfigure ,  getDeptsPersonal,getDepts} from '@/api/modular/system/posManage'
import checkindex from './checkIndex'
import addName from './addName'
export default {
  components: {
    STable,
    checkindex,
    addName,
  },
  data() {
    return {
      keshiData: [],
      originData:[],
      idArr: [],
      queryParams: {
        databaseTableName: '',
        pageNo: 1,
        pageSize: 10
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '方案名称',
          dataIndex: 'metaName',
        },
        {
          title: '指定时间',
          dataIndex: 'databaseTableName',
        },
        {
          title: '制定人员',
          dataIndex: 'databaseTableFieldName',
        },
        {
          title: '执行科室',
          dataIndex: 'pushInterfaceType',
        },
        {
          title: '随访名单',
          dataIndex: 'pushInterfaceType',
        },
        {
          title: '随访类型',
          dataIndex: 'pushInterfaceType',
        },
        {
          title: '状态',
          dataIndex: 'pushInterfaceType',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryMetaConfigure(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0) {
            console.log('请求结果:', res.message)
          }
          return res.data
        })
      },
    }
  },
  created(){
    getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data

          this.keshiData = JSON.parse(JSON.stringify(res.data))
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))

          this.originDataStat = JSON.parse(JSON.stringify(res.data))
        
         
        }
      })
  },
  methods: {
    //初始化方法
    // add(record) {
    //   this.visible = true
    // },

    /**
     * 重置
     */
    reset() {},

    /**
     * 启用/停用
     */
    Enable() {},

    /**
     * 新增
     */
    addName() {
      // this.$refs.addName.add()
      this.$router.push({ name: 'project_add' })
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    // addPlan() {
    //   this.$message.info('clicked')
    // },

    // handleSubmit() {
    //   const {
    //     form: { validateFields },
    //   } = this
    //   this.confirmLoading = true
    //   validateFields((errors, values) => {
    //     if (!errors) {
    //       sysPosAdd(values)
    //         .then((res) => {
    //           if (res.success) {
    //             this.$message.success('新增成功')
    //             this.visible = false
    //             this.confirmLoading = false
    //             this.$emit('ok', values)
    //             this.form.resetFields()
    //           } else {
    //             this.$message.error('新增失败：' + res.message)
    //           }
    //         })
    //         .finally((res) => {
    //           this.confirmLoading = false
    //         })
    //     } else {
    //       this.confirmLoading = false
    //     }
    //   })
    // },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
