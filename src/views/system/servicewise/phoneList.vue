<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParams.templateTitle"
                allow-clear
                placeholder="请输入姓名"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="手机号">
              <a-input
                v-model="queryParams.templateTitle"
                allow-clear
                placeholder="请输入手机号"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="执行科室">
              <!-- <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室"> -->
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="随访方式">
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择随访方式">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button type="primary" @click="$refs.table.refresh(true)" icon="search">查询</a-button>
            <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>

        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select allow-clear v-model="queryParams.templateTi" placeholder="请选择状态">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :sm="24">
            <a-form-item label="执行日期">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button style="margin-left: 10%" type="primary" @click="goVise()" icon="reload">显示/隐藏</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <!-- add -->
      <span slot="content" slot-scope="text, record">
        <div :title="record.templateContent">{{ record.templateContent }}</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="changeModel(record)" :disabled="record.templateStatus == 2">修改</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">{{ record.enableStatus }}</a>
      </span>
    </s-table>

    <a-drawer
      width="100"
      :mask="false"
      :closable="false"
      :visible="visible"
      @close="onClose"
      style="display: flex; flex-direction: row"
    >
      <a-button type="primary" @click="showChildrenDrawer"> 显示 </a-button>
      <a-drawer
        title=""
        width="320"
        :closable="false"
        :mask="false"
        :visible="childrenDrawer"
        @close="onChildrenDrawerClose"
      >
        <a-button type="primary" @click="hideChildrenDrawer"> 隐藏 </a-button>
      </a-drawer>
      <!-- <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="marginright: 8px" @click="onClose"> Cancel </a-button>
        <a-button type="primary" @click="onClose"> Submit </a-button>
      </div> -->
    </a-drawer>
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { getSmsTemplateList, changeStatusSmsTemplate } from '@/api/modular/system/posManage'
// import adddxtemplate from './adddxtemplate'
export default {
  components: {
    STable,
    // adddxtemplate,
  },
  data() {
    return {
      isOpen: true,
      childrenDrawer: true,
      datas: [],
      keshiData: [],
      queryParams: {
        templateTitle: '',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: true,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '模板名称',
          dataIndex: 'templateTitle',
          width: 200,
        },
        {
          title: '内部编码',
          dataIndex: 'templateInsideCode',
          width: 300,
        },
        {
          title: '模板ID',
          dataIndex: 'templateId',
          width: 180,
        },
        {
          title: '模板内容',
          scopedSlots: { customRender: 'content' },
          // width: 350,
        },
        {
          title: '状态',
          dataIndex: 'zt',
          width: 80,
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
        this.confirmLoading = true
        return getSmsTemplateList(Object.assign(parameter, this.queryParams)).then((res) => {
          // console.log('请求结果:', res.message)
          this.confirmLoading = false
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages / parameter.pageSize,
            rows: res.data.records,
          }
          data.rows.forEach((item, index) => {
            this.$set(item, 'zt', item.templateStatus == 1 ? '正常' : '停用')
            this.$set(item, 'enableStatus', item.templateStatus == 1 ? '停用' : '启用')
          })

          return data
        })
      },
    }
  },
  methods: {
    /**
     * 重置
     */
    reset() {
      if (this.queryParams.templateTitle != '') {
        this.queryParams.templateTitle = ''
      }
    },

    goVise() {
      this.visible = !this.visible
    },

    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    showChildrenDrawer() {
      this.childrenDrawer = true
    },
    hideChildrenDrawer() {
      this.childrenDrawer = false
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      record.templateStatus = record.templateStatus == 1 ? 2 : 1
      record.enableStatus = record.templateStatus == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        templateStatus: record.templateStatus,
      }
      this.confirmLoading = true
      //更新接口调用
      changeStatusSmsTemplate(queryParamData)
        .then((res) => {
          if (res.success) {
            this.confirmLoading = false
            this.$message.success('操作成功!')
            this.handleOk()
          } else {
            this.$message.error('编辑失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 新增 短信模板
     */
    addModel2() {
      console.log('新增 短信模板 按钮')
      this.$router.push({
        name: 'sys_dxtemplate_add',
        query: {},
      })
      // this.$router.push( {path:'./adddxtemplate'})
      // this.$router.push({ name: 'sys_dxtemplate_add', data: null })
    },

    /**
     * 修改
     */
    changeModel(record) {
      this.$router.push({
        name: 'sys_dxtemplate_add',
        query: {
          id: record.id,
        },
      })
      // this.$router.push({ path: './adddxtemplate?id=' + record.id })
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
    <style lang="less">
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>